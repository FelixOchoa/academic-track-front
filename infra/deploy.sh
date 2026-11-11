#!/usr/bin/env bash
# Despliega AcademicTrack (frontend Next.js + backend .NET) en Amazon ECS con Fargate,
# imágenes en Amazon ECR y PostgreSQL en Amazon RDS, dentro del Learner Lab de AWS Academy.
#
# Uso (AWS CloudShell, o una terminal con AWS CLI v2, Docker y git), desde la raíz del frontend:
#   bash infra/deploy.sh                 # versión 1.0
#   TAG=1.1 bash infra/deploy.sh         # nueva versión: rolling update sin caída
#   BACKEND_REF=develop bash infra/deploy.sh   # otra rama del backend
#
# Es idempotente: si un recurso ya existe, lo reutiliza.
set -euo pipefail
cd "$(dirname "$0")/.."

REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$REGION"
export AWS_PAGER=""
P="acadtrack"
TAG="${TAG:-1.0}"
CLUSTER="$P-cluster"
BACKEND_REPO="${BACKEND_REPO:-https://github.com/Ana-Vega05/academic-track.git}"
BACKEND_REF="${BACKEND_REF:-main}"
ESTADO="infra/.estado"
GEN="infra/generado"
# Compilación fuera de /home: en CloudShell el directorio personal tiene 1 GB
BUILD="${BUILD_DIR:-/tmp/acadtrack-build}"
mkdir -p "$GEN" "$BUILD"
export NUGET_PACKAGES="$BUILD/nuget" npm_config_cache="$BUILD/npm-cache" DOTNET_CLI_TELEMETRY_OPTOUT=1 NEXT_TELEMETRY_DISABLED=1

log() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }
ok()  { printf '    %s\n' "$*"; }

log "0/11 Cuenta, rol y código del backend"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGISTRY="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"
ROLE_ARN=$(aws iam get-role --role-name LabRole --query Role.Arn --output text)
if [ -d "$BUILD/backend/.git" ]; then
  git -C "$BUILD/backend" fetch -q origin "$BACKEND_REF"
  git -C "$BUILD/backend" checkout -q -B "$BACKEND_REF" "origin/$BACKEND_REF"
else
  git clone -q -b "$BACKEND_REF" "$BACKEND_REPO" "$BUILD/backend"
fi
ok "Cuenta $ACCOUNT · región $REGION · versión $TAG"
ok "Backend $BACKEND_REF @ $(git -C "$BUILD/backend" rev-parse --short HEAD) · frontend $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)"

# Contraseña de la base de datos y clave JWT: se generan una vez y se guardan en infra/.estado (fuera de git)
touch "$ESTADO"
# shellcheck disable=SC1090
source "$ESTADO"
# Si el archivo local se perdió (otra sesión de CloudShell) pero ya hay un despliegue, se recuperan de Secrets Manager
if [ -z "${DB_PASSWORD:-}" ]; then
  CONN_ACTUAL=$(aws secretsmanager get-secret-value --secret-id "$P/db-connection" --query SecretString --output text 2>/dev/null || true)
  DB_PASSWORD=$(printf '%s' "$CONN_ACTUAL" | sed -n 's/.*Password=\([^;]*\).*/\1/p')
  [ -n "$DB_PASSWORD" ] && echo "DB_PASSWORD=$DB_PASSWORD" >> "$ESTADO"
fi
if [ -z "${JWT_KEY:-}" ]; then
  JWT_KEY=$(aws secretsmanager get-secret-value --secret-id "$P/jwt-key" --query SecretString --output text 2>/dev/null || true)
  [ -n "$JWT_KEY" ] && echo "JWT_KEY=$JWT_KEY" >> "$ESTADO"
fi
if [ -z "${DB_PASSWORD:-}" ]; then
  DB_PASSWORD=$(openssl rand -hex 16); echo "DB_PASSWORD=$DB_PASSWORD" >> "$ESTADO"
fi
if [ -z "${JWT_KEY:-}" ]; then
  JWT_KEY=$(openssl rand -hex 48); echo "JWT_KEY=$JWT_KEY" >> "$ESTADO"
