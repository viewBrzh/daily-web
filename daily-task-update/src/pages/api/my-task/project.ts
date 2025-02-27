import axios from 'axios';
import { Project, NewProject, MyProjectPage, Member, UpdateProject } from '@/components/common/types';

export const fetchProjects = async (userId: number, searchValue: string, currentPage: number, sortBy: string): Promise<MyProjectPage> => {
  try {
    const response = await axios.post<MyProjectPage>(`/api/projects/getMyProjectLists`,{
      resUserId: userId,
      searchValue: searchValue,
      page: currentPage,
      sortBy: sortBy,
    })
    return {
      projects: response.data.projects,
      total_page: response.data.total_page,
      total_row: response.data.total_row,
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const addProject = async (project: NewProject, members: Member[]): Promise<number> => {
  try {
    const users = members.map(({ user_id, role }) => ({ user_id, role }));
    console.log({project, users})
    const response = await axios.post<Project>(`/api/projects/addProject`, {project, users});
    return response.data.project_id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getViewProject = async (projectId: string, userId: number) => {
  try {
    const response = await axios.post(`/api/projects/getViewProject`, {projectId, userId});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (project: UpdateProject) => {
  try {
    const response = await axios.post(`/api/projects/updateProject`, {project});
    return response.data;
  } catch (error) {
    throw error;
  }
};

