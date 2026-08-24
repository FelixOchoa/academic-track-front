import { DashboardData, getDashboardData } from '@/data/dashboardMockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5282/api';

export async function fetchDashboardData(program: string, period: string): Promise<DashboardData> {
  try {
    const url = `${API_BASE_URL}/academic-indicators/dashboard?program=${encodeURIComponent(program)}&period=${encodeURIComponent(period)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error HTTP ${response.status}`);
    }

    const data: DashboardData = await response.json();
    return data;
  } catch (error) {
    return getDashboardData(program, period);
  }
}
