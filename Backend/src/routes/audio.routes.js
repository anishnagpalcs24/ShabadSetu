import { Router } from "express";
import audioController from "../controllers/audio.controller.js";

const router = Router();

// GET /api/v1/audio
router.get("/", audioController.getCatalog);

// GET /api/v1/audio/:baniSlug
router.get("/:baniSlug", audioController.getBySlug);

export default router;
