import { query } from "../config/db.js";
import INITIAL_AUDIO_CATALOG from "../config/audio-catalog.js";
import logger from "../utils/logger.js";

export class AudioRepository {
  async getAll(onlyAvailable = false) {
    try {
      const sql = onlyAvailable
        ? "SELECT * FROM audio_banis WHERE is_available = TRUE ORDER BY display_order ASC, id ASC"
        : "SELECT * FROM audio_banis ORDER BY display_order ASC, id ASC";

      const res = await query(sql);
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      logger.debug("Database audio query unavailable, serving from configuration catalogue:", err.message);
    }

    // Fallback to configured catalogue
    return onlyAvailable
      ? INITIAL_AUDIO_CATALOG.filter((b) => b.is_available)
      : INITIAL_AUDIO_CATALOG;
  }

  async getBySlug(slug) {
    const cleanSlug = String(slug).trim().toLowerCase();
    try {
      const res = await query(
        "SELECT * FROM audio_banis WHERE LOWER(slug) = $1 LIMIT 1",
        [cleanSlug]
      );
      if (res.rows && res.rows[0]) {
        return res.rows[0];
      }
    } catch (err) {
      logger.debug(`Database query for slug ${cleanSlug} unavailable, using configuration catalogue:`, err.message);
    }

    // Fallback lookup
    const found = INITIAL_AUDIO_CATALOG.find(
      (b) => b.slug.toLowerCase() === cleanSlug
    );
    return found || null;
  }
}

export default new AudioRepository();
