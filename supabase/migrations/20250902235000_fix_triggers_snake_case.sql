-- 20250902235000_fix_triggers_snake_case.sql
-- Align triggers and timestamp columns with snake_case after schema normalization

-- 1) Ensure ai_services timestamps use snake_case
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='ai_services' AND column_name='createdAt'
  ) THEN
    ALTER TABLE public.ai_services RENAME COLUMN "createdAt" TO created_at;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='ai_services' AND column_name='updatedAt'
  ) THEN
    ALTER TABLE public.ai_services RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END $$;

-- 2) Recreate the generic updated_at trigger function to set snake_case column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Safely handle tables that still have legacy "updatedAt" (should be none after this migration)
  IF TG_TABLE_NAME IS NOT NULL THEN
    BEGIN
      NEW.updated_at = NOW();
    EXCEPTION WHEN undefined_column THEN
      -- fallback for legacy tables if any remain (no-op if both columns missing)
      BEGIN
        NEW."updatedAt" = NOW();
      EXCEPTION WHEN undefined_column THEN
        -- do nothing
        NULL;
      END;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Recreate triggers to target the correct tables/columns
-- 3a) creem_product
DO $$
BEGIN
  -- Drop old trigger if it existed on the old quoted table name
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'set_creemproduct_updated_at' AND c.relname = 'CreemProduct'
  ) THEN
    EXECUTE 'DROP TRIGGER set_creemproduct_updated_at ON public."CreemProduct"';
  END IF;

  -- Drop if exists on the new table (idempotent)
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'set_creemproduct_updated_at' AND c.relname = 'creem_product'
  ) THEN
    DROP TRIGGER set_creemproduct_updated_at ON public.creem_product;
  END IF;

  -- Create trigger on creem_product only if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='creem_product'
  ) THEN
    CREATE TRIGGER set_creemproduct_updated_at
    BEFORE UPDATE ON public.creem_product
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3b) ai_services
DO $$
BEGIN
  -- Drop existing trigger if present
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'set_ai_services_updated_at' AND c.relname = 'ai_services'
  ) THEN
    DROP TRIGGER set_ai_services_updated_at ON public.ai_services;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ai_services'
  ) THEN
    CREATE TRIGGER set_ai_services_updated_at
    BEFORE UPDATE ON public.ai_services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Notes:
-- - generation_tasks already uses snake_case and has its own trigger; left unchanged.
-- - handle_new_user trigger remains valid and function was updated to snake_case previously.
