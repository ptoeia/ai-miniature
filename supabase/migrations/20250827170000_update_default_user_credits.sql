-- Migration: Update default user credits to 10 on user creation
-- This migration updates the handle_new_user function to give new users 10 credits by default

-- Update the handle_new_user function to give 10 credits to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "fullName", "avatarUrl", credit_balance, free_trial_credits_granted)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name', -- Attempt to get full_name from metadata
    NEW.raw_user_meta_data->>'avatar_url', -- Attempt to get avatar_url from metadata
    10, -- Give new users 10 credits by default
    TRUE -- They haven claimed the free trial yet
  );
  
  -- Record the initial credit grant transaction
  INSERT INTO public.credit_transactions (
    user_id, 
    amount, 
    transaction_type, 
    description, 
    "createdAt"
  ) VALUES (
    NEW.id,
    10, -- 10 credits granted
    'initial_grant',
    'Welcome credits for new user registration',
    NOW()
  );
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a new user profile with 10 initial credits and logs the transaction when a user signs up';
