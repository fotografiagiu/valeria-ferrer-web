-- Additive upgrade: existing primary campaign remains untouched.
-- Second campaign has its own identity, expiry and duration.
ALTER TABLE public.web_promotion
  ADD COLUMN IF NOT EXISTS secondary_promotion JSONB;

-- Optimistic revision protects against two staff sessions overwriting each other.
ALTER TABLE public.web_promotion
  ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1;

-- Only well-shaped campaign documents are valid. Null means no second slot.
-- The backend enforces max two live and disallows duplicate active types.
DO $migration$
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint
   WHERE conrelid='public.web_promotion'::regclass
     AND conname='web_promotion_secondary_shape_check'
 ) THEN
  ALTER TABLE public.web_promotion ADD CONSTRAINT web_promotion_secondary_shape_check CHECK (
    secondary_promotion IS NULL
    OR (
      jsonb_typeof(secondary_promotion)='object'
      AND secondary_promotion->>'activePromotion' IN ('copas','duples','salidas','cash5')
      AND jsonb_typeof(secondary_promotion->'startsAt')='string'
      AND jsonb_typeof(secondary_promotion->'endsAt')='string'
      AND jsonb_typeof(secondary_promotion->'durationHours')='number'
      AND jsonb_typeof(secondary_promotion->'promoId')='string'
    )
  );
 END IF;
END $migration$;
