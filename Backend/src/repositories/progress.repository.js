import db from "../config/db.js";

export class ProgressRepository {
  async getProgress(userId, source = "G") {
    const text = `
      SELECT *
      FROM reading_progress
      WHERE user_id = $1 AND source = $2;
    `;
    const { rows } = await db.query(text, [userId, source]);
    return rows[0] || null;
  }

  async getAllProgress(userId) {
    const text = `
      SELECT *
      FROM reading_progress
      WHERE user_id = $1
      ORDER BY last_read_at DESC;
    `;
    const { rows } = await db.query(text, [userId]);
    return rows;
  }

  async upsertProgress(userId, { source = "G", currentPage, totalPages = 1430, completedCycles = 0 }) {
    const text = `
      INSERT INTO reading_progress (user_id, source, current_page, total_pages, completed_cycles, last_read_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, source) DO UPDATE
      SET current_page = EXCLUDED.current_page,
          total_pages = EXCLUDED.total_pages,
          completed_cycles = EXCLUDED.completed_cycles,
          last_read_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [userId, source, currentPage, totalPages, completedCycles];
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async addReadingHistory(userId, { source, pageNumber, shabadId = null }) {
    const text = `
      INSERT INTO reading_history (user_id, source, page_number, shabad_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(text, [userId, source, pageNumber, shabadId]);
    return rows[0];
  }

  async getReadingHistory(userId, { limit = 50, offset = 0 } = {}) {
    const text = `
      SELECT *
      FROM reading_history
      WHERE user_id = $1
      ORDER BY read_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(text, [userId, limit, offset]);
    return rows;
  }

  async clearReadingHistory(userId) {
    const text = `
      DELETE FROM reading_history
      WHERE user_id = $1
      RETURNING id;
    `;
    const { rows } = await db.query(text, [userId]);
    return rows;
  }
}

export default new ProgressRepository();
