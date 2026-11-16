import apiClient from '../../../Services/api/client';
import { ENDPOINTS } from '../../../Services/api/endpoints';

export const libraryApi = {
  // Bookmarks
  getBookmarks: async (params = {}) => {
    return apiClient.get(ENDPOINTS.USERS.BOOKMARKS, { params });
  },

  createBookmark: async (bookmarkData) => {
    return apiClient.post(ENDPOINTS.USERS.BOOKMARKS, bookmarkData);
  },

  deleteBookmark: async (id) => {
    return apiClient.delete(ENDPOINTS.USERS.BOOKMARK_BY_ID(id));
  },

  // Collections
  getCollections: async () => {
    return apiClient.get(ENDPOINTS.USERS.COLLECTIONS);
  },

  getCollectionById: async (id) => {
    return apiClient.get(ENDPOINTS.USERS.COLLECTION_BY_ID(id));
  },

  createCollection: async (collectionData) => {
    return apiClient.post(ENDPOINTS.USERS.COLLECTIONS, collectionData);
  },

  updateCollection: async (id, data) => {
    return apiClient.patch(ENDPOINTS.USERS.COLLECTION_BY_ID(id), data);
  },

  deleteCollection: async (id) => {
    return apiClient.delete(ENDPOINTS.USERS.COLLECTION_BY_ID(id));
  },

  addItemToCollection: async (collectionId, itemData) => {
    return apiClient.post(ENDPOINTS.USERS.COLLECTION_ITEMS(collectionId), itemData);
  },

  removeItemFromCollection: async (collectionId, itemId) => {
    return apiClient.delete(ENDPOINTS.USERS.COLLECTION_ITEM_REMOVE(collectionId, itemId));
  },

  // Notes
  getNotes: async (params = {}) => {
    return apiClient.get(ENDPOINTS.USERS.NOTES, { params });
  },

  getNoteById: async (id) => {
    return apiClient.get(ENDPOINTS.USERS.NOTE_BY_ID(id));
  },

  createNote: async (noteData) => {
    return apiClient.post(ENDPOINTS.USERS.NOTES, noteData);
  },

  updateNote: async (id, data) => {
    return apiClient.patch(ENDPOINTS.USERS.NOTE_BY_ID(id), data);
  },

  deleteNote: async (id) => {
    return apiClient.delete(ENDPOINTS.USERS.NOTE_BY_ID(id));
  },

  // History
  getHistory: async (params = {}) => {
    return apiClient.get(ENDPOINTS.USERS.HISTORY, { params });
  },

  clearHistory: async () => {
    return apiClient.delete(ENDPOINTS.USERS.HISTORY);
  },
};

export default libraryApi;
