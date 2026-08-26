import { DashboardData } from '@/types/dashboardTypes';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:5000/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

export interface UploadResult {
  success: boolean;
  message: string;
  indicatorType: string;
  fileName: string;
  fileSizeBytes: number;
  processedAt: string;
  processedRecords: number;
}

export async function fetchDashboardData(program: string, period: string): Promise<DashboardData> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/academic-indicators/dashboard?program=${encodeURIComponent(program)}&period=${encodeURIComponent(period)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor backend (Código HTTP ${response.status})`);
    }

    const data: DashboardData = await response.json();
    return data;
  } catch (error: any) {
    if (error.message && error.message.includes('HTTP')) {
      throw error;
    }
    throw new Error('No se pudo establecer conexión con el servidor backend. Verifique que el servicio de la API esté en ejecución.');
  }
}

export async function uploadIndicatorFile(
  indicatorType: string,
  program: string,
  period: string,
  file: File
): Promise<UploadResult> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/academic-indicators/upload`;
  const formData = new FormData();
  formData.append('indicatorType', indicatorType);
  formData.append('program', program);
  formData.append('period', period);
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en el servidor (Código HTTP ${response.status})`);
    }

    const result: UploadResult = await response.json();
    return result;
  } catch (error: any) {
    if (error.message && !error.message.includes('servidor')) {
      throw new Error('Ocurrió un error al intentar subir el archivo al backend. Verifique que la API esté activa.');
    }
    throw error;
  }
}
