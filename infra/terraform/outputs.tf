output "app_url" {
  description = "URL de la aplicación"
  value       = "http://${aws_lb.main.dns_name}"
}

output "swagger_url" {
  description = "Swagger del API"
  value       = "http://${aws_lb.main.dns_name}/swagger"
}

output "ecr_registry" {
  value = local.registry
}

output "ecr_repositories" {
  value = { for k, r in aws_ecr_repository.app : k => r.repository_url }
}

output "indicators_bucket" {
  description = "Bucket de S3 con los Excel (uploads/) y las métricas procesadas (processed/)"
  value       = data.aws_s3_bucket.indicators.bucket
}

output "indicator_processor_lambda" {
  value = aws_lambda_function.indicator_processor.function_name
}

output "db_endpoint" {
  value = aws_db_instance.main.address
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}
