#!/usr/bin/env bash
# Borra todos los recursos de AcademicTrack en AWS para no gastar crédito del lab. No se puede deshacer.
# Uso, desde la raíz del frontend:  bash infra/destroy.sh
set -uo pipefail
cd "$(dirname "$0")/.."

REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$REGION"
export AWS_PAGER=""
P="acadtrack"
CLUSTER="$P-cluster"
log() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }

log "Services"
for s in "$P-frontend" "$P-backend"; do
  aws ecs update-service --cluster "$CLUSTER" --service "$s" --desired-count 0 >/dev/null 2>&1
  aws ecs delete-service --cluster "$CLUSTER" --service "$s" --force >/dev/null 2>&1
done
aws application-autoscaling deregister-scalable-target --service-namespace ecs \
  --resource-id "service/$CLUSTER/$P-backend" --scalable-dimension ecs:service:DesiredCount >/dev/null 2>&1
aws ecs wait services-inactive --cluster "$CLUSTER" --services "$P-frontend" "$P-backend" 2>/dev/null

log "Load balancer y target groups"
ALB_ARN=$(aws elbv2 describe-load-balancers --names "$P-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null)
if [ -n "$ALB_ARN" ] && [ "$ALB_ARN" != "None" ]; then
  aws elbv2 delete-load-balancer --load-balancer-arn "$ALB_ARN"
  aws elbv2 wait load-balancers-deleted --load-balancer-arns "$ALB_ARN"
fi
for t in "$P-tg-front" "$P-tg-back"; do
  arn=$(aws elbv2 describe-target-groups --names "$t" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null)
  [ -n "$arn" ] && [ "$arn" != "None" ] && aws elbv2 delete-target-group --target-group-arn "$arn"
done

log "Base de datos (tarda unos minutos)"
aws rds delete-db-instance --db-instance-identifier "$P-db" --skip-final-snapshot --delete-automated-backups >/dev/null 2>&1 && \
  aws rds wait db-instance-deleted --db-instance-identifier "$P-db"
aws rds delete-db-subnet-group --db-subnet-group-name "$P-db-subnets" 2>/dev/null
for s in "$P/db-connection" "$P/jwt-key"; do
  aws secretsmanager delete-secret --secret-id "$s" --force-delete-without-recovery >/dev/null 2>&1
done

log "Task definitions y clúster"
for fam in "$P-frontend" "$P-backend"; do
  for td in $(aws ecs list-task-definitions --family-prefix "$fam" --query 'taskDefinitionArns[]' --output text); do
    aws ecs deregister-task-definition --task-definition "$td" >/dev/null
  done
done
aws ecs delete-cluster --cluster "$CLUSTER" >/dev/null 2>&1

log "Repositorios ECR y logs"
for app in frontend backend; do
  aws ecr delete-repository --repository-name "$P-$app" --force >/dev/null 2>&1
  aws logs delete-log-group --log-group-name "/ecs/$P-$app" 2>/dev/null
done

log "Security groups (esperan a que se liberen las interfaces de red)"
VPC=$(aws ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)
for name in "$P-sg-db" "$P-sg-app" "$P-sg-alb"; do
  id=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values="$VPC" Name=group-name,Values="$name" --query 'SecurityGroups[0].GroupId' --output text)
  [ "$id" = "None" ] && continue
  for i in $(seq 1 20); do
    aws ec2 delete-security-group --group-id "$id" 2>/dev/null && break
    sleep 15
  done
done
rm -f infra/.estado
echo "Limpieza terminada."
