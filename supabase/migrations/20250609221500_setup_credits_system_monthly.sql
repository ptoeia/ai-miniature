-- supabase/migrations/20250609221500_setup_credits_system_monthly.sql

-- Add credit_balance and free_trial_credits_granted to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS credit_balance INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS free_trial_credits_granted BOOLEAN NOT NULL DEFAULT FALSE;

-- Add new columns to CreemProduct table for credit system features
-- Assuming CreemProduct table already exists with id (TEXT PK) and creemId (TEXT UNIQUE NOT NULL)
ALTER TABLE public."CreemProduct"
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3),
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS plan_tier TEXT, -- e.g., 'free_trial', 'starter', 'standard', 'premium'
ADD COLUMN IF NOT EXISTS billing_period TEXT, -- e.g., 'monthly', 'annually'
ADD COLUMN IF NOT EXISTS grants_credits INTEGER, -- How many credits this product grants upon purchase/renewal
ADD COLUMN IF NOT EXISTS display_credits_per_month INTEGER, -- For display purposes on pricing page
ADD COLUMN IF NOT EXISTS interval TEXT, -- Stripe-like interval: 'day', 'week', 'month', 'year'
ADD COLUMN IF NOT EXISTS interval_count INTEGER, -- Stripe-like interval_count
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS features JSONB, -- List of features for this plan
ADD COLUMN IF NOT EXISTS button_text TEXT, -- e.g., 'Get Started', 'Choose Plan'
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW();

-- Ensure creemId is NOT NULL and UNIQUE if not already set (idempotent check)
-- This might already be handled by the initial table creation, but good to be explicit.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage ccu
        JOIN information_schema.table_constraints tc ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_schema = 'public' AND tc.table_name = 'CreemProduct' AND ccu.column_name = 'creemId' AND tc.constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE public."CreemProduct" ADD CONSTRAINT creemproduct_creemid_unique UNIQUE ("creemId");
    END IF;

    ALTER TABLE public."CreemProduct" ALTER COLUMN "creemId" SET NOT NULL;
EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Constraint creemproduct_creemid_unique already exists or column creemId is already NOT NULL.';
    WHEN others THEN RAISE;
END;
$$;

-- Create ai_services table
CREATE TABLE IF NOT EXISTS public.ai_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'GPT-4 Turbo API Call', 'Image Generation Small'
    description TEXT,
    credit_cost INTEGER NOT NULL, -- How many credits this service costs per unit of use
    unit_name TEXT, -- e.g., 'per call', 'per image', 'per 1k tokens'
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- e.g., 'purchase', 'renewal', 'free_trial', 'usage', 'refund', 'manual_grant'
    amount INTEGER NOT NULL, -- Positive for grants/refunds, negative for usage
    description TEXT, -- e.g., 'Purchased Starter Monthly Plan', 'Used Image Generation service'
    related_creem_product_id TEXT REFERENCES public."CreemProduct"(id) ON DELETE SET NULL, -- Link to product if it's a purchase/renewal
    related_ai_service_id UUID REFERENCES public.ai_services(id) ON DELETE SET NULL, -- Link to service if it's a usage
    related_creem_charge_id TEXT, -- Optional: Creem charge ID for purchase/renewal transactions
    metadata JSONB, -- Any other relevant data
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_services_active ON public.ai_services(active);
CREATE INDEX IF NOT EXISTS idx_creemproduct_active ON public."CreemProduct"(active);
CREATE INDEX IF NOT EXISTS idx_creemproduct_plan_tier ON public."CreemProduct"(plan_tier);

-- Function to update 'updatedAt' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for CreemProduct updatedAt
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_creemproduct_updated_at'
    ) THEN
        CREATE TRIGGER set_creemproduct_updated_at
        BEFORE UPDATE ON public."CreemProduct"
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

-- Trigger for ai_services updatedAt
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_ai_services_updated_at'
    ) THEN
        CREATE TRIGGER set_ai_services_updated_at
        BEFORE UPDATE ON public.ai_services
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

COMMENT ON COLUMN public.profiles.credit_balance IS 'Current available credits for the user.';
COMMENT ON COLUMN public.profiles.free_trial_credits_granted IS 'Flag to indicate if user has already received free trial credits.';
COMMENT ON TABLE public.ai_services IS 'Defines AI services available for purchase with credits.';
COMMENT ON COLUMN public.ai_services.credit_cost IS 'Number of credits required to use this service once.';
COMMENT ON TABLE public.credit_transactions IS 'Logs all credit grants, consumptions, and adjustments for users.';
COMMENT ON COLUMN public.credit_transactions.amount IS 'Amount of credits transacted; positive for additions, negative for deductions.';
