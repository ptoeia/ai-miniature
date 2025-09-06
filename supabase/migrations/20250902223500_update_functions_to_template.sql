-- 20250902223500_update_functions_to_template.sql
-- Update functions to match template structure (snake_case + creem_customer_id)

-- process_paid_subscription: use snake_case fields and creem_product table, persist creem_customer_id
CREATE OR REPLACE FUNCTION public.process_paid_subscription(
  p_profile_id uuid,
  p_subscription_data jsonb,
  p_product_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_grants_credits integer;
BEGIN
  INSERT INTO public."subscription" (
    id,
    profile_id,
    product_id,
    creem_subscription_id,
    creem_customer_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    created_at,
    updated_at
  )
  VALUES (
    p_subscription_data->>'id',
    p_profile_id,
    p_product_id,
    p_subscription_data->>'id',
    COALESCE(p_subscription_data->>'customer_id', (p_subscription_data->'customer'->>'id')),
    (p_subscription_data->>'status')::text,
    (p_subscription_data->>'current_period_start_date')::timestamp with time zone,
    (p_subscription_data->>'current_period_end_date')::timestamp with time zone,
    COALESCE((p_subscription_data->>'cancel_at_period_end')::boolean, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    product_id = EXCLUDED.product_id,
    creem_customer_id = EXCLUDED.creem_customer_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end,
    updated_at = NOW();

  -- grant credits based on creem_product.grants_credits
  SELECT grants_credits INTO v_grants_credits
  FROM public."creem_product"
  WHERE id = p_product_id;

  IF v_grants_credits IS NOT NULL AND v_grants_credits > 0 THEN
    PERFORM public.add_credits_to_user(
      p_profile_id,
      v_grants_credits,
      p_product_id,
      (p_subscription_data->>'last_transaction_id')::text
    );
  END IF;
END;
$$;
