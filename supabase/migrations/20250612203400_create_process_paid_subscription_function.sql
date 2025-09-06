-- Function to process a paid subscription event within a transaction.
-- It creates the subscription record and grants credits to the user.
CREATE OR REPLACE FUNCTION public.process_paid_subscription(
  p_profile_id uuid,         -- The user's profile ID
  p_subscription_data jsonb, -- The subscription object from the webhook
  p_product_id uuid          -- The internal UUID of the product from our CreemProduct table
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a search path to leverage roles and permissions, ensuring security.
SET search_path = public
AS $$
DECLARE
  v_grants_credits integer;
BEGIN
  -- Step 1: Insert the subscription record, linking it to the user and the product.
  -- This uses the internal product_id UUID we retrieved earlier.
    INSERT INTO public."subscription" (
    id,
    "profileId",
    product_id,
    "creemSubscriptionId",
    status,
    "currentPeriodStart",
    "currentPeriodEnd",
    "cancelAtPeriodEnd",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    (p_subscription_data->>'id')::text,
    p_profile_id,
    p_product_id,
    p_subscription_data->>'id',
    (p_subscription_data->>'status')::text,
    (p_subscription_data->>'current_period_start_date')::timestamp with time zone,
    (p_subscription_data->>'current_period_end_date')::timestamp with time zone,
    (p_subscription_data->>'cancel_at_period_end')::boolean,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    product_id = EXCLUDED.product_id,
    "currentPeriodStart" = EXCLUDED."currentPeriodStart",
    "currentPeriodEnd" = EXCLUDED."currentPeriodEnd",
    "cancelAtPeriodEnd" = EXCLUDED."cancelAtPeriodEnd",
    "updatedAt" = NOW();

  -- Step 2: Grant credits to the user.
  -- First, get the number of credits to grant from the CreemProduct table.
  SELECT grants_credits INTO v_grants_credits
  FROM public."CreemProduct"
  WHERE id = p_product_id;

  -- Only grant credits if the product is configured to do so.
  IF v_grants_credits IS NOT NULL AND v_grants_credits > 0 THEN
    -- Call the existing function to add credits to the user's profile.
    -- This operation is part of the same transaction.
        -- Call the enhanced function to add credits, passing the product and charge IDs for better logging.
    PERFORM public.add_credits_to_user(
        p_profile_id, 
        v_grants_credits, 
        p_product_id, 
        (p_subscription_data->>'last_transaction_id')::text
    );
  END IF;

END;
$$;
