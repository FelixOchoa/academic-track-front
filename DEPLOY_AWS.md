# Despliegue de AcademicTrack en AWS (ECS Fargate)

AcademicTrack se despliega en el Learner Lab de AWS Academy con **Amazon ECS sobre Fargate**, imágenes en **Amazon ECR** y PostgreSQL en **Amazon RDS**. Un único **Application Load Balancer** publica el frontend y el backend bajo la misma dirección.

## Arquitectura

```
Usuarios ──HTTP 80──> Application Load Balancer (acadtrack-sg-alb)
                        │ /            │ /api/*  y  /swagger*
                        ▼              ▼
     ┌───────── Clúster ECS acadtrack-cluster · Fargate (acadtrack-sg-app) ─────────┐
     │  service frontend (Next.js :3000)      service backend (.NET 8 :80)         │
     │  2 tareas en us-east-1a y 1b           2 a 4 tareas en us-east-1a y 1b      │
     └──────────────────────────────────────────────────┬───────────────────────────┘
                                                        │ PostgreSQL :5432
                                                        ▼
                                  RDS PostgreSQL 16 acadtrack-db (acadtrack-sg-db, sin IP pública)

ECR: acadtrack-frontend, acadtrack-backend · Logs: /ecs/acadtrack-* · IAM: LabRole
Secrets Manager: acadtrack/db-connection, acadtrack/jwt-key
```

El frontend llama a `/api/...` sobre su mismo dominio, así que el balanceador envía esas rutas al backend y no hace falta configurar CORS ni `NEXT_PUBLIC_API_URL`.

| Pieza | Configuración |
| --- | --- |
| Frontend | Esta rama del repositorio · 0,25 vCPU, 512 MiB · health check `/` (acepta 200-399 por la redirección a `/login`) |
| Backend | [Ana-Vega05/academic-track](https://github.com/Ana-Vega05/academic-track), rama `main` · 0,5 vCPU, 1 GiB · health check `/swagger/index.html` |
| Base de datos | PostgreSQL 16, `db.t3.micro`, base `academictrack`, cifrada, sin acceso público. El backend aplica las migraciones y siembra los datos al arrancar |
| Secretos | La cadena de conexión y la clave JWT se inyectan desde Secrets Manager como `ConnectionStrings__DefaultConnection` y `Jwt__Key` |

## Desplegar

En AWS CloudShell (región us-east-1) del Learner Lab:

```bash
git clone -b deploy_aws_fargate https://github.com/FelixOchoa/academic-track-front.git
cd academic-track-front
bash infra/deploy.sh
```

Al terminar muestra la URL de la aplicación y la de Swagger. La primera vez tarda entre 15 y 25 minutos, sobre todo por la creación de RDS y la compilación del backend.

Otras opciones:

```bash
TAG=1.1 bash infra/deploy.sh              # nueva versión con rolling update sin caída
BACKEND_REF=develop bash infra/deploy.sh  # desplegar otra rama del backend
```

## Borrar todo

```bash
bash infra/destroy.sh
```

## Adaptaciones al Learner Lab

- No se pueden crear roles de IAM: se usa **LabRole** como execution role y task role.
- Sin NAT Gateway (costo): las tareas usan subredes públicas con IP pública para descargar de ECR; los security groups solo dejan pasar tráfico desde el balanceador.
- RDS en una sola zona y sin copias automáticas para ahorrar crédito; en producción, Multi-AZ y backups.
- El balanceador solo escucha HTTP; en producción se agregaría HTTPS con un certificado de ACM.
