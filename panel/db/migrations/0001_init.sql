-- ValeriaFerrer panel — initial schema (Neon / Postgres)
-- Apply only after Neon is created and DATABASE_URL is set.
-- gen_random_uuid() is available in modern Postgres without pgcrypto.
--
-- Active models: display_order = 1..N (unique among non-null).
-- Inactive/historical overrides: display_order IS NULL (hidden from staff + public).

CREATE TABLE IF NOT EXISTS staff_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  display_name    TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id   UUID NOT NULL REFERENCES staff_users(id),
  token_hash      TEXT NOT NULL UNIQUE,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip              TEXT,
  user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS staff_sessions_user_idx ON staff_sessions(staff_user_id);
CREATE INDEX IF NOT EXISTS staff_sessions_expires_idx ON staff_sessions(expires_at);

CREATE TABLE IF NOT EXISTS catalog_meta (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  order_version   INTEGER NOT NULL DEFAULT 1,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO catalog_meta (id, order_version)
VALUES (1, 1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS model_overrides (
  slug              TEXT PRIMARY KEY,
  display_order     INTEGER, -- NULL = inactive / not in editable catalog
  cover_image_path  TEXT NOT NULL,
  cover_version     INTEGER NOT NULL DEFAULT 1,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        UUID REFERENCES staff_users(id)
);

-- Only one active model per position; multiple NULLs allowed for inactives
CREATE UNIQUE INDEX IF NOT EXISTS model_overrides_order_uidx
  ON model_overrides(display_order)
  WHERE display_order IS NOT NULL;

CREATE TABLE IF NOT EXISTS audit_log (
  id              BIGSERIAL PRIMARY KEY,
  staff_user_id   UUID REFERENCES staff_users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  action          TEXT NOT NULL,
  model_slug      TEXT,
  before          JSONB,
  after           JSONB,
  ip              TEXT,
  user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_slug_idx ON audit_log(model_slug);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket_key      TEXT PRIMARY KEY,
  hit_count       INTEGER NOT NULL DEFAULT 0,
  window_start    TIMESTAMPTZ NOT NULL DEFAULT now()
);
