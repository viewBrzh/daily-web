import axios from 'axios';
import { Project, NewProject } from '@/views/my-tasks/types'
import { baseApiUrl } from '@/api/Instance';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(`/api/projects/get-all`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const addProject = async (project: NewProject): Promise<Project> => {
  try {
    const response = await axios.post<Project>(`${baseApiUrl}/projects`, project);
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};
