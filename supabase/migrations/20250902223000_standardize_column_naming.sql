-- 20250902223000_standardize_column_naming.sql
-- Standardize table and column names to snake_case to match template

-- 1) Rename CreemProduct table to creem_product and its columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='CreemProduct'
  ) THEN
    ALTER TABLE public."CreemProduct" RENAME TO creem_product;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='creem_product' AND column_name='createdAt') THEN
    ALTER TABLE public.creem_product RENAME COLUMN "createdAt" TO created_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='creem_product' AND column_name='updatedAt') THEN
    ALTER TABLE public.creem_product RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='creem_product' AND column_name='creemId') THEN
    ALTER TABLE public.creem_product RENAME COLUMN "creemId" TO creem_id;
  END IF;
END $$;

-- 2) Profiles columns to snake_case
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='createdAt') THEN
    ALTER TABLE public.profiles RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updatedAt') THEN
    ALTER TABLE public.profiles RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='fullName') THEN
    ALTER TABLE public.profiles RENAME COLUMN "fullName" TO full_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatarUrl') THEN
    ALTER TABLE public.profiles RENAME COLUMN "avatarUrl" TO avatar_url;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='creditBalance') THEN
    ALTER TABLE public.profiles RENAME COLUMN "creditBalance" TO credit_balance;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='freeTrialCreditsGranted') THEN
    ALTER TABLE public.profiles RENAME COLUMN "freeTrialCreditsGranted" TO free_trial_credits_granted;
  END IF;
END $$;

-- 3) Subscription columns to snake_case
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='profileId') THEN
    ALTER TABLE public.subscription RENAME COLUMN "profileId" TO profile_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='creemSubscriptionId') THEN
    ALTER TABLE public.subscription RENAME COLUMN "creemSubscriptionId" TO creem_subscription_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='currentPeriodStart') THEN
    ALTER TABLE public.subscription RENAME COLUMN "currentPeriodStart" TO current_period_start;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='currentPeriodEnd') THEN
    ALTER TABLE public.subscription RENAME COLUMN "currentPeriodEnd" TO current_period_end;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='cancelAtPeriodEnd') THEN
    ALTER TABLE public.subscription RENAME COLUMN "cancelAtPeriodEnd" TO cancel_at_period_end;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='createdAt') THEN
    ALTER TABLE public.subscription RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription' AND column_name='updatedAt') THEN
    ALTER TABLE public.subscription RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END $$;

-- 4) One-time purchases to snake_case (table already snake_case from prior migration)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='one_time_purchases' AND column_name='profileId') THEN
    ALTER TABLE public.one_time_purchases RENAME COLUMN "profileId" TO profile_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='one_time_purchases' AND column_name='creemPaymentIntentId') THEN
    ALTER TABLE public.one_time_purchases RENAME COLUMN "creemPaymentIntentId" TO creem_payment_intent_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='one_time_purchases' AND column_name='createdAt') THEN
    ALTER TABLE public.one_time_purchases RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='one_time_purchases' AND column_name='updatedAt') THEN
    ALTER TABLE public.one_time_purchases RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END $$;
