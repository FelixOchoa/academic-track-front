# Un único ALB: "/" va al frontend; "/api/*" y "/swagger*" al backend (mismo dominio, sin CORS).

resource "aws_lb" "main" {
  name               = "${var.project}-alb"
  load_balancer_type = "application"
  internal           = false
  subnets            = local.subnet_ids
  security_groups    = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "frontend" {
  name                 = "${var.project}-tg-front"
  port                 = 3000
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = data.aws_vpc.default.id
  deregistration_delay = 30

  health_check {
    path                = "/"
    matcher             = "200-399" # sin sesión redirige a /login
    interval            = 15
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_target_group" "backend" {
  name                 = "${var.project}-tg-back"
  port                 = 80
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = data.aws_vpc.default.id
  deregistration_delay = 30

  health_check {
    # El backend aún no expone /health; Swagger responde sin depender de la base de datos
    path                = "/swagger/index.html"
    matcher             = "200"
    interval            = 15
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_lb_listener_rule" "swagger" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 20

  condition {
    path_pattern {
      values = ["/swagger*"]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
