# ShabadSetu Database Schema Documentation

Database: `shabadsetu`  
Engine: PostgreSQL 18  
Migration Tool: `node-pg-migrate`  
All primary keys use native PostgreSQL `UUID` (`gen_random_uuid()`).

---

## 1. Authentication Tables

### `users`
Core verified accounts table. Active accounts exist here once verified.
- `id` (UUID, PK, Default: `gen_random_uuid()`)
- `email` (VARCHAR(255), UNIQUE, NOT NULL, normalized lowercase)
- `name` (VARCHAR(255), NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL, bcrypt)
- `is_verified` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_users_email`

### `email_verifications`
Stores pending registrations securely until 6-digit OTP verification.
- `id` (UUID, PK)
- `email` (VARCHAR(255), NOT NULL)
- `name` (VARCHAR(255), NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `otp_hash` (VARCHAR(255), NOT NULL, SHA-256)
- `attempts` (INT, NOT NULL, DEFAULT 0)
- `max_attempts` (INT, NOT NULL, DEFAULT 5)
- `expires_at` (TIMESTAMPTZ, NOT NULL, 5 minutes from creation)
- `last_resend_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `is_consumed` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_email_verifications_email`, `idx_email_verifications_expires_at`

### `user_profiles`
Extended profile information for users.
- `id` (UUID, PK)
- `user_id` (UUID, UNIQUE, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `display_name` (VARCHAR(255))
- `bio` (TEXT)
- `avatar_url` (VARCHAR(1024))
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_user_profiles_user_id`

### `refresh_tokens`
Stores hashed refresh tokens, supporting multiple active devices and family-based rotation with reuse detection.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `token_hash` (VARCHAR(255), UNIQUE, NOT NULL, SHA-256)
- `family_id` (UUID, NOT NULL)
- `is_revoked` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `device_info` (VARCHAR(500))
- `ip_address` (VARCHAR(45))
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_refresh_tokens_user_id`, `idx_refresh_tokens_token_hash`, `idx_refresh_tokens_family_id`

### `revoked_tokens`
Tracks blacklisted JWT identifiers (`jti`) for immediate token revocation upon logout.
- `id` (UUID, PK)
- `jti` (VARCHAR(255), UNIQUE, NOT NULL)
- `user_id` (UUID, REFERENCES `users(id)` ON DELETE CASCADE)
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_revoked_tokens_jti`, `idx_revoked_tokens_expires_at`

### `password_reset_tokens`
Stores hashed password reset tokens and OTPs.
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `otp_hash` (VARCHAR(255), NOT NULL, SHA-256)
- `attempts` (INT, NOT NULL, DEFAULT 0)
- `max_attempts` (INT, NOT NULL, DEFAULT 5)
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `is_consumed` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_password_reset_user_id`

---

## 2. Personal Library Tables

All Gurbani references point to upstream identifiers (e.g. `shabad_id`, `line_id`, `page_number`, `source`) without storing or duplicating full Gurbani texts in PostgreSQL.

### `bookmarks`
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `type` (VARCHAR(50), NOT NULL - `ang`, `shabad`, `line`, `bani`, `custom`)
- `source` (VARCHAR(50) - `G`, `D`, `B`)
- `page_number` (INT)
- `shabad_id` (INT)
- `line_id` (INT)
- `title` (VARCHAR(255))
- `note` (TEXT)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_bookmarks_user_id`, `idx_bookmarks_shabad_id`, `idx_bookmarks_page_number`

### `personal_collections`
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `title` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_personal_collections_user_id`

### `collection_items`
- `id` (UUID, PK)
- `collection_id` (UUID, NOT NULL, REFERENCES `personal_collections(id)` ON DELETE CASCADE)
- `shabad_id` (INT)
- `line_id` (INT)
- `source` (VARCHAR(50))
- `position` (INT, NOT NULL, DEFAULT 0)
- `note` (TEXT)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_collection_items_collection_id`

### `personal_notes`
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `shabad_id` (INT)
- `line_id` (INT)
- `source` (VARCHAR(50))
- `content` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_personal_notes_user_id`, `idx_personal_notes_shabad_id`

### `reading_progress`
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `source` (VARCHAR(50), NOT NULL - Default `G`)
- `current_page` (INT, NOT NULL, DEFAULT 1)
- `total_pages` (INT, NOT NULL, DEFAULT 1430)
- `completed_cycles` (INT, NOT NULL, DEFAULT 0)
- `last_read_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Constraints:* UNIQUE(`user_id`, `source`)
- *Indexes:* `idx_reading_progress_user_id`

### `reading_history`
- `id` (UUID, PK)
- `user_id` (UUID, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `source` (VARCHAR(50), NOT NULL)
- `page_number` (INT, NOT NULL)
- `shabad_id` (INT)
- `read_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_reading_history_user_id`, `idx_reading_history_read_at`

### `user_preferences`
- `id` (UUID, PK)
- `user_id` (UUID, UNIQUE, NOT NULL, REFERENCES `users(id)` ON DELETE CASCADE)
- `theme` (VARCHAR(50), DEFAULT 'system')
- `font_size` (VARCHAR(20), DEFAULT 'medium')
- `larivaar` (BOOLEAN, DEFAULT FALSE)
- `english_translation` (BOOLEAN, DEFAULT TRUE)
- `punjabi_teeka` (BOOLEAN, DEFAULT TRUE)
- `spanish_translation` (BOOLEAN, DEFAULT FALSE)
- `custom_settings` (JSONB, DEFAULT '{}'::jsonb)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- *Indexes:* `idx_user_preferences_user_id`
