-- supabase/migrations/20250607010832_final_schema.sql

-- 1. Create CreemProduct table
CREATE TABLE IF NOT EXISTS "CreemProduct" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" NUMERIC NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "grants_credits" INTEGER,
    "creemId" TEXT UNIQUE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Profile table (profiles) - FINAL VERSION
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" UUID PRIMARY KEY, -- This should match auth.users.id
    "email" TEXT UNIQUE,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "creem_customer_id" TEXT UNIQUE, -- Stores Creem's customer ID, can be null initially
    "country" TEXT,                  -- Optional: country from old Customer table
    "creem_object_type" TEXT,        -- Optional: object type from old Customer table (e.g., "customer")
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_auth_users FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE -- Added foreign key
);

-- 3. Create Subscription table (subscription)
CREATE TABLE IF NOT EXISTS "subscription" (
    "id" TEXT PRIMARY KEY,
    "profileId" UUID NOT NULL,
    "creemProductId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creemSubscriptionId" TEXT UNIQUE NOT NULL,
    "currentPeriodStart" TIMESTAMPTZ NOT NULL,
    "currentPeriodEnd" TIMESTAMPTZ NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT FALSE,
    "canceledAt" TIMESTAMPTZ,
    "endedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_profile FOREIGN KEY("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE,
    CONSTRAINT fk_creem_product FOREIGN KEY("creemProductId") REFERENCES "CreemProduct"("id")
);

-- 4. Create OneTimePurchase table (onetimepurchase)
CREATE TABLE IF NOT EXISTS "onetimepurchase" (
    "id" TEXT PRIMARY KEY,
    "profileId" UUID NOT NULL,
    "creemProductId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creemPaymentIntentId" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_profile FOREIGN KEY("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE,
    CONSTRAINT fk_creem_product FOREIGN KEY("creemProductId") REFERENCES "CreemProduct"("id")
);

-- Create indexes for foreign keys for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_profileId ON "subscription"("profileId");
CREATE INDEX IF NOT EXISTS idx_subscription_creemProductId ON "subscription"("creemProductId");
CREATE INDEX IF NOT EXISTS idx_onetimepurchase_profileId ON "onetimepurchase"("profileId");
CREATE INDEX IF NOT EXISTS idx_onetimepurchase_creemProductId ON "onetimepurchase"("creemProductId");
CREATE INDEX IF NOT EXISTS idx_profiles_creem_customer_id ON "profiles"("creem_customer_id"); -- Index for the new unique field

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "fullName", "avatarUrl")
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name', -- Attempt to get full_name from metadata
    NEW.raw_user_meta_data->>'avatar_url' -- Attempt to get avatar_url from metadata
  );
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; -- Drop if exists to avoid errors on re-run
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
