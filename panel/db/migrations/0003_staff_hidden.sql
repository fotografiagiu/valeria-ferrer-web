-- Additive: staff can hide a ficha from panel + public web without deleting the row.
-- Safe to re-run.
ALTER TABLE model_overrides
  ADD COLUMN IF NOT EXISTS staff_hidden boolean NOT NULL DEFAULT false;
