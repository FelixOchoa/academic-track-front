import { DashboardData } from '@/types/dashboardTypes';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5282';
export async function fetchDashboardData(program: string, period: string): Promise<DashboardData> {
  const url = `${API_BASE_URL}/academic-indicators/dashboard?program=${encodeURIComponent(program)}&period=${encodeURIComponent(period)}`;
  
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
