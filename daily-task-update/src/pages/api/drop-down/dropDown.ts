import axios from 'axios';
import { User } from '@/components/common/types';

export const fetchDropDownUser = async (searchValue: string): Promise<User[]> => {
  try {
    const response = await axios.post<User[]>('/api/dropDown/getDropDownUser', {
      searchValue: searchValue,
    });
    return response.data; // Directly return the data
  } catch (error) {
    console.error('Error fetching dropdown users:', error);
    throw error;
  }
};

export const fetchDropDownUserProjectMember = async (projectId: string): Promise<User[]> => {
  try {
    const response = await axios.post<User[]>('/api/dropDown/getDropdownUserByProject', {projectId});
    return response.data; // Directly return the data
  } catch (error) {
    console.error('Error fetching dropdown users:', error);
    throw error;
  }
};

export const fetchTasksFilterDropdownUser = async (sprintId: number): Promise<User[]> => {
  try {
    const response = await axios.post<User[]>('/api/dropDown/getTaskFilterDropdownUser', {
      sprintId: sprintId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dropdown users:', error);
    throw error;
  }
};
