-- This function is now aligned with the webhook's RPC call.
-- It accepts a specific number of credits and logs the transaction.
-- It assumes a transaction without a product link, which can be improved later.
CREATE OR REPLACE FUNCTION public.add_credits_to_user(
    p_user_id uuid,
    p_credits integer,
    p_product_id uuid DEFAULT NULL, -- Optional: The product ID that granted the credits
    p_charge_id text DEFAULT NULL -- Optional: The Creem charge ID for the transaction
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Add credits to the user's balance in the profiles table
    UPDATE public.profiles
    SET credit_balance = credit_balance + p_credits
    WHERE id = p_user_id;

    -- Record the transaction in the credit_transactions table
    INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description, related_creem_product_id, related_creem_charge_id)
    VALUES (
        p_user_id, 
        p_credits, 
        'purchase', -- Or 'renewal', 'grant', etc.
        'Subscription credit grant', 
        p_product_id, -- Link to the product if provided
        p_charge_id -- Link to the charge if provided
    );
END;
$$;
