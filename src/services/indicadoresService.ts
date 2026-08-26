import { apiClient } from '@/lib/api-client';
import { IndicadorDto } from '@/types/metas';

// Corresponde a AcademicTrack.API/Controllers/IndicadoresController.cs
export function obtenerIndicadores(): Promise<IndicadorDto[]> {
  return apiClient.get<IndicadorDto[]>('/api/indicadores');
}
