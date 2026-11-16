import db from "../config/db.js";

export class PreferencesRepository {
  async getPreferences(userId, client = db) {
    const text = `
      SELECT *
      FROM user_preferences
      WHERE user_id = $1;
    `;
    const { rows } = await client.query(text, [userId]);
    return rows[0] || null;
  }

  async upsertPreferences(userId, prefs = {}, client = db) {
    const {
      theme = "system",
      fontSize = "medium",
      larivaar = false,
      englishTranslation = true,
      punjabiTeeka = true,
      spanishTranslation = false,
      customSettings = {}
    } = prefs;

    const text = `
      INSERT INTO user_preferences (
        user_id, theme, font_size, larivaar,
        english_translation, punjabi_teeka, spanish_translation,
        custom_settings, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE
      SET theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
          font_size = COALESCE(EXCLUDED.font_size, user_preferences.font_size),
          larivaar = COALESCE(EXCLUDED.larivaar, user_preferences.larivaar),
          english_translation = COALESCE(EXCLUDED.english_translation, user_preferences.english_translation),
          punjabi_teeka = COALESCE(EXCLUDED.punjabi_teeka, user_preferences.punjabi_teeka),
          spanish_translation = COALESCE(EXCLUDED.spanish_translation, user_preferences.spanish_translation),
          custom_settings = COALESCE(EXCLUDED.custom_settings, user_preferences.custom_settings),
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userId,
      theme,
      fontSize,
      larivaar,
      englishTranslation,
      punjabiTeeka,
      spanishTranslation,
      JSON.stringify(customSettings)
    ];

    const { rows } = await client.query(text, values);
    return rows[0];
  }
}

export default new PreferencesRepository();
