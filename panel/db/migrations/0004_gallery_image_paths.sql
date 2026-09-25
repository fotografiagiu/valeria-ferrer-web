-- Additive: staff-ordered gallery paths (excluding cover). NULL = catalog default order.
-- Safe to re-run.
ALTER TABLE model_overrides
  ADD COLUMN IF NOT EXISTS gallery_image_paths jsonb;
