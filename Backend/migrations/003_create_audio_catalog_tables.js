export const up = (pgm) => {
  pgm.sql(`
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

    CREATE INDEX IF NOT EXISTS idx_audio_banis_slug ON audio_banis(slug);
    CREATE INDEX IF NOT EXISTS idx_audio_banis_availability ON audio_banis(is_available, display_order);

    -- Seed 8 verified ImageKit recordings + catalogue
    INSERT INTO audio_banis (slug, english_name, title, punjabi_name, gurmukhi_title, author, category, description, audio_url, duration_seconds, is_available, is_active, display_order, sort_order)
    VALUES
      ('anand-sahib', 'Anand Sahib', 'Anand Sahib', 'ਅਨੰਦੁ ਸਾਹਿਬ', 'ਅਨੰਦੁ ਸਾਹਿਬ', 'Guru Amar Das Ji', 'Bliss / Completion', 'The hymn of celestial bliss, inner union, and divine tranquility composed in Raag Ramkali.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/anand-sahib', 780, TRUE, TRUE, 5, 5),
      ('jaap-sahib', 'Jaap Sahib', 'Jaap Sahib', 'ਜਾਪੁ ਸਾਹਿਬ', 'ਜਾਪੁ ਸਾਹਿਬ', 'Guru Gobind Singh Ji', 'Morning / Amritvela', '199 sacred verses glorifying the infinite, formless, attribute-less, and sovereign nature of the Almighty.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/jaap-sahib.mp3', 2235, TRUE, TRUE, 2, 2),
      ('japji-sahib', 'Japji Sahib', 'Japji Sahib', 'ਜਪੁਜੀ ਸਾਹਿਬ', 'ਜਪੁਜੀ ਸਾਹਿਬ', 'Guru Nanak Dev Ji', 'Morning / Amritvela', 'The foundational composition of Sikh faith, revealing the nature of the Divine and the path of truthful living.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/japji-sahib.mp3', 1650, TRUE, TRUE, 1, 1),
      ('chaupai-sahib', 'Chaupai Sahib', 'Chaupai Sahib', 'ਚੌਪਈ ਸਾਹਿਬ', 'ਚੌਪਈ ਸਾਹਿਬ', 'Guru Gobind Singh Ji', 'Protection / Amritvela', 'A prayer of protection and surrender invoking God''s divine shield from obstacles, doubts, and sorrows.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/chaupai-sahib.mp3', 516, TRUE, TRUE, 4, 4),
      ('tav-prasad-savaiye', 'Tav-Prasad Savaiye', 'Tav-Prasad Savaiye', 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', 'Guru Gobind Singh Ji', 'Morning / Amritvela', 'Ten divine stanzas emphasizing that genuine devotion and love for God surpass all outward rituals.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/tav-prasad-savaiye.mp3?updatedAt=1794759772992', 433, TRUE, TRUE, 3, 3),
      ('kirtan-sohila', 'Kirtan Sohila', 'Kirtan Sohila', 'ਕੀਰਤਨ ਸੋਹਿਲਾ', 'ਕੀਰਤਨ ਸੋਹਿਲਾ', 'Guru Nanak, Guru Ram Das, Guru Arjan', 'Night / Bedtime', 'The serene night prayer sung before sleep, contemplating mortal journey, detachment, and peaceful rest.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/kirtan-sohila.mp3', 454, TRUE, TRUE, 7, 7),
      ('sukhmani-sahib', 'Sukhmani Sahib', 'Sukhmani Sahib', 'ਸੁਖਮਨੀ ਸਾਹਿਬ', 'ਸੁਖਮਨੀ ਸਾਹਿਬ', 'Guru Arjan Dev Ji', 'Jewel of Peace', 'The Jewel of Peace comprising 24 Ashtpadis; brings supreme inner tranquility and soothes troubled minds.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/sukhmani-sahib.mp3', 5000, TRUE, TRUE, 8, 8),
      ('mool-mantar', 'Mool Mantar', 'Mool Mantar', 'ਮੂਲ ਮੰਤਰ', 'ਮੂਲ ਮੰਤਰ', 'Guru Nanak Dev Ji', 'Foundation / Amritvela', 'The root mantra and foundational affirmation of Sikh faith, revealing the eternal virtues of Ik Onkar.', 'https://ik.imagekit.io/anish03/shabadsetu-audio/mool-mantra.mp3', 1140, TRUE, TRUE, 9, 9),
      ('rehras-sahib', 'Rehras Sahib', 'Rehras Sahib', 'ਰਹਰਾਸਿ ਸਾਹਿਬ', 'ਰਹਰਾਸਿ ਸਾਹਿਬ', 'Multiple Gurus', 'Evening / Sunset', 'The twilight prayer expressing gratitude at the end of the working day, recounting divine majesty.', NULL, 1080, FALSE, FALSE, 6, 6)
    ON CONFLICT (slug) DO UPDATE
    SET
      title = EXCLUDED.title,
      gurmukhi_title = EXCLUDED.gurmukhi_title,
      audio_url = EXCLUDED.audio_url,
      is_available = EXCLUDED.is_available,
      is_active = EXCLUDED.is_active,
      duration_seconds = EXCLUDED.duration_seconds,
      updated_at = CURRENT_TIMESTAMP;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS audio_banis CASCADE;
  `);
};
