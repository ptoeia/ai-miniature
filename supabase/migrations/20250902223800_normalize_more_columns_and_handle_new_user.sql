-- 20250902223800_normalize_more_columns_and_handle_new_user.sql
-- Normalize remaining columns to snake_case and update handle_new_user trigger function

-- subscription: canceledAt, endedAt -> canceled_at, ended_at
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscription' AND column_name='canceledAt') THEN
    ALTER TABLE public.subscription RENAME COLUMN "canceledAt" TO canceled_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscription' AND column_name='endedAt') THEN
    ALTER TABLE public.subscription RENAME COLUMN "endedAt" TO ended_at;
  END IF;
END $$;

-- credit_transactions: createdAt -> created_at
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='createdAt') THEN
    ALTER TABLE public.credit_transactions RENAME COLUMN "createdAt" TO created_at;
  END IF;
END $$;

-- Update handle_new_user function to snake_case columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credit_balance, free_trial_credits_granted, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    10,
    TRUE,
    NOW(),
    NOW()
  );

  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    created_at
  ) VALUES (
    NEW.id,
    10,
    'initial_grant',
    'Welcome credits for new user registration',
    NOW()
  );

  RETURN NEW;
END;
$$;
