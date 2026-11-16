import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const searchApi = {
  search: async (query, params = {}, options = {}) => {
    return apiClient.get(ENDPOINTS.SEARCH(query), { params, ...options });
  },
};

export default searchApi;
