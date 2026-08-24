import { DashboardData } from '@/types/dashboardTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5282/api';

export async function fetchDashboardData(program: string, period: string): Promise<DashboardData> {
  const url = `${API_BASE_URL}/academic-indicators/dashboard?program=${encodeURIComponent(program)}&period=${encodeURIComponent(period)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data from backend API. HTTP Status: ${response.status}`);
  }

  const data: DashboardData = await response.json();
  return data;
}