fi

# ---------------------------------------------------------------- ECR
log "1/11 Repositorios en ECR e imágenes $TAG"
for app in frontend backend; do
  aws ecr describe-repositories --repository-names "$P-$app" >/dev/null 2>&1 || \
    aws ecr create-repository --repository-name "$P-$app" \
      --image-scanning-configuration scanOnPush=true \
      --image-tag-mutability IMMUTABLE >/dev/null
done
aws ecr get-login-password | docker login --username AWS --password-stdin "$REGISTRY" >/dev/null
# Se compila fuera de Docker y la imagen solo empaqueta el resultado: el Docker de CloudShell
# usa el driver vfs y una compilación multi-etapa con el SDK de .NET agota su disco.
existe() { aws ecr describe-images --repository-name "$P-$1" --image-ids imageTag="$TAG" >/dev/null 2>&1; }
empaquetar() { # app carpeta_con_el_resultado
  docker build --platform linux/amd64 -f "infra/docker/$1.Dockerfile" -t "$REGISTRY/$P-$1:$TAG" "$2"
  docker push "$REGISTRY/$P-$1:$TAG"
  docker system prune -af >/dev/null 2>&1 || true
}
if existe backend; then
  ok "$P-backend:$TAG ya está en ECR (las etiquetas son inmutables)"
else
  if ! command -v dotnet >/dev/null || ! dotnet --list-sdks | grep -q '^8\.'; then
    curl -sSL https://dot.net/v1/dotnet-install.sh -o "$BUILD/dotnet-install.sh"
    bash "$BUILD/dotnet-install.sh" --channel 8.0 --install-dir "$BUILD/dotnet" >/dev/null
    export PATH="$BUILD/dotnet:$PATH" DOTNET_ROOT="$BUILD/dotnet"
  fi
  rm -rf "$BUILD/publish-backend"
  dotnet publish "$BUILD/backend/AcademicTrack.API/AcademicTrack.API.csproj" -c Release \
    -o "$BUILD/publish-backend" /p:UseAppHost=false -nologo -v q
  empaquetar backend "$BUILD/publish-backend"
fi
if existe frontend; then
  ok "$P-frontend:$TAG ya está en ECR (las etiquetas son inmutables)"
else
  rm -rf "$BUILD/frontend" "$BUILD/publish-frontend" && mkdir -p "$BUILD/frontend" "$BUILD/publish-frontend/.next"
  tar --exclude=./node_modules --exclude=./.next --exclude=./infra --exclude=./.git -cf - . | tar -xf - -C "$BUILD/frontend"
  (cd "$BUILD/frontend" && unset NEXT_PUBLIC_API_URL && npm ci --no-audit --no-fund && npm run build)
  cp -r "$BUILD/frontend/.next/standalone/." "$BUILD/publish-frontend/"
  cp -r "$BUILD/frontend/.next/static" "$BUILD/publish-frontend/.next/static"
  cp -r "$BUILD/frontend/public" "$BUILD/publish-frontend/public"
  empaquetar frontend "$BUILD/publish-frontend"
fi

# ---------------------------------------------------------------- Red
log "2/11 VPC por defecto y subredes en dos zonas"
VPC=$(aws ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)
[ "$VPC" = "None" ] && { echo "No hay VPC por defecto en $REGION"; exit 1; }
SUBNETS=$(aws ec2 describe-subnets \
  --filters Name=vpc-id,Values="$VPC" Name=default-for-az,Values=true \
            Name=availability-zone,Values="${REGION}a,${REGION}b" \
  --query 'Subnets[].SubnetId' --output text)
SUBNET_CSV=$(echo $SUBNETS | tr ' ' ',')
ok "VPC $VPC · subredes $SUBNET_CSV"

