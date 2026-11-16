import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const gurbaniApi = {
  getAng: async (page = 1, source = 'G') => {
    return apiClient.get(ENDPOINTS.GURBANI.ANG(page, source));
  },

  getShabad: async (id) => {
    return apiClient.get(ENDPOINTS.GURBANI.SHABAD(id));
  },

  getLine: async (id) => {
    return apiClient.get(ENDPOINTS.GURBANI.LINE(id));
  },
};

export default gurbaniApi;
