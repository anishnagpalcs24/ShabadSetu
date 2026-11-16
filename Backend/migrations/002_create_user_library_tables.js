export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      source VARCHAR(50),
      page_number INT,
      shabad_id INT,
      line_id INT,
      title VARCHAR(255),
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_shabad_id ON bookmarks(shabad_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_page_number ON bookmarks(page_number);

    CREATE TABLE IF NOT EXISTS personal_collections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_personal_collections_user_id ON personal_collections(user_id);

    CREATE TABLE IF NOT EXISTS collection_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      collection_id UUID NOT NULL REFERENCES personal_collections(id) ON DELETE CASCADE,
      shabad_id INT,
      line_id INT,
      source VARCHAR(50),
      position INT NOT NULL DEFAULT 0,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);

    CREATE TABLE IF NOT EXISTS personal_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      shabad_id INT,
      line_id INT,
      source VARCHAR(50),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_personal_notes_user_id ON personal_notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_personal_notes_shabad_id ON personal_notes(shabad_id);

    CREATE TABLE IF NOT EXISTS reading_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      source VARCHAR(50) NOT NULL,
      current_page INT NOT NULL DEFAULT 1,
      total_pages INT NOT NULL DEFAULT 1430,
      completed_cycles INT NOT NULL DEFAULT 0,
      last_read_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_user_source_progress UNIQUE (user_id, source)
    );

    CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);

    CREATE TABLE IF NOT EXISTS reading_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      source VARCHAR(50) NOT NULL,
      page_number INT NOT NULL,
      shabad_id INT,
      read_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_reading_history_read_at ON reading_history(read_at DESC);

    CREATE TABLE IF NOT EXISTS user_preferences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      theme VARCHAR(50) NOT NULL DEFAULT 'system',
      font_size VARCHAR(20) NOT NULL DEFAULT 'medium',
      larivaar BOOLEAN NOT NULL DEFAULT FALSE,
      english_translation BOOLEAN NOT NULL DEFAULT TRUE,
      punjabi_teeka BOOLEAN NOT NULL DEFAULT TRUE,
      spanish_translation BOOLEAN NOT NULL DEFAULT FALSE,
      custom_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS user_preferences CASCADE;
    DROP TABLE IF EXISTS reading_history CASCADE;
    DROP TABLE IF EXISTS reading_progress CASCADE;
    DROP TABLE IF EXISTS personal_notes CASCADE;
    DROP TABLE IF EXISTS collection_items CASCADE;
    DROP TABLE IF EXISTS personal_collections CASCADE;
    DROP TABLE IF EXISTS bookmarks CASCADE;
  `);
};
