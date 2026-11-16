import db from "../config/db.js";

export class NoteRepository {
  async createNote(userId, { shabadId = null, lineId = null, source = null, content }) {
    const text = `
      INSERT INTO personal_notes (user_id, shabad_id, line_id, source, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, shabadId, lineId, source, content];
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async getNotes(userId, { shabadId = null, limit = 50, offset = 0 } = {}) {
    let text = `SELECT * FROM personal_notes WHERE user_id = $1`;
    const values = [userId];

    if (shabadId) {
      values.push(shabadId);
      text += ` AND shabad_id = $${values.length}`;
    }

    text += ` ORDER BY updated_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const { rows } = await db.query(text, values);
    return rows;
  }

  async getNoteById(id, userId) {
    const text = `SELECT * FROM personal_notes WHERE id = $1 AND user_id = $2`;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }

  async updateNote(id, userId, { content }) {
    const text = `
      UPDATE personal_notes
      SET content = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(text, [id, userId, content]);
    return rows[0] || null;
  }

  async deleteNote(id, userId) {
    const text = `DELETE FROM personal_notes WHERE id = $1 AND user_id = $2 RETURNING id`;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }
}

export default new NoteRepository();
