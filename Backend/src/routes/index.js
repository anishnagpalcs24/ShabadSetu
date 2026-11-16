import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import gurbaniRoutes from "./gurbani.routes.js";
import searchRoutes from "./search.routes.js";
import nitnemRoutes from "./nitnem.routes.js";
import audioRoutes from "./audio.routes.js";
import { checkDbHealth } from "../config/db.js";
import { sendSuccess, sendError } from "../utils/api-response.js";

const router = Router();

// Health Check Endpoint: GET /api/v1/health
router.get("/health", async (req, res) => {
  const isDbHealthy = await checkDbHealth();
  const healthData = {
    status: isDbHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: isDbHealthy ? "connected" : "disconnected"
  };

  if (!isDbHealthy) {
    return sendError(res, {
      statusCode: 503,
      message: "Database connectivity issue detected",
      errors: ["Database unhealthy"]
    });
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: "ShabadSetu backend is healthy and running",
    data: healthData
  });
});

// Mount modular sub-routers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/gurbani", gurbaniRoutes);
router.use("/search", searchRoutes);
router.use("/nitnem", nitnemRoutes);
router.use("/audio", audioRoutes);

// Hukamnama direct endpoint aliases
router.get("/hukamnama/today", (req, res, next) => {
  req.url = "/hukamnama/today";
  gurbaniRoutes(req, res, next);
});
router.get("/hukamnama/:year/:month/:day", (req, res, next) => {
  req.url = `/hukamnama/${req.params.year}/${req.params.month}/${req.params.day}`;
  gurbaniRoutes(req, res, next);
});

export default router;
