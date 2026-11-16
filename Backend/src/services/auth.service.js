import bcrypt from "bcryptjs";
import userRepository from "../repositories/user.repository.js";
import authRepository from "../repositories/auth.repository.js";
import preferencesRepository from "../repositories/preferences.repository.js";
import otpService from "./otp.service.js";
import emailService from "./email.service.js";
import tokenService from "./token.service.js";
import db, { withTransaction } from "../config/db.js";
import AppError from "../utils/app-error.js";
import logger from "../utils/logger.js";

const BCRYPT_SALT_ROUNDS = 12;

export class AuthService {
  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Check if an active, verified account already exists without revealing existence
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser && existingUser.is_verified) {
      // Do not reveal account existence to prevent email enumeration
      logger.info(`Registration attempted for already registered email: ${normalizedEmail}`);
      return {
        message: "If your email is eligible, a verification code has been dispatched."
      };
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const otp = otpService.generateOtp();
    const otpHash = otpService.hashOtp(otp);
    const expiresAt = otpService.getExpirationDate();

    // Store pending verification securely
    await authRepository.createPendingVerification({
      email: normalizedEmail,
      name: cleanName,
      passwordHash,
      otpHash,
      expiresAt
    });

    // Send OTP via email/console
    await emailService.sendOtpEmail({
      to: normalizedEmail,
      otp,
      type: "registration"
    });

    return {
      message: "A 6-digit verification code has been sent to your email."
    };
  }

  async verifyEmail({ email, otp, deviceInfo = null, ipAddress = null }) {
    const normalizedEmail = email.toLowerCase().trim();
    const pending = await authRepository.findLatestPendingVerification(normalizedEmail);

    if (!pending) {
      throw new AppError("No pending registration found for this email or code has already been used", 400);
    }

    if (pending.attempts >= pending.max_attempts) {
      await authRepository.markVerificationConsumed(pending.id);
      throw new AppError("Maximum verification attempts exceeded. Please register or request a new code.", 400);
    }

    if (otpService.isExpired(pending.expires_at)) {
      throw new AppError("Verification code has expired. Please request a new code.", 400);
    }

    const isValidOtp = otpService.verifyOtp(otp, pending.otp_hash);
    if (!isValidOtp) {
      await authRepository.incrementVerificationAttempts(pending.id);
      const remainingAttempts = pending.max_attempts - (pending.attempts + 1);
      throw new AppError(`Invalid verification code. ${remainingAttempts} attempts remaining.`, 400);
    }

    // Atomically create verified user, user profile, and user preferences
    const result = await withTransaction(async (client) => {
      await authRepository.markVerificationConsumed(pending.id, client);

      // Check if user already exists in users table (unverified)
      let user = await userRepository.findByEmail(normalizedEmail, client);
      if (user) {
        user = await userRepository.updateVerificationStatus(user.id, true, client);
      } else {
        user = await userRepository.createUser({
          email: normalizedEmail,
          name: pending.name,
          passwordHash: pending.password_hash,
          isVerified: true
        }, client);
      }

      // Create initial profile
      await userRepository.createProfile(user.id, { displayName: user.name }, client);

      // Create initial preferences
      await preferencesRepository.upsertPreferences(user.id, {}, client);

      // Issue authentication tokens
      const { token: accessToken } = tokenService.generateAccessToken(user);
      const { token: refreshToken, familyId } = tokenService.generateRefreshToken(user);

      await tokenService.storeRefreshToken({
        userId: user.id,
        rawToken: refreshToken,
        familyId,
        deviceInfo,
        ipAddress
      }, client);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.is_verified
        },
        accessToken,
        refreshToken
      };
    });

    return result;
  }

  async resendOtp({ email }) {
    const normalizedEmail = email.toLowerCase().trim();
    const pending = await authRepository.findLatestPendingVerification(normalizedEmail);

    if (!pending) {
      // Avoid revealing pending account state
      return {
        message: "If a pending registration exists, a new code has been sent."
      };
    }

    if (otpService.isCooldownActive(pending.last_resend_at)) {
      const remainingSeconds = otpService.getRemainingCooldownSeconds(pending.last_resend_at);
      throw new AppError(`Please wait ${remainingSeconds} seconds before requesting a new code.`, 429);
    }

    const newOtp = otpService.generateOtp();
    const newOtpHash = otpService.hashOtp(newOtp);
    const newExpiresAt = otpService.getExpirationDate();

    await authRepository.updatePendingVerificationOtp(pending.id, {
      otpHash: newOtpHash,
      expiresAt: newExpiresAt
    });

    await emailService.sendOtpEmail({
      to: normalizedEmail,
      otp: newOtp,
      type: "registration"
    });

    return {
      message: "A new verification code has been dispatched."
    };
  }

  async login({ email, password, deviceInfo = null, ipAddress = null }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.is_verified) {
      throw new AppError("Account is not verified. Please verify your email first.", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const { token: accessToken } = tokenService.generateAccessToken(user);
    const { token: refreshToken, familyId } = tokenService.generateRefreshToken(user);

    await tokenService.storeRefreshToken({
      userId: user.id,
      rawToken: refreshToken,
      familyId,
      deviceInfo,
      ipAddress
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.is_verified
      },
      accessToken,
      refreshToken
    };
  }

  async refresh({ refreshToken, deviceInfo = null, ipAddress = null }) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const { accessToken, refreshToken: newRefreshToken, userId } = await tokenService.rotateRefreshToken(
      refreshToken,
      { deviceInfo, ipAddress }
    );

    const user = await userRepository.findById(userId);

    return {
      user,
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout({ refreshToken, accessToken = null }) {
    await tokenService.revokeSession(refreshToken, accessToken);
    return { message: "Logged out successfully" };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.getProfile(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async forgotPassword({ email }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || !user.is_verified) {
      // Do not reveal account existence
      return {
        message: "If an account exists with this email, a reset code has been sent."
      };
    }

    const otp = otpService.generateOtp();
    const otpHash = otpService.hashOtp(otp);
    const expiresAt = otpService.getExpirationDate();

    await authRepository.createPasswordResetToken({
      userId: user.id,
      otpHash,
      expiresAt
    });

    await emailService.sendOtpEmail({
      to: normalizedEmail,
      otp,
      type: "password_reset"
    });

    return {
      message: "If an account exists with this email, a reset code has been sent."
    };
  }

  async resetPassword({ email, otp, newPassword }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError("Invalid or expired password reset request", 400);
    }

    const resetToken = await authRepository.findLatestPasswordResetToken(user.id);
    if (!resetToken) {
      throw new AppError("No active password reset request found", 400);
    }

    if (resetToken.attempts >= resetToken.max_attempts) {
      await authRepository.markPasswordResetConsumed(resetToken.id);
      throw new AppError("Maximum reset attempts exceeded. Please request a new code.", 400);
    }

    if (otpService.isExpired(resetToken.expires_at)) {
      throw new AppError("Reset code has expired. Please request a new code.", 400);
    }

    const isValid = otpService.verifyOtp(otp, resetToken.otp_hash);
    if (!isValid) {
      await authRepository.incrementPasswordResetAttempts(resetToken.id);
      throw new AppError("Invalid reset code", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await withTransaction(async (client) => {
      await authRepository.markPasswordResetConsumed(resetToken.id, client);
      await userRepository.updatePassword(user.id, passwordHash, client);
      // Revoke all existing sessions for security
      await tokenService.revokeSession(null, null);
    });

    return {
      message: "Password reset successful. You may now log in with your new password."
    };
  }
}

export default new AuthService();
