import axios from 'axios';
import { Project, NewProject, MyProjectPage } from '@/views/my-tasks/types'

export const fetchProjects = async (userId: number, searchValue: string, currentPage: number): Promise<MyProjectPage> => {
  try {
    const response = await axios.post<MyProjectPage>(`/api/projects/getMyProjectLists`,{
      resUserId: userId,
      searchValue: searchValue,
      page: currentPage,
    })
    return {
      projects: response.data.projects,
      totalPage: response.data.totalPage,
      totalRow: response.data.totalRow,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const addProject = async (project: NewProject): Promise<Project> => {
  try {
    const response = await axios.post<Project>(`/api/projects/addProject`, project);
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};
