import axios from 'axios';
import { DashboardData } from '@/components/common/types';

export const getProjectDashboard = async (projectId: string): Promise<DashboardData> => {
  try {
    const response = await axios.post<DashboardData>(`/api/dashboard/getProjectDashboard`, { projectId });
    return response.data;
  } catch (error) {
    throw error;
  }
}