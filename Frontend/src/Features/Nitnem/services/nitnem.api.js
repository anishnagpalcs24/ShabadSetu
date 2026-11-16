import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

// In-memory cache for instant Bani & Sunder Gutka switching
const nitnemCache = new Map();

export const nitnemApi = {
  getSunderGutka: async () => {
    const key = 'sundergutka_all';
    if (nitnemCache.has(key)) return nitnemCache.get(key);
    const res = await apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA);
    nitnemCache.set(key, res);
    return res;
  },

  getSunderGutkaById: async (id) => {
    const key = `sg_${id}`;
    if (nitnemCache.has(key)) return nitnemCache.get(key);
    const res = await apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA_BY_ID(id));
    nitnemCache.set(key, res);
    return res;
  },

  getBaniList: async () => {
    const key = 'bani_list';
    if (nitnemCache.has(key)) return nitnemCache.get(key);
    const res = await apiClient.get(ENDPOINTS.NITNEM.BANI_LIST);
    nitnemCache.set(key, res);
    return res;
  },

  getBaniById: async (id, params = {}) => {
    const key = `bani_${id}_${JSON.stringify(params)}`;
    if (nitnemCache.has(key)) return nitnemCache.get(key);
    const res = await apiClient.get(ENDPOINTS.NITNEM.BANI_BY_ID(id), { params });
    nitnemCache.set(key, res);
    return res;
  },

  getSunderGutkaBani: async (sgId, baniId) => {
    const key = `sg_bani_${sgId}_${baniId}`;
    if (nitnemCache.has(key)) return nitnemCache.get(key);
    const res = await apiClient.get(ENDPOINTS.NITNEM.SUNDERGUTKA_BANI(sgId, baniId));
    nitnemCache.set(key, res);
    return res;
  },
};

export default nitnemApi;
