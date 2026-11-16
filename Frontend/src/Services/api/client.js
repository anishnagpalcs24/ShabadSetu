import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isProd = import.meta.env.PROD;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const trimmed = envUrl.trim();
    const isLocalhost = trimmed.includes('localhost') || trimmed.includes('127.0.0.1');
    // If in production, do not accidentally bind to localhost
    if (!isProd || !isLocalhost) {
      let clean = trimmed.replace(/\/+$/, '');
      if (!clean.endsWith('/api/v1')) {
        if (clean.endsWith('/api')) {
          clean = `${clean}/v1`;
        } else {
          clean = `${clean}/api/v1`;
        }
      }
      return clean;
    }
  }

  // In production builds or when hosted on any remote domain (like Vercel)
  const isBrowserProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProd || isBrowserProd) {
    return 'https://shabadsetu-backend.vercel.app/api/v1';
  }

  // In local development
  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = resolveBaseUrl();

// In-memory access token storage (never localStorage for security)
let inMemoryAccessToken = null;
let logoutCallback = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const registerLogoutCallback = (cb) => {
  logoutCallback = cb;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach in-memory access token if available
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle automatic token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints (login, refresh, register, etc.)
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/verify-email');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response did not contain an access token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Format error message cleanly
    const formattedError = new Error(
      error.response?.data?.message || error.message || 'An unexpected network error occurred'
    );
    formattedError.statusCode = error.response?.status || 500;
    formattedError.errors = error.response?.data?.errors || [];
    formattedError.raw = error;

    return Promise.reject(formattedError);
  }
);

export default apiClient;
