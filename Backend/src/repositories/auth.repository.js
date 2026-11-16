import db from "../config/db.js";

export class AuthRepository {
  async createPendingVerification({ email, name, passwordHash, otpHash, expiresAt }, client = db) {
    // Invalidate existing pending verifications for this email
    await client.query(
      "UPDATE email_verifications SET is_consumed = TRUE WHERE email = $1 AND is_consumed = FALSE",
      [email.toLowerCase().trim()]
    );

    const text = `
      INSERT INTO email_verifications (email, name, password_hash, otp_hash, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [email.toLowerCase().trim(), name.trim(), passwordHash, otpHash, expiresAt];
    const { rows } = await client.query(text, values);
    return rows[0];
  }

  async findLatestPendingVerification(email, client = db) {
    const text = `
      SELECT *
      FROM email_verifications
      WHERE email = $1 AND is_consumed = FALSE
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const { rows } = await client.query(text, [email.toLowerCase().trim()]);
    return rows[0] || null;
  }

  async updatePendingVerificationOtp(id, { otpHash, expiresAt }, client = db) {
    const text = `
      UPDATE email_verifications
      SET otp_hash = $2,
          expires_at = $3,
          attempts = 0,
          last_resend_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await client.query(text, [id, otpHash, expiresAt]);
    return rows[0] || null;
  }

  async incrementVerificationAttempts(id, client = db) {
    const text = `
      UPDATE email_verifications
      SET attempts = attempts + 1
      WHERE id = $1
      RETURNING attempts, max_attempts;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }

  async markVerificationConsumed(id, client = db) {
    const text = `
      UPDATE email_verifications
      SET is_consumed = TRUE
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }

  async createPasswordResetToken({ userId, otpHash, expiresAt }, client = db) {
    // Invalidate previous tokens
    await client.query(
      "UPDATE password_reset_tokens SET is_consumed = TRUE WHERE user_id = $1 AND is_consumed = FALSE",
      [userId]
    );

    const text = `
      INSERT INTO password_reset_tokens (user_id, otp_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await client.query(text, [userId, otpHash, expiresAt]);
    return rows[0];
  }

  async findLatestPasswordResetToken(userId, client = db) {
    const text = `
      SELECT *
      FROM password_reset_tokens
      WHERE user_id = $1 AND is_consumed = FALSE
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const { rows } = await client.query(text, [userId]);
    return rows[0] || null;
  }

  async incrementPasswordResetAttempts(id, client = db) {
    const text = `
      UPDATE password_reset_tokens
      SET attempts = attempts + 1
      WHERE id = $1
      RETURNING attempts, max_attempts;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }

  async markPasswordResetConsumed(id, client = db) {
    const text = `
      UPDATE password_reset_tokens
      SET is_consumed = TRUE
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }
}

export default new AuthRepository();
