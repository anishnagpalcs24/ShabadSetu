import apiClient from '../../../Services/api/client';

export const authApi = {
  login: async (credentials) => apiClient.post('/auth/login', credentials),
  register: async (data) => apiClient.post('/auth/register', data),
  logout: async () => apiClient.post('/auth/logout'),
};

export default authApi;