log "3/11 Security groups encadenados: Internet -> ALB -> tareas -> RDS"
sg() {
  local id
  id=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values="$VPC" Name=group-name,Values="$1" \
       --query 'SecurityGroups[0].GroupId' --output text)
  if [ "$id" = "None" ]; then
    id=$(aws ec2 create-security-group --vpc-id "$VPC" --group-name "$1" --description "$2" --query GroupId --output text)
  fi
  echo "$id"
}
regla() { # grupo puerto origen
  if [[ $3 == sg-* ]]; then
    aws ec2 authorize-security-group-ingress --group-id "$1" --protocol tcp --port "$2" --source-group "$3" >/dev/null 2>&1 || true
  else
    aws ec2 authorize-security-group-ingress --group-id "$1" --protocol tcp --port "$2" --cidr "$3" >/dev/null 2>&1 || true
  fi
}
SG_ALB=$(sg "$P-sg-alb" "AcademicTrack ALB publico HTTP 80")
SG_APP=$(sg "$P-sg-app" "AcademicTrack tareas ECS, solo desde el ALB")
SG_DB=$(sg "$P-sg-db" "AcademicTrack RDS, solo desde las tareas")
regla "$SG_ALB" 80 0.0.0.0/0
regla "$SG_APP" 80 "$SG_ALB"
regla "$SG_APP" 3000 "$SG_ALB"
regla "$SG_DB" 5432 "$SG_APP"
ok "sg-alb $SG_ALB · sg-app $SG_APP · sg-db $SG_DB"

# ---------------------------------------------------------------- RDS (se crea primero porque tarda)
log "4/11 Base de datos RDS PostgreSQL 16 (tarda 5-10 minutos, sigue en paralelo)"
DB_ID="$P-db"
aws rds describe-db-subnet-groups --db-subnet-group-name "$P-db-subnets" >/dev/null 2>&1 || \
  aws rds create-db-subnet-group --db-subnet-group-name "$P-db-subnets" \
    --db-subnet-group-description "Subredes de AcademicTrack" --subnet-ids $SUBNETS >/dev/null
if aws rds describe-db-instances --db-instance-identifier "$DB_ID" >/dev/null 2>&1; then
  ok "La instancia $DB_ID ya existe"
else
  PG_VERSION=$(aws rds describe-db-engine-versions --engine postgres \
    --query "DBEngineVersions[?starts_with(EngineVersion, '16.')].EngineVersion | [-1]" --output text)
  aws rds create-db-instance --db-instance-identifier "$DB_ID" \
    --engine postgres --engine-version "$PG_VERSION" --db-instance-class db.t3.micro \
    --allocated-storage 20 --storage-type gp2 \
    --master-username academictrack --master-user-password "$DB_PASSWORD" --db-name academictrack \
    --vpc-security-group-ids "$SG_DB" --db-subnet-group-name "$P-db-subnets" \
    --no-publicly-accessible --no-multi-az --backup-retention-period 0 \
    --no-deletion-protection --storage-encrypted >/dev/null
  ok "Creando $DB_ID con PostgreSQL $PG_VERSION"
fi

# ---------------------------------------------------------------- Logs y clúster
log "5/11 Log groups y clúster ECS"
for app in frontend backend; do
  aws logs create-log-group --log-group-name "/ecs/$P-$app" 2>/dev/null || true
  aws logs put-retention-policy --log-group-name "/ecs/$P-$app" --retention-in-days 7
done
aws ecs create-cluster --cluster-name "$CLUSTER" \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --settings name=containerInsights,value=enabled >/dev/null
ok "Clúster $CLUSTER"

