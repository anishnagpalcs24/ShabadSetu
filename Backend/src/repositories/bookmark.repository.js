import db from "../config/db.js";

export class BookmarkRepository {
  async createBookmark(userId, { type, source = null, pageNumber = null, shabadId = null, lineId = null, title = null, note = null }) {
    const text = `
      INSERT INTO bookmarks (user_id, type, source, page_number, shabad_id, line_id, title, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [userId, type, source, pageNumber, shabadId, lineId, title, note];
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async getBookmarks(userId, { type, limit = 50, offset = 0 } = {}) {
    let text = `SELECT * FROM bookmarks WHERE user_id = $1`;
    const values = [userId];

    if (type) {
      values.push(type);
      text += ` AND type = $${values.length}`;
    }

    text += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const { rows } = await db.query(text, values);
    return rows;
  }

  async getBookmarkById(id, userId) {
    const text = `SELECT * FROM bookmarks WHERE id = $1 AND user_id = $2`;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }

  async deleteBookmark(id, userId) {
    const text = `DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING id`;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }
}

export default new BookmarkRepository();
