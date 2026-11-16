import { query, pool } from "../config/db.js";
import INITIAL_AUDIO_CATALOG from "../config/audio-catalog.js";
import logger from "../utils/logger.js";

export async function seedAudioCatalog() {
  logger.info("Seeding Audio Paath catalogue...");

  try {
    // Ensure table exists
    await query(`
      CREATE TABLE IF NOT EXISTS audio_banis (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        english_name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        punjabi_name VARCHAR(255) NOT NULL,
        gurmukhi_title VARCHAR(255),
        author VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        artwork_url TEXT,
        audio_url TEXT,
        duration_seconds INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const item of INITIAL_AUDIO_CATALOG) {
      await query(
        `
        INSERT INTO audio_banis (
          slug, english_name, title, punjabi_name, gurmukhi_title, author, category,
          description, audio_url, duration_seconds, is_available, is_active, display_order, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (slug) DO UPDATE
        SET
          english_name = EXCLUDED.english_name,
          title = EXCLUDED.title,
          punjabi_name = EXCLUDED.punjabi_name,
          gurmukhi_title = EXCLUDED.gurmukhi_title,
          author = EXCLUDED.author,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          audio_url = EXCLUDED.audio_url,
          duration_seconds = EXCLUDED.duration_seconds,
          is_available = EXCLUDED.is_available,
          is_active = EXCLUDED.is_active,
          display_order = EXCLUDED.display_order,
          sort_order = EXCLUDED.sort_order,
          updated_at = CURRENT_TIMESTAMP;
        `,
        [
          item.slug,
          item.english_name,
          item.title,
          item.punjabi_name,
          item.gurmukhi_title,
          item.author,
          item.category,
          item.description,
          item.audio_url,
          item.duration_seconds || 0,
          item.is_available,
          item.is_active,
          item.display_order,
          item.sort_order,
        ]
      );
    }

    logger.info(`Successfully seeded ${INITIAL_AUDIO_CATALOG.length} recordings into audio_banis`);
  } catch (err) {
    logger.error("Error seeding audio catalogue:", err.message);
  } finally {
    await pool.end();
  }
}

// If run directly from CLI
if (process.argv[1]?.endsWith("seed-audio.js")) {
  seedAudioCatalog();
}