# ---------------------------------------------------------------- ALB
log "6/11 Application Load Balancer, target groups y reglas /api/* y /swagger*"
ALB_ARN=$(aws elbv2 describe-load-balancers --names "$P-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || \
          aws elbv2 create-load-balancer --name "$P-alb" --type application --scheme internet-facing \
            --subnets $SUBNETS --security-groups "$SG_ALB" --query 'LoadBalancers[0].LoadBalancerArn' --output text)
tg() { # nombre puerto ruta_health códigos
  aws elbv2 describe-target-groups --names "$1" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || \
  aws elbv2 create-target-group --name "$1" --protocol HTTP --port "$2" --vpc-id "$VPC" --target-type ip \
    --health-check-path "$3" --matcher HttpCode="$4" --health-check-interval-seconds 15 --healthy-threshold-count 2 \
    --query 'TargetGroups[0].TargetGroupArn' --output text
}
# El frontend redirige a /login cuando no hay sesión: se aceptan 200-399
TG_FRONT=$(tg "$P-tg-front" 3000 / 200-399)
# El backend no tiene endpoint de salud; Swagger está activo en producción y no depende de la base de datos
TG_BACK=$(tg "$P-tg-back" 80 /swagger/index.html 200)
for t in "$TG_FRONT" "$TG_BACK"; do
  aws elbv2 modify-target-group-attributes --target-group-arn "$t" \
    --attributes Key=deregistration_delay.timeout_seconds,Value=30 >/dev/null
done
LISTENER=$(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" --query 'Listeners[?Port==`80`].ListenerArn | [0]' --output text)
if [ "$LISTENER" = "None" ]; then
  LISTENER=$(aws elbv2 create-listener --load-balancer-arn "$ALB_ARN" --protocol HTTP --port 80 \
    --default-actions Type=forward,TargetGroupArn="$TG_FRONT" --query 'Listeners[0].ListenerArn' --output text)
fi
if [ "$(aws elbv2 describe-rules --listener-arn "$LISTENER" --query 'length(Rules)' --output text)" = "1" ]; then
  aws elbv2 create-rule --listener-arn "$LISTENER" --priority 10 \
    --conditions Field=path-pattern,Values='/api/*' --actions Type=forward,TargetGroupArn="$TG_BACK" >/dev/null
  aws elbv2 create-rule --listener-arn "$LISTENER" --priority 20 \
    --conditions Field=path-pattern,Values='/swagger*' --actions Type=forward,TargetGroupArn="$TG_BACK" >/dev/null
fi
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns "$ALB_ARN" --query 'LoadBalancers[0].DNSName' --output text)
ok "ALB $ALB_DNS"

# ---------------------------------------------------------------- Secretos
log "7/11 Esperando a RDS y guardando secretos en Secrets Manager"
aws rds wait db-instance-available --db-instance-identifier "$DB_ID"
DB_HOST=$(aws rds describe-db-instances --db-instance-identifier "$DB_ID" --query 'DBInstances[0].Endpoint.Address' --output text)
ok "RDS disponible en $DB_HOST"
secreto() { # nombre valor -> imprime ARN
  if aws secretsmanager describe-secret --secret-id "$1" >/dev/null 2>&1; then
    aws secretsmanager put-secret-value --secret-id "$1" --secret-string "$2" >/dev/null
  else
    aws secretsmanager create-secret --name "$1" --secret-string "$2" >/dev/null
  fi
  aws secretsmanager describe-secret --secret-id "$1" --query ARN --output text
}
CONN="Host=$DB_HOST;Port=5432;Database=academictrack;Username=academictrack;Password=$DB_PASSWORD;SSL Mode=Require"
SECRET_CONN=$(secreto "$P/db-connection" "$CONN")
SECRET_JWT=$(secreto "$P/jwt-key" "$JWT_KEY")
ok "Secretos $P/db-connection y $P/jwt-key"

# ---------------------------------------------------------------- Task definitions
log "8/11 Task definitions"
cat > "$GEN/td-backend.json" <<EOF
{
  "family": "$P-backend",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "runtimePlatform": { "operatingSystemFamily": "LINUX", "cpuArchitecture": "X86_64" },
  "executionRoleArn": "$ROLE_ARN",
  "taskRoleArn": "$ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "$REGISTRY/$P-backend:$TAG",
      "essential": true,
      "portMappings": [{ "containerPort": 80, "protocol": "tcp" }],
      "environment": [
        { "name": "ASPNETCORE_ENVIRONMENT", "value": "Production" },
        { "name": "ASPNETCORE_URLS", "value": "http://+:80" }
      ],
      "secrets": [
        { "name": "ConnectionStrings__DefaultConnection", "valueFrom": "$SECRET_CONN" },
        { "name": "Jwt__Key", "valueFrom": "$SECRET_JWT" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": { "awslogs-group": "/ecs/$P-backend", "awslogs-region": "$REGION", "awslogs-stream-prefix": "api" }
      }
    }
  ]
}
EOF
cat > "$GEN/td-frontend.json" <<EOF
{
  "family": "$P-frontend",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "256",
  "memory": "512",
  "runtimePlatform": { "operatingSystemFamily": "LINUX", "cpuArchitecture": "X86_64" },
  "executionRoleArn": "$ROLE_ARN",
  "taskRoleArn": "$ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "$REGISTRY/$P-frontend:$TAG",
      "essential": true,
      "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": { "awslogs-group": "/ecs/$P-frontend", "awslogs-region": "$REGION", "awslogs-stream-prefix": "web" }
      }
    }
  ]
}
EOF
TD_BACK=$(aws ecs register-task-definition --cli-input-json "file://$GEN/td-backend.json" --query taskDefinition.taskDefinitionArn --output text)
TD_FRONT=$(aws ecs register-task-definition --cli-input-json "file://$GEN/td-frontend.json" --query taskDefinition.taskDefinitionArn --output text)
ok "$TD_BACK"
ok "$TD_FRONT"

