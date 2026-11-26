# Despliegue de AcademicTrack en AWS (Terraform · ECS Fargate · Lambda)

AcademicTrack se despliega en el Learner Lab de AWS Academy. Toda la infraestructura está declarada con **Terraform** en [`infra/terraform/`](infra/terraform):

- **Amazon ECS sobre Fargate** ejecuta el frontend y el backend.
- **Amazon ECR** guarda las imágenes.
- **Amazon RDS** aloja PostgreSQL.
- **Amazon S3 + AWS Lambda** procesan los Excel de indicadores.
- Un único **Application Load Balancer** publica el frontend y el backend bajo la misma dirección.

## Arquitectura

```
Usuarios ──HTTP 80──> Application Load Balancer (acadtrack-sg-alb)
                        │ /            │ /api/*  y  /swagger*
                        ▼              ▼
     ┌───────── Clúster ECS acadtrack-cluster · Fargate (acadtrack-sg-app) ─────────┐
     │  service frontend (Next.js :3000)      service backend (.NET 8 :80)         │
     │  2 tareas en us-east-1a y 1b           2 a 4 tareas en us-east-1a y 1b      │
     └─────────────────────────────────────┬────────────────────┬───────────────────┘
                          PostgreSQL :5432 │                    │ S3 (Excel e indicadores)
                                           ▼                    ▼
              RDS PostgreSQL 16 acadtrack-db          s3://acadtrack-indicators-<cuenta>
              (acadtrack-sg-db, sin IP pública)         uploads/  ──evento──>  Lambda
                                                        processed/ <──JSON──   acadtrack-indicator-processor

ECR: acadtrack-frontend, acadtrack-backend · Logs: /ecs/acadtrack-*, /aws/lambda/acadtrack-indicator-processor
IAM: LabRole · Secrets Manager: acadtrack/db-connection, acadtrack/jwt-key
Estado de Terraform: s3://acadtrack-tfstate-<cuenta>/academictrack/terraform.tfstate
```

El frontend llama a `/api/...` sobre su mismo dominio, así que el balanceador envía esas rutas al backend y no hace falta configurar CORS ni `NEXT_PUBLIC_API_URL`.

### Procesamiento de Excel con Lambda

Antes, la API parseaba el Excel y guardaba las métricas **en la memoria de cada tarea**. Con 2 a 4 tareas detrás del balanceador, cada una tenía datos distintos, y todos se perdían en cada despliegue. Ahora:

1. En **Cargar Indicador**, la API sube el archivo a `s3://…/uploads/` con el tipo de indicador, el programa y el periodo como metadatos.
2. El evento `ObjectCreated` dispara la Lambda **acadtrack-indicator-processor** (.NET 8). La Lambda reutiliza el mismo `ExcelParser` del backend y escribe `processed/{programa}/{sección}.json`.
3. El panel de cualquier tarea lee ese JSON. Los datos son los mismos para todas las réplicas y sobreviven a los despliegues.

El procesamiento es asíncrono y tarda alrededor de un segundo. Si la Lambda falla, se reintenta 2 veces y la alarma `acadtrack-indicator-processor-errors` lo marca en CloudWatch.

El código de la Lambda está en el backend, en `AcademicTrack.Lambda.IndicatorProcessor`. La API activa este modo solo cuando existe la variable `Indicators__BucketName`, que Terraform define en la task definition. **En local (docker compose) no hay bucket y todo sigue procesándose en memoria**, sin necesidad de AWS.

