resource "aws_ecs_cluster" "main" {
  name = "${var.project}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }
}

resource "aws_cloudwatch_log_group" "app" {
  for_each          = toset(["frontend", "backend"])
  name              = "/ecs/${var.project}-${each.key}"
  retention_in_days = var.log_retention_days
}

# ---------------------------------------------------------------- Task definitions

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = local.role_arn
  task_role_arn            = local.role_arn # LabRole también da acceso al bucket de indicadores

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name         = "api"
    image        = "${aws_ecr_repository.app["backend"].repository_url}:${var.image_tag}"
    essential    = true
    portMappings = [{ containerPort = 80, protocol = "tcp" }]
    environment = [
      { name = "ASPNETCORE_ENVIRONMENT", value = "Production" },
      { name = "ASPNETCORE_URLS", value = "http://+:80" },
      { name = "AWS_REGION", value = var.region },
      # Con el bucket configurado, la API sube los Excel a S3 y los procesa la Lambda (ver lambda.tf)
      { name = "Indicators__BucketName", value = aws_s3_bucket.indicators.bucket },
    ]
    secrets = [
      { name = "ConnectionStrings__DefaultConnection", valueFrom = aws_secretsmanager_secret.db_connection.arn },
      { name = "Jwt__Key", valueFrom = aws_secretsmanager_secret.jwt_key.arn },
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app["backend"].name
        awslogs-region        = var.region
        awslogs-stream-prefix = "api"
      }
    }
  }])

  # La versión del secreto debe existir antes de que una tarea intente leerlo
  depends_on = [aws_secretsmanager_secret_version.db_connection, aws_secretsmanager_secret_version.jwt_key]
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = local.role_arn
  task_role_arn            = local.role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name         = "web"
    image        = "${aws_ecr_repository.app["frontend"].repository_url}:${var.image_tag}"
    essential    = true
    portMappings = [{ containerPort = 3000, protocol = "tcp" }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app["frontend"].name
        awslogs-region        = var.region
        awslogs-stream-prefix = "web"
      }
    }
  }])
}

# ---------------------------------------------------------------- Services (2 zonas, rolling update con rollback)

resource "aws_ecs_service" "backend" {
  name            = "${var.project}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_min_count

  # El backend aplica migraciones y siembra datos al arrancar: necesita más gracia
  health_check_grace_period_seconds  = 180
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = local.subnet_ids
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "api"
    container_port   = 80
  }

  # Con auto scaling, el número de tareas lo decide la política, no Terraform
  lifecycle {
    ignore_changes = [desired_count]
  }

  depends_on = [aws_lb_listener_rule.api, aws_ecs_cluster_capacity_providers.main]
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.project}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count

  health_check_grace_period_seconds  = 60
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = local.subnet_ids
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "web"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http, aws_ecs_cluster_capacity_providers.main]
}

# ---------------------------------------------------------------- Auto scaling del backend (CPU objetivo 60 %)

resource "aws_appautoscaling_target" "backend" {
  count = var.enable_autoscaling ? 1 : 0

  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = var.backend_min_count
  max_capacity       = var.backend_max_count
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  count = var.enable_autoscaling ? 1 : 0

  name               = "${var.project}-cpu60"
  policy_type        = "TargetTrackingScaling"
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension

  target_tracking_scaling_policy_configuration {
    target_value       = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