# ---------------------------------------------------------------- Services
log "9/11 Services (2 tareas cada uno, en 2 zonas)"
servicio() { # nombre task_definition target_group contenedor puerto gracia
  local estado
  estado=$(aws ecs describe-services --cluster "$CLUSTER" --services "$1" --query 'services[0].status' --output text 2>/dev/null || echo NONE)
  if [ "$estado" = "ACTIVE" ]; then
    aws ecs update-service --cluster "$CLUSTER" --service "$1" --task-definition "$2" >/dev/null
    ok "$1 actualizado a $2 (rolling update)"
  else
    aws ecs create-service --cluster "$CLUSTER" --service-name "$1" --task-definition "$2" --desired-count 2 \
      --capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
      --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_CSV],securityGroups=[$SG_APP],assignPublicIp=ENABLED}" \
      --load-balancers "targetGroupArn=$3,containerName=$4,containerPort=$5" \
      --health-check-grace-period-seconds "$6" \
      --deployment-configuration "deploymentCircuitBreaker={enable=true,rollback=true},maximumPercent=200,minimumHealthyPercent=100" >/dev/null
    ok "$1 creado"
  fi
}
# El backend aplica las migraciones y siembra datos al arrancar: necesita más gracia
servicio "$P-backend" "$TD_BACK" "$TG_BACK" api 80 180
servicio "$P-frontend" "$TD_FRONT" "$TG_FRONT" web 3000 60

log "10/11 Auto scaling del backend (2 a 4 tareas, CPU objetivo 60 %)"
if aws application-autoscaling register-scalable-target --service-namespace ecs \
     --resource-id "service/$CLUSTER/$P-backend" --scalable-dimension ecs:service:DesiredCount \
     --min-capacity 2 --max-capacity 4 >/dev/null 2>&1 && \
   aws application-autoscaling put-scaling-policy --service-namespace ecs \
     --resource-id "service/$CLUSTER/$P-backend" --scalable-dimension ecs:service:DesiredCount \
     --policy-name "$P-cpu60" --policy-type TargetTrackingScaling \
     --target-tracking-scaling-policy-configuration '{"TargetValue":60,"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"},"ScaleInCooldown":60,"ScaleOutCooldown":60}' >/dev/null 2>&1; then
  ok "Auto scaling configurado"
else
  ok "Auto scaling no permitido en este lab (queda documentado)"
fi

log "11/11 Esperando a que los services estén estables (3-8 minutos)"
aws ecs wait services-stable --cluster "$CLUSTER" --services "$P-backend" "$P-frontend"

echo
echo "Aplicación lista:  http://$ALB_DNS"
echo "Swagger del API:   http://$ALB_DNS/swagger"
echo "ALB_DNS=$ALB_DNS" > "$GEN/salida.txt"
