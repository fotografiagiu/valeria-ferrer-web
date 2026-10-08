-- Expand web_promotion.active_promotion CHECK to include salidas.
-- Safe to re-run: drops known check then recreates with full enum.

DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'public.web_promotion'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%active_promotion%'
    AND pg_get_constraintdef(oid) NOT ILIKE '%id = 1%';
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.web_promotion DROP CONSTRAINT %I', cname);
  END IF;
END $$;

ALTER TABLE public.web_promotion
  ADD CONSTRAINT web_promotion_active_promotion_check
  CHECK (active_promotion IN ('none', 'copas', 'duples', 'salidas'));
