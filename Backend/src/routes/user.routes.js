import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import {
  validateBookmark,
  validateCollection,
  validateNote
} from "../validators/user-library.validator.js";

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);

// Bookmarks
router.get("/bookmarks", userController.getBookmarks);
router.post("/bookmarks", validate({ body: validateBookmark }), userController.createBookmark);
router.delete("/bookmarks/:id", userController.deleteBookmark);

// Collections
router.get("/collections", userController.getCollections);
router.post("/collections", validate({ body: validateCollection }), userController.createCollection);
router.get("/collections/:id", userController.getCollectionById);
router.patch("/collections/:id", userController.updateCollection);
router.delete("/collections/:id", userController.deleteCollection);

// Collection Items
router.post("/collections/:id/items", userController.addCollectionItem);
router.delete("/collections/:id/items/:itemId", userController.removeCollectionItem);

// Notes
router.get("/notes", userController.getNotes);
router.post("/notes", validate({ body: validateNote }), userController.createNote);
router.get("/notes/:id", userController.getNoteById);
router.patch("/notes/:id", validate({ body: validateNote }), userController.updateNote);
router.delete("/notes/:id", userController.deleteNote);

// Reading Progress
router.get("/progress", userController.getProgress);
router.post("/progress", userController.updateProgress);

// Reading History
router.get("/history", userController.getHistory);
router.delete("/history", userController.clearHistory);

// Preferences
router.get("/preferences", userController.getPreferences);
router.patch("/preferences", userController.updatePreferences);

export default router;
