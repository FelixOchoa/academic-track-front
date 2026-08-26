export interface SeguimientoCohorte {
  programaId: number;
  periodoCohorteId: number;
  semestreSeguimiento: number;
  ingresaron: number;
  continuaron: number;
  cancelaciones: number;
  repitentes: number;
  cambiosPrograma: number;
  desertores: number;
  graduados: number;
}

export interface SeguimientoEgresado {
  programaId: number;
  anioGraduacion: number;
  totalEgresados: number;
  empleados: number;
  empleadosRelacionadosCarrera: number;
  empleadosNoRelacionadosCarrera: number;
  tiempoPromedioConseguirEmpleoMeses: number | null;
  contratoIndefinido: number;
  contratoTerminoFijo: number;
  contratoPrestacionServicios: number;
  contratoOtro: number;
  continuanEstudios: number;
  tasaEmpleabilidad: number;
  tasaRelacionCarrera: number;
  tasaContinuanEstudios: number;
}

export interface DistribucionEgresado {
  tipo: 'SECTOR' | 'CARGO' | string;
  categoria: string;
  cantidad: number;
}

export interface AnalisisEgresado extends SeguimientoEgresado {
  distribuciones: DistribucionEgresado[];
}