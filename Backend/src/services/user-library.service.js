import userRepository from "../repositories/user.repository.js";
import bookmarkRepository from "../repositories/bookmark.repository.js";
import collectionRepository from "../repositories/collection.repository.js";
import noteRepository from "../repositories/note.repository.js";
import progressRepository from "../repositories/progress.repository.js";
import preferencesRepository from "../repositories/preferences.repository.js";
import AppError from "../utils/app-error.js";

export class UserLibraryService {
  // --- Profile ---
  async getProfile(userId) {
    const profile = await userRepository.getProfile(userId);
    if (!profile) throw new AppError("User profile not found", 404);
    return profile;
  }

  async updateProfile(userId, data) {
    return userRepository.updateProfile(userId, data);
  }

  // --- Bookmarks ---
  async createBookmark(userId, bookmarkData) {
    if (!bookmarkData.type) {
      throw new AppError("Bookmark type is required (e.g. 'shabad', 'line', 'ang')", 400);
    }
    return bookmarkRepository.createBookmark(userId, bookmarkData);
  }

  async getBookmarks(userId, options) {
    return bookmarkRepository.getBookmarks(userId, options);
  }

  async deleteBookmark(id, userId) {
    const deleted = await bookmarkRepository.deleteBookmark(id, userId);
    if (!deleted) throw new AppError("Bookmark not found", 404);
    return { id };
  }

  // --- Collections ---
  async createCollection(userId, data) {
    if (!data.title) {
      throw new AppError("Collection title is required", 400);
    }
    return collectionRepository.createCollection(userId, data);
  }

  async getCollections(userId) {
    return collectionRepository.getCollections(userId);
  }

  async getCollectionById(id, userId) {
    const collection = await collectionRepository.getCollectionById(id, userId);
    if (!collection) throw new AppError("Collection not found", 404);
    const items = await collectionRepository.getItems(id);
    return { ...collection, items };
  }

  async updateCollection(id, userId, data) {
    const updated = await collectionRepository.updateCollection(id, userId, data);
    if (!updated) throw new AppError("Collection not found", 404);
    return updated;
  }

  async deleteCollection(id, userId) {
    const deleted = await collectionRepository.deleteCollection(id, userId);
    if (!deleted) throw new AppError("Collection not found", 404);
    return { id };
  }

  async addItemToCollection(collectionId, userId, itemData) {
    const collection = await collectionRepository.getCollectionById(collectionId, userId);
    if (!collection) throw new AppError("Collection not found", 404);
    return collectionRepository.addItem(collectionId, itemData);
  }

  async removeItemFromCollection(itemId, collectionId, userId) {
    const collection = await collectionRepository.getCollectionById(collectionId, userId);
    if (!collection) throw new AppError("Collection not found", 404);
    const removed = await collectionRepository.removeItem(itemId, collectionId);
    if (!removed) throw new AppError("Item not found in collection", 404);
    return { id: itemId };
  }

  // --- Notes ---
  async createNote(userId, noteData) {
    if (!noteData.content || !noteData.content.trim()) {
      throw new AppError("Note content cannot be empty", 400);
    }
    return noteRepository.createNote(userId, noteData);
  }

  async getNotes(userId, query) {
    return noteRepository.getNotes(userId, query);
  }

  async getNoteById(id, userId) {
    const note = await noteRepository.getNoteById(id, userId);
    if (!note) throw new AppError("Note not found", 404);
    return note;
  }

  async updateNote(id, userId, data) {
    if (!data.content || !data.content.trim()) {
      throw new AppError("Note content cannot be empty", 400);
    }
    const updated = await noteRepository.updateNote(id, userId, data);
    if (!updated) throw new AppError("Note not found", 404);
    return updated;
  }

  async deleteNote(id, userId) {
    const deleted = await noteRepository.deleteNote(id, userId);
    if (!deleted) throw new AppError("Note not found", 404);
    return { id };
  }

  // --- Reading Progress & History ---
  async getProgress(userId, source = "G") {
    const progress = await progressRepository.getProgress(userId, source);
    return progress || { source, current_page: 1, total_pages: 1430, completed_cycles: 0 };
  }

  async updateProgress(userId, progressData) {
    if (!progressData.currentPage) {
      throw new AppError("Current page is required", 400);
    }
    return progressRepository.upsertProgress(userId, progressData);
  }

  async getHistory(userId, options) {
    return progressRepository.getReadingHistory(userId, options);
  }

  async clearHistory(userId) {
    await progressRepository.clearReadingHistory(userId);
    return { message: "Reading history cleared" };
  }

  // --- Preferences ---
  async getPreferences(userId) {
    const prefs = await preferencesRepository.getPreferences(userId);
    return prefs || { theme: "system", font_size: "medium", larivaar: false, english_translation: true, punjabi_teeka: true };
  }

  async updatePreferences(userId, prefsData) {
    return preferencesRepository.upsertPreferences(userId, prefsData);
  }
}

export default new UserLibraryService();
