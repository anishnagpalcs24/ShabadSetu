import db from "../config/db.js";

export class TokenRepository {
  async createRefreshToken({ userId, tokenHash, familyId, deviceInfo = null, ipAddress = null, expiresAt }, client = db) {
    const text = `
      INSERT INTO refresh_tokens (user_id, token_hash, family_id, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [userId, tokenHash, familyId, deviceInfo, ipAddress, expiresAt];
    const { rows } = await client.query(text, values);
    return rows[0];
  }

  async findRefreshTokenByHash(tokenHash, client = db) {
    const text = `
      SELECT *
      FROM refresh_tokens
      WHERE token_hash = $1;
    `;
    const { rows } = await client.query(text, [tokenHash]);
    return rows[0] || null;
  }

  async markTokenRevoked(id, client = db) {
    const text = `
      UPDATE refresh_tokens
      SET is_revoked = TRUE
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }

  async revokeTokenFamily(familyId, client = db) {
    const text = `
      UPDATE refresh_tokens
      SET is_revoked = TRUE
      WHERE family_id = $1
      RETURNING id;
    `;
    const { rows } = await client.query(text, [familyId]);
    return rows;
  }

  async revokeAllUserTokens(userId, client = db) {
    const text = `
      UPDATE refresh_tokens
      SET is_revoked = TRUE
      WHERE user_id = $1
      RETURNING id;
    `;
    const { rows } = await client.query(text, [userId]);
    return rows;
  }

  async addRevokedJti({ jti, userId = null, expiresAt }, client = db) {
    const text = `
      INSERT INTO revoked_tokens (jti, user_id, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (jti) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await client.query(text, [jti, userId, expiresAt]);
    return rows[0] || null;
  }

  async isJtiRevoked(jti, client = db) {
    const text = `
      SELECT id
      FROM revoked_tokens
      WHERE jti = $1 AND expires_at > CURRENT_TIMESTAMP;
    `;
    const { rows } = await client.query(text, [jti]);
    return rows.length > 0;
  }
}

export default new TokenRepository();
