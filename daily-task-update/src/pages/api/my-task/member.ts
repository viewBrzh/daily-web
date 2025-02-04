import axios from 'axios';
import { Member } from '@/components/common/types';


export const updateMember = async (projectId: any, members: Member[]) => {
    try {
      const response = await axios.post(`/api/members/updateMember`, {
        projectId: projectId, 
        members : members,
    });
      return response.data;
    } catch (error) {
      throw error;
    }
  }