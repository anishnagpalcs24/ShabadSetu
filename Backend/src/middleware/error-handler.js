import env from "../config/env.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected internal server error occurred";
  let errors = err.errors || [];

  // Handle malformed JSON body errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Malformed JSON payload";
  }

  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, err.stack);
  } else {
    logger.debug(`[${req.method}] ${req.originalUrl} - ${err.message}`);
  }

  // In production, ensure 500 messages do not reveal sensitive internal information
  if (env.NODE_ENV === "production" && statusCode >= 500) {
    message = "An internal server error occurred. Please try again later.";
    errors = [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

export default errorHandler;
