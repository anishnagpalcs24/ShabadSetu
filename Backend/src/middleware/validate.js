import AppError from "../utils/app-error.js";

export const validate = (schema) => (req, res, next) => {
  const errors = [];

  if (schema.body && typeof schema.body === "function") {
    const bodyErrors = schema.body(req.body || {});
    if (bodyErrors && bodyErrors.length > 0) {
      errors.push(...bodyErrors);
    }
  }

  if (schema.query && typeof schema.query === "function") {
    const queryErrors = schema.query(req.query || {});
    if (queryErrors && queryErrors.length > 0) {
      errors.push(...queryErrors);
    }
  }

  if (schema.params && typeof schema.params === "function") {
    const paramErrors = schema.params(req.params || {});
    if (paramErrors && paramErrors.length > 0) {
      errors.push(...paramErrors);
    }
  }

  if (errors.length > 0) {
    return next(new AppError("Validation failed", 400, errors));
  }

  next();
};

export default validate;
