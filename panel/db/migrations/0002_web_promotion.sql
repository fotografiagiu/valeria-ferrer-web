-- Web promotion control (singleton). Additive — never DROP.
-- active_promotion: none | copas | duples
-- Effective live state is computed: type != none AND now < ends_at

CREATE TABLE IF NOT EXISTS web_promotion (
  id                  SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  active_promotion    TEXT NOT NULL DEFAULT 'none'
                        CHECK (active_promotion IN ('none', 'copas', 'duples')),
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  duration_hours      INTEGER,
  promo_id            TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by          UUID REFERENCES staff_users(id)
);

INSERT INTO web_promotion (id, active_promotion)
VALUES (1, 'none')
ON CONFLICT (id) DO NOTHING;
