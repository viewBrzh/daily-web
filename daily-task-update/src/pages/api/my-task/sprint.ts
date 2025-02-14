import axios from 'axios';
import { SprintData, Status, Task, User } from '@/components/common/types';

export const getSprintByProject = async (projectId: any): Promise<SprintData[]> => {
    try {
        const response = await axios.post<SprintData[]>(`/api/tasks/getSprintByProject`, { projectId });
        return response.data;
    } catch (error) {
        console.error("Error fetching sprint:", error);
        return {} as SprintData[];
    }
}

export const getCurrentSprintByProject = async (projectId: any): Promise<SprintData> => {
    try {
        const response = await axios.post<SprintData>(`/api/tasks/getCurrentSprint`, { projectId });
        return response.data;
    } catch (error) {
        console.error("Error fetching sprint:", error);
        return {} as SprintData; 
    }
};

export const getPersonFilterOption = async (sprintId?: any): Promise<User[]> => {
    try {
        const response = await axios.post<User[]>(`/api/tasks/getPersonFilterOption`, { sprintId });
        return Array.isArray(response.data) ? response.data : []; // Ensure it returns an array
    } catch (error) {
        console.error("Error fetching person option:", error );
        return []; // Return an empty array instead of an object
    }
};

export const getTasks = async (sprintId?: any, userId?: any): Promise<Task[]> => {
    try {
        const response = await axios.post<Task[]>(`/api/tasks/getTasks`, { sprintId, userId });
        return response.data;
    } catch (error) {
        console.error("Error fetching person ontion:", error);
        return {} as Task[]; 
    }
};

export const getTaskStatus = async (): Promise<Status[]> => {
    try {
        const response = await axios.post<Status[]>(`/api/tasks/getTaskStatus`);
        return response.data;
    } catch (error) {
        console.error("Error fetching person ontion:", error);
        return {} as Status[]; 
    }
};