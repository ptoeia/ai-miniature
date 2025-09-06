-- 20250903005000_fix_one_time_purchases_id_default.sql
-- Ensure one_time_purchases.id auto-generates, fixing NOT NULL violations on insert

BEGIN;

-- gen_random_uuid() is provided by pgcrypto in Postgres 13+ (enabled by default on Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- If id column is TEXT (legacy), set a default using gen_random_uuid()::text to avoid type migration risk
ALTER TABLE public.one_time_purchases
  ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- Backfill any existing rows missing id (safety in case of partial data)
UPDATE public.one_time_purchases
SET id = gen_random_uuid()::text
WHERE id IS NULL;

COMMIT;
