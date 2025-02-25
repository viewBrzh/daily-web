import axios from 'axios';
import { Member } from '@/components/common/types';


export const updateMember = async (projectId: string, members: Member[]) => {
  try {
    const response = await axios.post(`/api/members/updateMember`, {
      projectId: projectId,
      members: members,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getUser = async (userId: number) => {
  try {
    const response = await axios.post(`/api/members/getUser`, {userId});
    return response.data.user[0];
  } catch (error) {
    throw error;
  }
}