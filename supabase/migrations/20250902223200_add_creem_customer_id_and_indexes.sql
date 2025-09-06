-- 20250902223200_add_creem_customer_id_and_indexes.sql
-- Add creem_customer_id columns and related indexes to match template

-- subscription.creem_customer_id
ALTER TABLE public.subscription
  ADD COLUMN IF NOT EXISTS creem_customer_id TEXT;

-- one_time_purchases.creem_customer_id
ALTER TABLE public.one_time_purchases
  ADD COLUMN IF NOT EXISTS creem_customer_id TEXT;

-- Optional: migrate from profiles.creem_customer_id if存在
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='creem_customer_id') THEN
    UPDATE public.subscription s
      SET creem_customer_id = p.creem_customer_id
      FROM public.profiles p
      WHERE s.profile_id = p.id AND p.creem_customer_id IS NOT NULL AND s.creem_customer_id IS NULL;

    UPDATE public.one_time_purchases otp
      SET creem_customer_id = p.creem_customer_id
      FROM public.profiles p
      WHERE otp.profile_id = p.id AND p.creem_customer_id IS NOT NULL AND otp.creem_customer_id IS NULL;

    -- drop legacy column to align with template (optional)
    -- ALTER TABLE public.profiles DROP COLUMN IF EXISTS creem_customer_id;
  END IF;
END $$;

-- indexes
CREATE INDEX IF NOT EXISTS idx_subscription_creem_customer_id ON public.subscription (creem_customer_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_creem_customer_id ON public.one_time_purchases (creem_customer_id);
