import app from "./src/app.js";
import env from "./src/config/env.js";
import { checkDbHealth, closePool } from "./src/config/db.js";
import logger from "./src/utils/logger.js";

const PORT = env.PORT || 3000;

let server;

async function startServer() {
  const isHealthy = await checkDbHealth();
  if (!isHealthy) {
    logger.warn("Initial PostgreSQL connection test failed. Server starting anyway.");
  } else {
    logger.info("Connected to PostgreSQL database successfully.");
  }

  server = app.listen(PORT, () => {
    logger.info(`ShabadSetu Backend is running on port ${PORT} [${env.NODE_ENV}]`);
  });
}

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed.");
      try {
        await closePool();
        logger.info("Database pool closed. Exiting process.");
        process.exit(0);
      } catch (err) {
        logger.error("Error during graceful shutdown", err.message);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason instanceof Error ? reason.stack : reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error.stack);
  process.exit(1);
});

// For local Node.js server execution (not inside Vercel serverless runtime)
if (!process.env.VERCEL) {
  startServer();
}

export default app;
