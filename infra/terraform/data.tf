data "aws_caller_identity" "current" {}

# En el Learner Lab no se pueden crear roles de IAM: ECS (execution y task role) y Lambda usan LabRole.
data "aws_iam_role" "lab" {
  name = var.lab_role_name
}

# VPC por defecto con sus subredes públicas. Sin NAT Gateway (costo): las tareas salen a ECR con IP pública
# y los security groups solo dejan entrar tráfico desde el balanceador.
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
  filter {
    name   = "availability-zone"
    values = var.availability_zones
  }
}

locals {
  account_id = data.aws_caller_identity.current.account_id
  registry   = "${local.account_id}.dkr.ecr.${var.region}.amazonaws.com"
  subnet_ids = sort(data.aws_subnets.default.ids)
  role_arn   = data.aws_iam_role.lab.arn
}
