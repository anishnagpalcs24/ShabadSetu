import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import env from "../config/env.js";
import tokenRepository from "../repositories/token.repository.js";
import AppError from "../utils/app-error.js";
import logger from "../utils/logger.js";

const REFRESH_COOKIE_NAME = "refreshToken";

export class TokenService {
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  generateAccessToken(user) {
    const jti = crypto.randomUUID();
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      jti
    };

    const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });

    return { token, jti };
  }

  generateRefreshToken(user, familyId = null) {
    const finalFamilyId = familyId || crypto.randomUUID();
    const jti = crypto.randomUUID();

    const payload = {
      sub: user.id,
      familyId: finalFamilyId,
      jti
    };

    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    });

    return { token, familyId: finalFamilyId, jti };
  }

  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      if (decoded.jti) {
        const isRevoked = await tokenRepository.isJtiRevoked(decoded.jti);
        if (isRevoked) {
          throw new AppError("Access token has been revoked", 401);
        }
      }
      return decoded;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (err.name === "TokenExpiredError") {
        throw new AppError("Access token expired", 401);
      }
      throw new AppError("Invalid access token", 401);
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new AppError("Refresh token expired", 401);
      }
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async storeRefreshToken({ userId, rawToken, familyId, deviceInfo, ipAddress }, client) {
    const tokenHash = this.hashToken(rawToken);
    const decoded = jwt.decode(rawToken);
    const expiresAt = new Date(decoded.exp * 1000);

    return tokenRepository.createRefreshToken({
      userId,
      tokenHash,
      familyId,
      deviceInfo,
      ipAddress,
      expiresAt
    }, client);
  }

  async rotateRefreshToken(rawRefreshToken, { deviceInfo, ipAddress } = {}) {
    const decoded = this.verifyRefreshToken(rawRefreshToken);
    const tokenHash = this.hashToken(rawRefreshToken);

    const storedToken = await tokenRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      logger.warn("Unknown refresh token attempted for rotation.");
      throw new AppError("Invalid or expired session", 401);
    }

    // Reuse detection: If token was already revoked, someone is reusing an old token!
    if (storedToken.is_revoked) {
      logger.warn(`Refresh token reuse detected for family ${storedToken.family_id}! Revoking family.`);
      await tokenRepository.revokeTokenFamily(storedToken.family_id);
      throw new AppError("Token reuse detected. All sessions in this group have been terminated for security.", 401);
    }

    if (new Date() > new Date(storedToken.expires_at)) {
      await tokenRepository.markTokenRevoked(storedToken.id);
      throw new AppError("Refresh token has expired", 401);
    }

    // Mark current token as revoked
    await tokenRepository.markTokenRevoked(storedToken.id);

    // Issue new pair with the SAME family ID
    const user = { id: storedToken.user_id };
    const { token: newAccessToken } = this.generateAccessToken(user);
    const { token: newRefreshToken, familyId } = this.generateRefreshToken(user, storedToken.family_id);

    await this.storeRefreshToken({
      userId: storedToken.user_id,
      rawToken: newRefreshToken,
      familyId,
      deviceInfo: deviceInfo || storedToken.device_info,
      ipAddress: ipAddress || storedToken.ip_address
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: storedToken.user_id
    };
  }

  async revokeSession(rawRefreshToken, rawAccessToken = null) {
    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken);
      const storedToken = await tokenRepository.findRefreshTokenByHash(tokenHash);
      if (storedToken) {
        await tokenRepository.markTokenRevoked(storedToken.id);
      }
    }

    if (rawAccessToken) {
      try {
        const decoded = jwt.decode(rawAccessToken);
        if (decoded && decoded.jti && decoded.exp) {
          const expiresAt = new Date(decoded.exp * 1000);
          await tokenRepository.addRevokedJti({
            jti: decoded.jti,
            userId: decoded.sub,
            expiresAt
          });
        }
      } catch (err) {
        logger.debug("Failed to blacklist access token JTI on logout", err.message);
      }
    }
  }

  attachRefreshCookie(res, refreshToken) {
    const isProduction = env.NODE_ENV === "production";
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/api/v1/auth",
      maxAge: sevenDaysMs
    });
  }

  clearRefreshCookie(res) {
    const isProduction = env.NODE_ENV === "production";
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/api/v1/auth"
    });
  }
}

export default new TokenService();
