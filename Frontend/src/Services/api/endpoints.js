export const ENDPOINTS = {
  HEALTH: '/health',

  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Gurbani Reader
  GURBANI: {
    ANG: (page, source = 'G') => `/gurbani/ang/${encodeURIComponent(page)}/g/${encodeURIComponent(source)}`,
    SHABAD: (id) => `/gurbani/shabad/${encodeURIComponent(id)}`,
    LINE: (id) => `/gurbani/line/${encodeURIComponent(id)}`,
  },

  // Search
  SEARCH: (query) => `/search/${encodeURIComponent(query)}`,

  // Nitnem & Sunder Gutka
  NITNEM: {
    SUNDERGUTKA: '/nitnem/sundergutka',
    SUNDERGUTKA_BY_ID: (id) => `/nitnem/sundergutka/${encodeURIComponent(id)}`,
    BANI_LIST: '/nitnem/bani',
    BANI_BY_ID: (id) => `/nitnem/bani/${encodeURIComponent(id)}`,
    SUNDERGUTKA_BANI: (sgId, baniId) => `/nitnem/sundergutka/${encodeURIComponent(sgId)}/bani/${encodeURIComponent(baniId)}`,
  },

  // User Personal Library
  USERS: {
    PROFILE: '/users/profile',
    BOOKMARKS: '/users/bookmarks',
    BOOKMARK_BY_ID: (id) => `/users/bookmarks/${encodeURIComponent(id)}`,
    COLLECTIONS: '/users/collections',
    COLLECTION_BY_ID: (id) => `/users/collections/${encodeURIComponent(id)}`,
    COLLECTION_ITEMS: (id) => `/users/collections/${encodeURIComponent(id)}/items`,
    COLLECTION_ITEM_REMOVE: (id, itemId) => `/users/collections/${encodeURIComponent(id)}/items/${encodeURIComponent(itemId)}`,
    NOTES: '/users/notes',
    NOTE_BY_ID: (id) => `/users/notes/${encodeURIComponent(id)}`,
    PROGRESS: '/users/progress',
    HISTORY: '/users/history',
    PREFERENCES: '/users/preferences',
  },
  // Audio Paath
  AUDIO: {
    CATALOG: '/audio',
    BY_SLUG: (slug) => `/audio/${encodeURIComponent(slug)}`,
  },
};

export default ENDPOINTS;