| Pieza | Configuración |
| --- | --- |
| Frontend | Este repositorio · 0,25 vCPU, 512 MiB · health check `/` (acepta 200-399 por la redirección a `/login`) |
| Backend | [Ana-Vega05/academic-track](https://github.com/Ana-Vega05/academic-track) · 0,5 vCPU, 1 GiB · health check `/swagger/index.html` · auto scaling de 2 a 4 tareas con CPU objetivo del 60 % |
| Lambda | `dotnet8`, 512 MB, 60 s · se dispara con `uploads/` · paquete de ~1 MB (no incluye EF Core) |
| S3 | Cifrado SSE-S3, sin acceso público; los Excel de `uploads/` se borran a los 30 días |
| Base de datos | PostgreSQL 16, `db.t3.micro`, base `academictrack`, cifrada, sin acceso público. El backend aplica las migraciones y siembra los datos al arrancar |
| Secretos | Contraseña y clave JWT generadas por Terraform (`random_password`) e inyectadas desde Secrets Manager como `ConnectionStrings__DefaultConnection` y `Jwt__Key` |

## Desplegar

En AWS CloudShell (región us-east-1) del Learner Lab:

```bash
git clone -b feature/terraform-lambda https://github.com/FelixOchoa/academic-track-front.git
cd academic-track-front
BACKEND_REF=feature/lambda-procesamiento-excel bash infra/terraform/deploy.sh
```

El script instala Terraform y .NET 8 si faltan; la descarga de Terraform se verifica con su SHA256. Después:

1. Crea el bucket del estado de Terraform.
2. Compila la Lambda, el backend y el frontend.
3. Crea los repositorios de ECR y sube las imágenes.
4. Ejecuta `terraform apply`.

Al terminar, muestra la URL de la aplicación y la de Swagger. La primera vez tarda entre 15 y 25 minutos, sobre todo por RDS.

> `BACKEND_REF` apunta a la rama del backend que contiene la Lambda. Cuando se fusione en `main`, basta con `bash infra/terraform/deploy.sh`.

Otras opciones:

```bash
TAG=1.1 bash infra/terraform/deploy.sh      # nueva versión: Terraform registra otra task definition y ECS hace rolling update sin caída
```

Para ver qué cambiaría antes de aplicar, desde `infra/terraform` y después de un primer `deploy.sh`:

```bash
terraform plan -var image_tag=1.0
```

Los valores por defecto (tamaños, número de tareas, auto scaling) se cambian en `infra/terraform/terraform.tfvars`, partiendo de `terraform.tfvars.example`.

## Borrar todo

```bash
bash infra/terraform/destroy.sh
```

Se conserva el bucket del estado (`acadtrack-tfstate-<cuenta>`).

### Si ya se desplegó con el script anterior

`infra/deploy.sh` (AWS CLI) usa los mismos nombres de recursos. Antes del primer despliegue con Terraform, borra ese despliegue con `bash infra/destroy.sh`. Otra opción es desplegar con otro prefijo: `PROJECT=acadtrack2 bash infra/terraform/deploy.sh`.

## Organización de `infra/terraform`

| Archivo | Contenido |
| --- | --- |
| `versions.tf` | Terraform ≥ 1.10, providers `aws ~> 6.0` y `random`; backend S3 con `use_lockfile` (bloqueo sin DynamoDB) |
| `data.tf` | Cuenta, `LabRole`, VPC por defecto y subredes de us-east-1a/1b |
| `network.tf` | Security groups encadenados: Internet → ALB → tareas → RDS |
| `database.tf` | RDS, contraseñas aleatorias y secretos |
| `ecr.tf` | Repositorios inmutables con escaneo al subir y retención de 10 imágenes |
| `alb.tf` | Balanceador, target groups y reglas `/api/*` y `/swagger*` |
| `ecs.tf` | Clúster, task definitions, services con circuit breaker y rollback, auto scaling |
| `lambda.tf` | Bucket de indicadores, Lambda, permiso, notificación de S3 y alarma de errores |
| `outputs.tf` | URL, Swagger, bucket, Lambda, endpoint de RDS |

## Adaptaciones al Learner Lab

- No se pueden crear roles de IAM: Terraform usa `data "aws_iam_role"` con **LabRole** como execution role y task role de ECS, y como rol de la Lambda.
- Sin NAT Gateway (costo): las tareas usan subredes públicas con IP pública para descargar de ECR y acceder a S3; los security groups solo dejan pasar tráfico desde el balanceador. La Lambda no necesita VPC porque solo usa S3.
- RDS en una sola zona y sin copias automáticas para ahorrar crédito. En producción: Multi-AZ, backups y `deletion_protection`.
- Si el lab no permite Application Auto Scaling, pon `enable_autoscaling = false` en `terraform.tfvars`.
- El balanceador solo escucha HTTP. En producción se agregaría HTTPS con un certificado de ACM.
