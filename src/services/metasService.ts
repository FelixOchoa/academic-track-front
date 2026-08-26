import { apiClient } from '@/lib/api-client';
import {
  ActualizarAvanceMetaDto,
  ActualizarMetaDto,
  CrearMetaDto,
  CrearMetaEvidenciaDto,
  MetaDto,
  PagedResult,
  ResumenMetasDto,
} from '@/types/metas';

// Cada función corresponde 1:1 a un endpoint de AcademicTrack.API/Controllers/MetasController.cs

export function obtenerMetas(params: {
  programaId?: number;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<MetaDto>> {
  const query = new URLSearchParams();
  if (params.programaId !== undefined) query.set('programaId', String(params.programaId));
  query.set('page', String(params.page ?? 1));
  query.set('pageSize', String(params.pageSize ?? 20));

  return apiClient.get<PagedResult<MetaDto>>(`/api/metas?${query.toString()}`);
}

export function obtenerResumenMetas(): Promise<ResumenMetasDto> {
  return apiClient.get<ResumenMetasDto>('/api/metas/resumen');
}

export function obtenerMetaPorId(id: number): Promise<MetaDto> {
  return apiClient.get<MetaDto>(`/api/metas/${id}`);
}

export function crearMeta(dto: CrearMetaDto): Promise<MetaDto> {
  return apiClient.post<MetaDto>('/api/metas', dto);
}

export function actualizarMeta(id: number, dto: ActualizarMetaDto): Promise<MetaDto> {
  return apiClient.put<MetaDto>(`/api/metas/${id}`, dto);
}

export function actualizarAvanceMeta(
  id: number,
  dto: ActualizarAvanceMetaDto
): Promise<MetaDto> {
  return apiClient.patch<MetaDto>(`/api/metas/${id}/avance`, dto);
}

export function cancelarMeta(id: number): Promise<MetaDto> {
  return apiClient.patch<MetaDto>(`/api/metas/${id}/cancelar`);
}

export function agregarEvidencia(
  id: number,
  dto: CrearMetaEvidenciaDto
): Promise<MetaDto> {
  return apiClient.post<MetaDto>(`/api/metas/${id}/evidencias`, dto);
}
