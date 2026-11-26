#!/usr/bin/env bash
# Borra con Terraform todos los recursos de AcademicTrack para no gastar crédito del lab. No se puede deshacer.
# Uso, desde la raíz del frontend:  bash infra/terraform/destroy.sh
# El bucket del estado (acadtrack-tfstate-<cuenta>) se conserva; se puede borrar a mano al final.
set -euo pipefail
cd "$(dirname "$0")"

REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$REGION" AWS_PAGER=""
P="${PROJECT:-acadtrack}"
BUILD="${BUILD_DIR:-/tmp/acadtrack-build}"
[ -x "$BUILD/bin/terraform" ] && export PATH="$BUILD/bin:$PATH"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

terraform init -input=false -reconfigure \
  -backend-config="bucket=$P-tfstate-$ACCOUNT" -backend-config="key=academictrack/terraform.tfstate" \
  -backend-config="region=$REGION" -backend-config="use_lockfile=true" -backend-config="encrypt=true" >/dev/null

# La configuración lee el ZIP de la Lambda (filebase64sha256) aunque se vaya a destruir
mkdir -p build
[ -f build/indicator-processor.zip ] || python3 -c "import zipfile; zipfile.ZipFile('build/indicator-processor.zip','w').close()"

terraform destroy -input=false -auto-approve \
  -var "region=$REGION" -var "project=$P" -var "lambda_zip_path=build/indicator-processor.zip"

# El bucket de indicadores lo crea deploy.sh (no Terraform, por la restricción de Object Lock del lab)
aws s3 rb "s3://$P-indicators-$ACCOUNT" --force >/dev/null 2>&1 || true
