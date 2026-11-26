# Security groups encadenados: Internet -> ALB -> tareas ECS -> RDS

resource "aws_security_group" "alb" {
  name        = "${var.project}-sg-alb"
  description = "AcademicTrack ALB publico HTTP 80"
  vpc_id      = data.aws_vpc.default.id
}

resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  description       = "HTTP desde Internet"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "alb_all" {
  security_group_id = aws_security_group.alb.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_security_group" "app" {
  name        = "${var.project}-sg-app"
  description = "AcademicTrack tareas ECS, solo desde el ALB"
  vpc_id      = data.aws_vpc.default.id
}

resource "aws_vpc_security_group_ingress_rule" "app_backend" {
  security_group_id            = aws_security_group.app.id
  description                  = "API .NET desde el ALB"
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
  referenced_security_group_id = aws_security_group.alb.id
}

resource "aws_vpc_security_group_ingress_rule" "app_frontend" {
  security_group_id            = aws_security_group.app.id
  description                  = "Next.js desde el ALB"
  ip_protocol                  = "tcp"
  from_port                    = 3000
  to_port                      = 3000
  referenced_security_group_id = aws_security_group.alb.id
}

# Salida a Internet: ECR, Secrets Manager, CloudWatch Logs y S3 (indicadores)
resource "aws_vpc_security_group_egress_rule" "app_all" {
  security_group_id = aws_security_group.app.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_security_group" "db" {
  name        = "${var.project}-sg-db"
  description = "AcademicTrack RDS, solo desde las tareas"
  vpc_id      = data.aws_vpc.default.id
}

resource "aws_vpc_security_group_ingress_rule" "db_postgres" {
  security_group_id            = aws_security_group.db.id
  description                  = "PostgreSQL desde las tareas ECS"
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = aws_security_group.app.id
}
