import axios from 'axios';
import { CalendarItem } from '@/components/common/types';


export const getCalendar = async (projectId: any, month: number) => {
    try {
        console.log(projectId, month);
      const response = await axios.post<CalendarItem[]>(`/api/calendar/getAllCalendar`, {projectId, month});
      return response.data;
    } catch (error) {
      throw error;
    }
  }