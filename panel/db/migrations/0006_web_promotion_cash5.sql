-- Idempotent addition: cash5 remote promotion, without changing existing records.
DO $$
DECLARE cname text;
BEGIN
 FOR cname IN
   SELECT conname FROM pg_constraint
   WHERE conrelid = 'public.web_promotion'::regclass AND contype = 'c'
     AND pg_get_constraintdef(oid) ILIKE '%active_promotion%'
     AND pg_get_constraintdef(oid) NOT ILIKE '%id = 1%'
 LOOP
   EXECUTE format('ALTER TABLE public.web_promotion DROP CONSTRAINT %I', cname);
 END LOOP;
 ALTER TABLE public.web_promotion
   ADD CONSTRAINT web_promotion_active_promotion_check
   CHECK (active_promotion IN ('none','copas','duples','salidas','cash5'));
END $$;
