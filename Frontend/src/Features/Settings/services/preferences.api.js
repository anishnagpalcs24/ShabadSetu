import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const preferencesApi = {
  getPreferences: async () => {
    return apiClient.get(ENDPOINTS.USERS.PREFERENCES);
  },

  updatePreferences: async (prefs) => {
    return apiClient.patch(ENDPOINTS.USERS.PREFERENCES, prefs);
  },
};

export default preferencesApi;
