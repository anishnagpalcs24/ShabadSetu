import db from "../config/db.js";

export class UserRepository {
  async createUser({ email, name, passwordHash, isVerified = true }, client = db) {
    const text = `
      INSERT INTO users (email, name, password_hash, is_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, is_verified, created_at, updated_at;
    `;
    const values = [email.toLowerCase().trim(), name.trim(), passwordHash, isVerified];
    const { rows } = await client.query(text, values);
    return rows[0];
  }

  async findByEmail(email, client = db) {
    const text = `
      SELECT id, email, name, password_hash, is_verified, created_at, updated_at
      FROM users
      WHERE email = $1;
    `;
    const { rows } = await client.query(text, [email.toLowerCase().trim()]);
    return rows[0] || null;
  }

  async findById(id, client = db) {
    const text = `
      SELECT id, email, name, is_verified, created_at, updated_at
      FROM users
      WHERE id = $1;
    `;
    const { rows } = await client.query(text, [id]);
    return rows[0] || null;
  }

  async updatePassword(id, passwordHash, client = db) {
    const text = `
      UPDATE users
      SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id;
    `;
    const { rows } = await client.query(text, [id, passwordHash]);
    return rows[0] || null;
  }

  async updateVerificationStatus(id, isVerified, client = db) {
    const text = `
      UPDATE users
      SET is_verified = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, is_verified;
    `;
    const { rows } = await client.query(text, [id, isVerified]);
    return rows[0] || null;
  }

  async getProfile(userId, client = db) {
    const text = `
      SELECT u.id, u.email, u.name, u.is_verified, u.created_at,
             p.display_name, p.bio, p.avatar_url
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1;
    `;
    const { rows } = await client.query(text, [userId]);
    return rows[0] || null;
  }

  async createProfile(userId, { displayName = null, bio = null, avatarUrl = null }, client = db) {
    const text = `
      INSERT INTO user_profiles (user_id, display_name, bio, avatar_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          bio = EXCLUDED.bio,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const { rows } = await client.query(text, [userId, displayName, bio, avatarUrl]);
    return rows[0];
  }

  async updateProfile(userId, { displayName, bio, avatarUrl }, client = db) {
    const text = `
      INSERT INTO user_profiles (user_id, display_name, bio, avatar_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
          bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
          avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const { rows } = await client.query(text, [userId, displayName, bio, avatarUrl]);
    return rows[0];
  }
}

export default new UserRepository();
