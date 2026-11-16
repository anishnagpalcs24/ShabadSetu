import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const progressApi = {
  getProgress: async (source = 'G') => {
    return apiClient.get(ENDPOINTS.USERS.PROGRESS, { params: { source } });
  },

  updateProgress: async (progressData) => {
    return apiClient.post(ENDPOINTS.USERS.PROGRESS, progressData);
  },
};

export default progressApi;
