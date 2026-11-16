import userLibraryService from "../services/user-library.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class UserController {
  // --- Profile ---
  async getProfile(req, res, next) {
    try {
      const profile = await userLibraryService.getProfile(req.user.id);
      return sendSuccess(res, { statusCode: 200, data: { profile } });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { displayName, bio, avatarUrl } = req.body;
      const profile = await userLibraryService.updateProfile(req.user.id, { displayName, bio, avatarUrl });
      return sendSuccess(res, { statusCode: 200, message: "Profile updated successfully", data: { profile } });
    } catch (error) {
      next(error);
    }
  }

  // --- Bookmarks ---
  async getBookmarks(req, res, next) {
    try {
      const { type, limit, offset } = req.query;
      const bookmarks = await userLibraryService.getBookmarks(req.user.id, {
        type,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });
      return sendSuccess(res, { statusCode: 200, data: { bookmarks } });
    } catch (error) {
      next(error);
    }
  }

  async createBookmark(req, res, next) {
    try {
      const bookmark = await userLibraryService.createBookmark(req.user.id, req.body);
      return sendSuccess(res, { statusCode: 201, message: "Bookmark created", data: { bookmark } });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmark(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userLibraryService.deleteBookmark(id, req.user.id);
      return sendSuccess(res, { statusCode: 200, message: "Bookmark deleted", data: result });
    } catch (error) {
      next(error);
    }
  }

  // --- Collections ---
  async getCollections(req, res, next) {
    try {
      const collections = await userLibraryService.getCollections(req.user.id);
      return sendSuccess(res, { statusCode: 200, data: { collections } });
    } catch (error) {
      next(error);
    }
  }

  async createCollection(req, res, next) {
    try {
      const collection = await userLibraryService.createCollection(req.user.id, req.body);
      return sendSuccess(res, { statusCode: 201, message: "Collection created", data: { collection } });
    } catch (error) {
      next(error);
    }
  }

  async getCollectionById(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await userLibraryService.getCollectionById(id, req.user.id);
      return sendSuccess(res, { statusCode: 200, data: { collection } });
    } catch (error) {
      next(error);
    }
  }

  async updateCollection(req, res, next) {
    try {
      const { id } = req.params;
      const collection = await userLibraryService.updateCollection(id, req.user.id, req.body);
      return sendSuccess(res, { statusCode: 200, message: "Collection updated", data: { collection } });
    } catch (error) {
      next(error);
    }
  }

  async deleteCollection(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userLibraryService.deleteCollection(id, req.user.id);
      return sendSuccess(res, { statusCode: 200, message: "Collection deleted", data: result });
    } catch (error) {
      next(error);
    }
  }

  async addCollectionItem(req, res, next) {
    try {
      const { id } = req.params;
      const item = await userLibraryService.addItemToCollection(id, req.user.id, req.body);
      return sendSuccess(res, { statusCode: 201, message: "Item added to collection", data: { item } });
    } catch (error) {
      next(error);
    }
  }

  async removeCollectionItem(req, res, next) {
    try {
      const { id, itemId } = req.params;
      const result = await userLibraryService.removeItemFromCollection(itemId, id, req.user.id);
      return sendSuccess(res, { statusCode: 200, message: "Item removed from collection", data: result });
    } catch (error) {
      next(error);
    }
  }

  // --- Notes ---
  async getNotes(req, res, next) {
    try {
      const { shabadId, limit, offset } = req.query;
      const notes = await userLibraryService.getNotes(req.user.id, {
        shabadId: shabadId ? parseInt(shabadId, 10) : null,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });
      return sendSuccess(res, { statusCode: 200, data: { notes } });
    } catch (error) {
      next(error);
    }
  }

  async createNote(req, res, next) {
    try {
      const note = await userLibraryService.createNote(req.user.id, req.body);
      return sendSuccess(res, { statusCode: 201, message: "Note created", data: { note } });
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req, res, next) {
    try {
      const { id } = req.params;
      const note = await userLibraryService.getNoteById(id, req.user.id);
      return sendSuccess(res, { statusCode: 200, data: { note } });
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const { id } = req.params;
      const note = await userLibraryService.updateNote(id, req.user.id, req.body);
      return sendSuccess(res, { statusCode: 200, message: "Note updated", data: { note } });
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userLibraryService.deleteNote(id, req.user.id);
      return sendSuccess(res, { statusCode: 200, message: "Note deleted", data: result });
    } catch (error) {
      next(error);
    }
  }

  // --- Reading Progress & History ---
  async getProgress(req, res, next) {
    try {
      const { source } = req.query;
      const progress = await userLibraryService.getProgress(req.user.id, source || "G");
      return sendSuccess(res, { statusCode: 200, data: { progress } });
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req, res, next) {
    try {
      const progress = await userLibraryService.updateProgress(req.user.id, req.body);
      return sendSuccess(res, { statusCode: 200, message: "Reading progress updated", data: { progress } });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const history = await userLibraryService.getHistory(req.user.id, {
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });
      return sendSuccess(res, { statusCode: 200, data: { history } });
    } catch (error) {
      next(error);
    }
  }

  async clearHistory(req, res, next) {
    try {
      const result = await userLibraryService.clearHistory(req.user.id);
      return sendSuccess(res, { statusCode: 200, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  // --- Preferences ---
  async getPreferences(req, res, next) {
    try {
      const preferences = await userLibraryService.getPreferences(req.user.id);
      return sendSuccess(res, { statusCode: 200, data: { preferences } });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const preferences = await userLibraryService.updatePreferences(req.user.id, req.body);
      return sendSuccess(res, { statusCode: 200, message: "Preferences updated", data: { preferences } });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
