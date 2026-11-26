variable "region" {
  description = "Región de AWS (el Learner Lab solo permite us-east-1 y us-west-2)."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Prefijo de todos los recursos."
  type        = string
  default     = "acadtrack"
}

variable "image_tag" {
  description = "Etiqueta de las imágenes en ECR (inmutable): cambiarla provoca un rolling update."
  type        = string
  default     = "1.0"
}

variable "lab_role_name" {
  description = "Rol de IAM existente. En el Learner Lab no se pueden crear roles: se usa LabRole para ECS y Lambda."
  type        = string
  default     = "LabRole"
}

variable "lambda_zip_path" {
  description = "ZIP de la Lambda de procesamiento de Excel (lo genera deploy.sh con dotnet publish)."
  type        = string
  default     = "build/indicator-processor.zip"
}

variable "availability_zones" {
  description = "Zonas de las subredes por defecto donde corren el ALB, las tareas y RDS."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ---------------------------------------------------------------- Tamaños

variable "backend_cpu" {
  type    = number
  default = 512
}

variable "backend_memory" {
  type    = number
  default = 1024
}

variable "frontend_cpu" {
  type    = number
  default = 256
}

variable "frontend_memory" {
  type    = number
  default = 512
}

variable "frontend_desired_count" {
  type    = number
  default = 2
}

variable "backend_min_count" {
  type    = number
  default = 2
}

variable "backend_max_count" {
  type    = number
  default = 4
}

variable "enable_autoscaling" {
  description = "Auto scaling del backend por CPU. Algunos labs no lo permiten: en ese caso ponerlo en false."
  type        = bool
  default     = true
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "log_retention_days" {
  type    = number
  default = 7
}
