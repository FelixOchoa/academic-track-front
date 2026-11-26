#!/usr/bin/env bash
# Despliega AcademicTrack en AWS con Terraform: ECS Fargate + ECR + RDS + ALB + S3 + Lambda.
#
# Uso (AWS CloudShell del Learner Lab, o una terminal con AWS CLI v2, Docker y git), desde la raíz del frontend:
#   bash infra/terraform/deploy.sh                    # versión 1.0
#   TAG=1.1 bash infra/terraform/deploy.sh            # nueva versión: rolling update sin caída
#   BACKEND_REF=develop bash infra/terraform/deploy.sh
#
# Terraform no compila código: este script compila el backend, el frontend y la Lambda, sube las imágenes
# a ECR y le pasa a Terraform la etiqueta y el ZIP. Toda la infraestructura está en los .tf de esta carpeta.
set -euo pipefail
cd "$(dirname "$0")"
TF_DIR=$(pwd)
FRONT_DIR=$(cd ../.. && pwd)

REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$REGION" AWS_PAGER=""
P="${PROJECT:-acadtrack}"
TAG="${TAG:-1.0}"
BACKEND_REPO="${BACKEND_REPO:-https://github.com/Ana-Vega05/academic-track.git}"
BACKEND_REF="${BACKEND_REF:-main}"
TF_VERSION="${TF_VERSION:-1.17.2}"
# Compilación fuera de /home: en CloudShell el directorio personal tiene 1 GB
BUILD="${BUILD_DIR:-/tmp/acadtrack-build}"
mkdir -p "$BUILD" "$TF_DIR/build"
export NUGET_PACKAGES="$BUILD/nuget" npm_config_cache="$BUILD/npm-cache" DOTNET_CLI_TELEMETRY_OPTOUT=1 NEXT_TELEMETRY_DISABLED=1

log() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }
ok()  { printf '    %s\n' "$*"; }

# ---------------------------------------------------------------- Herramientas
log "1/7 Herramientas: Terraform $TF_VERSION y .NET 8"
if ! command -v terraform >/dev/null || ! terraform version | grep -q "v$TF_VERSION"; then
  mkdir -p "$BUILD/bin"
  if [ ! -x "$BUILD/bin/terraform" ] || ! "$BUILD/bin/terraform" version | grep -q "v$TF_VERSION"; then
    base="https://releases.hashicorp.com/terraform/$TF_VERSION"
    zip="terraform_${TF_VERSION}_linux_amd64.zip"
    curl -fsSL -o "$BUILD/$zip" "$base/$zip"
    curl -fsSL -o "$BUILD/tf.sha256" "$base/terraform_${TF_VERSION}_SHA256SUMS"
    (cd "$BUILD" && grep " $zip\$" tf.sha256 | sha256sum -c - >/dev/null)   # verifica la descarga
    python3 -c "import sys, zipfile; zipfile.ZipFile(sys.argv[1]).extract('terraform', sys.argv[2])" "$BUILD/$zip" "$BUILD/bin"
    chmod +x "$BUILD/bin/terraform"
  fi
  export PATH="$BUILD/bin:$PATH"
fi
if ! command -v dotnet >/dev/null || ! dotnet --list-sdks | grep -q '^8\.'; then
  if [ ! -x "$BUILD/dotnet/dotnet" ]; then
    curl -sSL https://dot.net/v1/dotnet-install.sh -o "$BUILD/dotnet-install.sh"
    bash "$BUILD/dotnet-install.sh" --channel 8.0 --install-dir "$BUILD/dotnet" >/dev/null
  fi
  export PATH="$BUILD/dotnet:$PATH" DOTNET_ROOT="$BUILD/dotnet"
fi
ok "$(terraform version | head -1) · .NET $(dotnet --version)"

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGISTRY="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"
ok "Cuenta $ACCOUNT · región $REGION · versión $TAG"

# ---------------------------------------------------------------- Código del backend
log "2/7 Código del backend ($BACKEND_REF)"
if [ -d "$BUILD/backend/.git" ]; then
  git -C "$BUILD/backend" fetch -q origin "$BACKEND_REF"
  git -C "$BUILD/backend" checkout -q -B "$BACKEND_REF" "origin/$BACKEND_REF"
else
  git clone -q -b "$BACKEND_REF" "$BACKEND_REPO" "$BUILD/backend"
fi
LAMBDA_PROJ="$BUILD/backend/AcademicTrack.Lambda.IndicatorProcessor/AcademicTrack.Lambda.IndicatorProcessor.csproj"
if [ ! -f "$LAMBDA_PROJ" ]; then
  echo "La rama $BACKEND_REF del backend no tiene AcademicTrack.Lambda.IndicatorProcessor."
  echo "Use la rama que la incluye, por ejemplo: BACKEND_REF=feature/lambda-procesamiento-excel bash infra/terraform/deploy.sh"
  exit 1
fi
ok "Backend @ $(git -C "$BUILD/backend" rev-parse --short HEAD) · frontend $(git -C "$FRONT_DIR" rev-parse --abbrev-ref HEAD) @ $(git -C "$FRONT_DIR" rev-parse --short HEAD)"

