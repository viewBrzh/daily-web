import axios from 'axios';
import { CalendarItem } from '@/components/common/types';

export const getCalendar = async (projectId: string, month: number) => {
  try {
    const response = await axios.post<CalendarItem[]>(`/api/calendar/getAllCalendar`, { projectId, month });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCalendarByDate = async (projectId: string, date: string) => {
  try {
    const response = await axios.post<CalendarItem[]>(`/api/calendar/getCalendarByDate`, { projectId, date });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addCalendar = async (eventData: CalendarItem) => {
  const response = await fetch("/api/calendar/addCalendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...eventData, projectId: eventData.project_id }),
  });
  return response.json();
};

export const deleteCalendar = async (id: number) => {
  const response = await fetch(`/api/calendar/deleteCalendar`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
  });

  if (!response.ok) {
      throw new Error("Failed to delete event");
  }
};
