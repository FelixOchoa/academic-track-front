// Tipos que reflejan 1:1 los DTOs de AcademicTrack.Application.Metas.DTOs
// Si el backend cambia un DTO, este archivo debe actualizarse junto con él.

export type Periodicidad = 'Mensual' | 'Semestral' | 'Anual';

export type EstadoMeta =
  | 'NoIniciada'
  | 'EnProgreso'
  | 'Cumplida'
  | 'Retrasada'
  | 'Cancelada';

export type Semaforo = 'Verde' | 'Amarillo' | 'Rojo' | 'Gris';

export type DireccionIndicador = 'Ascendente' | 'Descendente';

// ---- Indicadores ----

export interface IndicadorDto {
  id: number;
  nombre: string;
  unidad?: string | null;
  direccion: DireccionIndicador | string;
}

// ---- Metas ----

export interface MetaEvidenciaDto {
  descripcion: string;
  url?: string | null;
  fechaCarga: string; // "yyyy-MM-dd"
}

export interface MetaDto {
  id: number;
  programaId: number;
  indicadorNombre: string;
  nombre: string;
  descripcion?: string | null;
  responsable: string;
  periodicidad: Periodicidad | string;
  fechaInicio: string; // "yyyy-MM-dd"
  fechaLimite: string; // "yyyy-MM-dd"
  valorInicial: number;
  valorEsperado: number;
  avanceActual: number;
  estado: EstadoMeta | string;
  porcentajeCumplimiento: number;
  semaforo: Semaforo | string;
  evidencias: MetaEvidenciaDto[];
}

export interface CrearMetaDto {
  programaId: number;
  indicadorId: number;
  nombre: string;
  descripcion?: string | null;
  responsable: string;
  periodicidad: Periodicidad;
  fechaInicio: string;
  fechaLimite: string;
  valorInicial: number;
  valorEsperado: number;
}

export interface ActualizarMetaDto {
  nombre: string;
  descripcion?: string | null;
  responsable: string;
  periodicidad: Periodicidad;
  fechaInicio: string;
  fechaLimite: string;
  valorEsperado: number;
}

export interface ActualizarAvanceMetaDto {
  avanceActual: number;
  estado?: EstadoMeta | null; // opcional: si no se manda, el backend lo infiere
}

export interface CrearMetaEvidenciaDto {
  descripcion: string;
  url?: string | null;
  fechaCarga?: string | null; // si no se manda, el backend usa la fecha actual
}

// ---- Resumen / paginación ----

export interface ResumenProgramaDto {
  programaId: number;
  total: number;
  verde: number;
  amarillo: number;
  rojo: number;
  gris: number;
}

export interface ResumenMetasDto {
  porPrograma: ResumenProgramaDto[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
