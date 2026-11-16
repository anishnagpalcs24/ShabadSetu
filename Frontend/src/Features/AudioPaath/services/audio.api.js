import { apiClient } from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const audioApi = {
  /**
   * Fetch all Banis in the Audio Paath catalogue
   * @param {Object} [params] - Optional query parameters (e.g. { available: true })
   */
  async getCatalog(params = {}) {
    const response = await apiClient.get(ENDPOINTS.AUDIO.CATALOG, { params });
    return response.data;
  },

  /**
   * Fetch single Bani audio recording metadata by slug
   * @param {string} slug - e.g. 'anand-sahib'
   */
  async getBySlug(slug) {
    const response = await apiClient.get(ENDPOINTS.AUDIO.BY_SLUG(slug));
    return response.data;
  },
};

export default audioApi;
