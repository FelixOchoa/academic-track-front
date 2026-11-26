# Procesamiento de los Excel de indicadores con S3 + Lambda.
#
#   Usuario -> API (ECS) --PutObject--> s3://bucket/uploads/...xlsx
#                                          | evento ObjectCreated
#                                          v
#                          Lambda acadtrack-indicator-processor (.NET 8)
#                                          | PutObject
#                                          v
#   Panel <- API (ECS) <--GetObject-- s3://bucket/processed/{programa}/{sección}.json
#
# Así todas las réplicas de la API ven los mismos datos y sobreviven a cada despliegue.
#
# El bucket lo crea deploy.sh con la CLI y aquí se referencia con un data source: el recurso aws_s3_bucket
# lee la configuración de Object Lock después de crearlo, y el rol voclabs del Learner Lab tiene denegado
# s3:GetBucketObjectLockConfiguration. Todo lo demás del bucket (acceso público, cifrado, ciclo de vida,
# notificación) sí lo gestiona Terraform. destroy.sh lo vacía y lo borra al final.

data "aws_s3_bucket" "indicators" {
  bucket = "${var.project}-indicators-${local.account_id}"
}

resource "aws_s3_bucket_public_access_block" "indicators" {
  bucket                  = data.aws_s3_bucket.indicators.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "indicators" {
  bucket = data.aws_s3_bucket.indicators.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Los Excel originales solo se necesitan para reprocesar: se borran a los 30 días
resource "aws_s3_bucket_lifecycle_configuration" "indicators" {
  bucket = data.aws_s3_bucket.indicators.id
  rule {
    id     = "expirar-uploads"
    status = "Enabled"
    filter {
      prefix = "uploads/"
    }
    expiration {
      days = 30
    }
  }
}

# ---------------------------------------------------------------- Lambda

resource "aws_cloudwatch_log_group" "indicator_processor" {
  name              = "/aws/lambda/${var.project}-indicator-processor"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "indicator_processor" {
  function_name = "${var.project}-indicator-processor"
  description   = "Parsea los Excel de indicadores subidos a uploads/ y escribe las métricas en processed/"
  role          = local.role_arn
  runtime       = "dotnet8"
  handler       = "AcademicTrack.Lambda.IndicatorProcessor::AcademicTrack.Lambda.IndicatorProcessor.Function::FunctionHandler"
  architectures = ["x86_64"]
  memory_size   = 512
  timeout       = 60

  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.indicator_processor.name
  }
}

# Invocación asíncrona desde S3: 2 reintentos y descartar eventos de más de 1 hora
resource "aws_lambda_function_event_invoke_config" "indicator_processor" {
  function_name                = aws_lambda_function.indicator_processor.function_name
  maximum_retry_attempts       = 2
  maximum_event_age_in_seconds = 3600
}

resource "aws_lambda_permission" "allow_s3" {
  statement_id   = "AllowS3Invoke"
  action         = "lambda:InvokeFunction"
  function_name  = aws_lambda_function.indicator_processor.function_name
  principal      = "s3.amazonaws.com"
  source_arn     = data.aws_s3_bucket.indicators.arn
  source_account = local.account_id
}

resource "aws_s3_bucket_notification" "indicators" {
  bucket = data.aws_s3_bucket.indicators.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.indicator_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/" # nunca processed/: evita que la Lambda se dispare a sí misma
  }

  depends_on = [aws_lambda_permission.allow_s3]
}

# Alarma si la Lambda falla (visible en CloudWatch; sin SNS para no depender de correos en el lab)
resource "aws_cloudwatch_metric_alarm" "indicator_processor_errors" {
  alarm_name          = "${var.project}-indicator-processor-errors"
  alarm_description   = "La Lambda de procesamiento de Excel tuvo errores"
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  dimensions          = { FunctionName = aws_lambda_function.indicator_processor.function_name }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 0
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
}
