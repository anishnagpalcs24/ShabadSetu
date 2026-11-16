import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
import logger from "./utils/logger.js";
import AppError from "./utils/app-error.js";

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// CORS configuration supporting Production Vercel and Local Development
const defaultAllowedOrigins = [
  "https://shabadsetu.vercel.app",
  "https://shabadsetu-backend.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const envOrigins = [
  ...(env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",") : []),
  ...(env.FRONTEND_URL ? env.FRONTEND_URL.split(",") : [])
]
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Mobile apps, curl, server-to-server, health checks
  const normalized = origin.trim().replace(/\/+$/, "");
  if (allowedOrigins.includes(normalized) || allowedOrigins.includes("*")) {
    return true;
  }
  // Support Vercel preview deployments (e.g., shabadsetu-git-*.vercel.app)
  try {
    const url = new URL(normalized);
    if (url.hostname.endsWith(".vercel.app") && url.hostname.includes("shabadsetu")) {
      return true;
    }
  } catch {
    // Malformed origin
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Origin ${origin} blocked by CORS policy`);
      callback(new AppError(`Origin ${origin} not allowed by CORS policy`, 403));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control"
  ],
  exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

// Body parsing and cookies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// General API rate limiter
app.use("/api/", apiLimiter);

// Mount API v1 routes
app.use("/api/v1", routes);

// 404 Route Handler
app.use((req, res, next) => {
  next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404));
});

// Centralized error handler
app.use(errorHandler);

export default app;
