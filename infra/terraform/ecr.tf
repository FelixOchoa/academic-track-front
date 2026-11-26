# Repositorios de imágenes. deploy.sh los crea primero (-target), compila y sube las imágenes, y luego aplica el resto.

resource "aws_ecr_repository" "app" {
  for_each = toset(["frontend", "backend"])

  name                 = "${var.project}-${each.key}"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true # el lab se destruye completo con terraform destroy

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  for_each   = aws_ecr_repository.app
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Conservar solo las 10 imágenes más recientes"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}
