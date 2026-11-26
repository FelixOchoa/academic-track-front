terraform {
  required_version = ">= 1.10.0" # use_lockfile del backend S3 (bloqueo sin DynamoDB)

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Estado remoto en S3 con bloqueo nativo. deploy.sh crea el bucket si no existe y pasa
  # bucket/key/region con -backend-config (el nombre lleva el ID de la cuenta del lab).
  backend "s3" {}
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project   = "AcademicTrack"
      ManagedBy = "Terraform"
    }
  }
}
