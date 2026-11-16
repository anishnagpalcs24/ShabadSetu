import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const nitnemApi = {
  getSunderGutka: async () => {
    return apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA);
  },

  getSunderGutkaById: async (id) => {
    return apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA_BY_ID(id));
  },

  getBaniList: async () => {
    return apiClient.get(ENDPOINTS.NITNEM.BANI_LIST);
  },

  getBaniById: async (id, params = {}) => {
    return apiClient.get(ENDPOINTS.NITNEM.BANI_BY_ID(id), { params });
  },

  getSunderGutkaBani: async (sgId, baniId) => {
    return apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA_BANI(sgId, baniId));
  },
};

export default nitnemApi;
