import tokenService from "../services/token.service.js";
import AppError from "../utils/app-error.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Please provide a valid token.", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Authentication required. Token missing.", 401);
    }

    const decoded = await tokenService.verifyAccessToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name
    };
    req.accessToken = token;

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = await tokenService.verifyAccessToken(token);
          req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name
          };
          req.accessToken = token;
        } catch {
          // Ignore invalid optional tokens
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  optionalAuthenticate
};