# ---------------------------------------------------------------- Estado remoto
log "3/7 Estado de Terraform en S3 (con bloqueo nativo)"
STATE_BUCKET="$P-tfstate-$ACCOUNT"
if ! aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$STATE_BUCKET" >/dev/null
  else
    aws s3api create-bucket --bucket "$STATE_BUCKET" --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
  fi
  aws s3api put-bucket-versioning --bucket "$STATE_BUCKET" --versioning-configuration Status=Enabled
  aws s3api put-public-access-block --bucket "$STATE_BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
fi
terraform init -input=false -reconfigure \
  -backend-config="bucket=$STATE_BUCKET" -backend-config="key=academictrack/terraform.tfstate" \
  -backend-config="region=$REGION" -backend-config="use_lockfile=true" -backend-config="encrypt=true" >/dev/null
ok "s3://$STATE_BUCKET/academictrack/terraform.tfstate"

TF_VARS=(-var "region=$REGION" -var "project=$P" -var "image_tag=$TAG" -var "lambda_zip_path=build/indicator-processor.zip")

# ---------------------------------------------------------------- Lambda
log "4/7 Compilando la Lambda de procesamiento de Excel"
rm -rf "$BUILD/publish-lambda" "$TF_DIR/build/indicator-processor.zip"
dotnet publish "$LAMBDA_PROJ" -c Release -o "$BUILD/publish-lambda" -nologo -v q
python3 - "$BUILD/publish-lambda" "$TF_DIR/build/indicator-processor.zip" <<'PY'
import os, sys, zipfile
src, out = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(src):
        for f in files:
            path = os.path.join(root, f)
            z.write(path, os.path.relpath(path, src))
PY
ok "build/indicator-processor.zip ($(du -h "$TF_DIR/build/indicator-processor.zip" | cut -f1))"

# ---------------------------------------------------------------- Imágenes
log "5/7 Repositorios de ECR e imágenes $TAG"
# Los repositorios deben existir antes de subir imágenes, y los services necesitan las imágenes:
# primero solo ECR, luego el resto.
terraform apply -input=false -auto-approve "${TF_VARS[@]}" -target=aws_ecr_repository.app >/dev/null
aws ecr get-login-password | docker login --username AWS --password-stdin "$REGISTRY" >/dev/null
existe() { aws ecr describe-images --repository-name "$P-$1" --image-ids imageTag="$TAG" >/dev/null 2>&1; }
empaquetar() { # app carpeta_con_el_resultado
  docker build --platform linux/amd64 -f "$FRONT_DIR/infra/docker/$1.Dockerfile" -t "$REGISTRY/$P-$1:$TAG" "$2"
  docker push "$REGISTRY/$P-$1:$TAG"
  docker system prune -af >/dev/null 2>&1 || true
}
if existe backend; then
  ok "$P-backend:$TAG ya está en ECR (las etiquetas son inmutables)"
else
  rm -rf "$BUILD/publish-backend"
  dotnet publish "$BUILD/backend/AcademicTrack.API/AcademicTrack.API.csproj" -c Release \
    -o "$BUILD/publish-backend" /p:UseAppHost=false -nologo -v q
  empaquetar backend "$BUILD/publish-backend"
fi
if existe frontend; then
  ok "$P-frontend:$TAG ya está en ECR (las etiquetas son inmutables)"
else
  rm -rf "$BUILD/frontend" "$BUILD/publish-frontend" && mkdir -p "$BUILD/frontend" "$BUILD/publish-frontend/.next"
  (cd "$FRONT_DIR" && tar --exclude=./node_modules --exclude=./.next --exclude=./infra --exclude=./.git --exclude=./.env -cf - .) | tar -xf - -C "$BUILD/frontend"
  # Sin NEXT_PUBLIC_API_URL: el frontend llama a /api en su mismo dominio y el ALB lo envía al backend
  (cd "$BUILD/frontend" && unset NEXT_PUBLIC_API_URL && npm ci --no-audit --no-fund && npm run build)
  cp -r "$BUILD/frontend/.next/standalone/." "$BUILD/publish-frontend/"
  cp -r "$BUILD/frontend/.next/static" "$BUILD/publish-frontend/.next/static"
  cp -r "$BUILD/frontend/public" "$BUILD/publish-frontend/public"
  empaquetar frontend "$BUILD/publish-frontend"
fi

# ---------------------------------------------------------------- Infraestructura
log "6/7 terraform apply (la primera vez tarda 10-20 minutos, sobre todo por RDS)"
terraform apply -input=false -auto-approve "${TF_VARS[@]}"

log "7/7 Esperando a que los services estén estables (3-8 minutos)"
aws ecs wait services-stable --cluster "$(terraform output -raw cluster_name)" --services "$P-backend" "$P-frontend"

echo
echo "Aplicación lista:  $(terraform output -raw app_url)"
echo "Swagger del API:   $(terraform output -raw swagger_url)"
echo "Lambda:            $(terraform output -raw indicator_processor_lambda) (logs en /aws/lambda/$P-indicator-processor)"
echo "Bucket de Excel:   s3://$(terraform output -raw indicators_bucket)"
