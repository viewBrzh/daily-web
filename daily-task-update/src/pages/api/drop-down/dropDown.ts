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
