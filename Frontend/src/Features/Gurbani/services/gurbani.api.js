import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

// In-memory cache for instant Ang and Shabad flipping with zero lag
const cache = new Map();

export const gurbaniApi = {
  getAng: async (page = 1, source = 'G') => {
    const cacheKey = `ang_${source}_${page}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const res = await apiClient.get(ENDPOINTS.GURBANI.ANG(page, source));
    // Cache up to 100 Angs in memory
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(cacheKey, res);
    return res;
  },

  getShabad: async (id) => {
    const cacheKey = `shabad_${id}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const res = await apiClient.get(ENDPOINTS.GURBANI.SHABAD(id));
    cache.set(cacheKey, res);
    return res;
  },

  getLine: async (id) => {
    return apiClient.get(ENDPOINTS.GURBANI.LINE(id));
  },
};

export default gurbaniApi;
