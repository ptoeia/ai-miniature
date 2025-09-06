-- Migration: Add credit consumption function
-- This migration adds a simple function to consume credits and record transactions

-- Add metadata and description columns to credit_transactions if they don't exist
ALTER TABLE credit_transactions 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created 
ON credit_transactions(user_id, created_at DESC);

-- Create a simple function to consume credits
-- Assumes all validation (user exists, sufficient credits) is done at API level
CREATE OR REPLACE FUNCTION consume_credits(
  user_id UUID,
  credits_to_consume INTEGER,
  transaction_description TEXT DEFAULT 'Credit consumption',
  transaction_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deduct credits from user's balance
  UPDATE profiles 
  SET credit_balance = credit_balance - credits_to_consume,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Record the transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    metadata,
    created_at
  ) VALUES (
    user_id,
    -credits_to_consume, -- Negative amount for consumption
    'consumption',
    transaction_description,
    transaction_metadata,
    NOW()
  );
END;
$$;

-- Grant permission to authenticated users
GRANT EXECUTE ON FUNCTION consume_credits TO authenticated; 