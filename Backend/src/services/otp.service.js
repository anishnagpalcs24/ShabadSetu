import crypto from "node:crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;    // 60 seconds
const MAX_ATTEMPTS = 5;

export class OtpService {
  generateOtp() {
    const min = 100000;
    const max = 999999;
    return crypto.randomInt(min, max + 1).toString();
  }

  hashOtp(otp) {
    return crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
  }

  verifyOtp(inputOtp, storedHash) {
    const inputHash = this.hashOtp(inputOtp);
    const hashBufferA = Buffer.from(inputHash, "hex");
    const hashBufferB = Buffer.from(storedHash, "hex");

    if (hashBufferA.length !== hashBufferB.length) {
      return false;
    }

    return crypto.timingSafeEqual(hashBufferA, hashBufferB);
  }

  getExpirationDate() {
    return new Date(Date.now() + OTP_EXPIRATION_MS);
  }

  isExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
  }

  isCooldownActive(lastResendAt) {
    if (!lastResendAt) return false;
    const elapsed = Date.now() - new Date(lastResendAt).getTime();
    return elapsed < RESEND_COOLDOWN_MS;
  }

  getRemainingCooldownSeconds(lastResendAt) {
    if (!lastResendAt) return 0;
    const elapsed = Date.now() - new Date(lastResendAt).getTime();
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  getMaxAttempts() {
    return MAX_ATTEMPTS;
  }
}

export default new OtpService();
