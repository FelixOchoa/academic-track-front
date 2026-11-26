# PostgreSQL 16 en RDS, sin acceso público. El backend aplica las migraciones y siembra los datos al arrancar.

resource "random_password" "db" {
  length  = 32
  special = false # va dentro de la cadena de conexión
}

resource "random_password" "jwt" {
  length  = 96
  special = false
}

resource "aws_db_subnet_group" "main" {
  name        = "${var.project}-db-subnets"
  description = "Subredes de AcademicTrack"
  subnet_ids  = local.subnet_ids
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project}-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = "academictrack"
  username = "academictrack"
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false

  # Adaptado al crédito del Learner Lab. En producción: multi_az = true, backups y deletion_protection.
  multi_az                = false
  backup_retention_period = 0
  deletion_protection     = false
  skip_final_snapshot     = true
  apply_immediately       = true
}

# ---------------------------------------------------------------- Secrets Manager
# ECS los inyecta como ConnectionStrings__DefaultConnection y Jwt__Key; nunca aparecen en la task definition.

resource "aws_secretsmanager_secret" "db_connection" {
  name                    = "${var.project}/db-connection"
  recovery_window_in_days = 0 # permite destruir y volver a crear en el lab
}

resource "aws_secretsmanager_secret_version" "db_connection" {
  secret_id     = aws_secretsmanager_secret.db_connection.id
  secret_string = "Host=${aws_db_instance.main.address};Port=5432;Database=academictrack;Username=academictrack;Password=${random_password.db.result};SSL Mode=Require"
}

resource "aws_secretsmanager_secret" "jwt_key" {
  name                    = "${var.project}/jwt-key"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "jwt_key" {
  secret_id     = aws_secretsmanager_secret.jwt_key.id
  secret_string = random_password.jwt.result
}
