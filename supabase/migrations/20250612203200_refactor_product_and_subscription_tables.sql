-- Comprehensive migration to refactor CreemProduct and related tables for a robust, UUID-based relationship.

-- Part 1: Drop all old foreign key constraints that reference the CreemProduct's text-based ID.
-- This is CRITICAL because we are about to modify the CreemProduct.id column.

-- 1.1: From the "subscription" table
ALTER TABLE public."subscription" DROP CONSTRAINT IF EXISTS fk_creem_product;

-- 1.2: From the "onetimepurchase" table
ALTER TABLE public."onetimepurchase" DROP CONSTRAINT IF EXISTS fk_creem_product;

-- 1.3: From the "credit_transactions" table
ALTER TABLE public.credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_related_creem_product_id_fkey;


-- Part 2: Refactor the "CreemProduct" table to use UUID for its primary key.

-- 2.1: Drop the existing primary key constraint on the "id" column.
ALTER TABLE public."CreemProduct" DROP CONSTRAINT IF EXISTS "CreemProduct_pkey";

-- 2.2: Change the data type of the "id" column from TEXT to UUID.
ALTER TABLE public."CreemProduct" ALTER COLUMN "id" TYPE UUID USING (gen_random_uuid());

-- 2.3: Set a default value for the "id" column to automatically generate a UUID for new rows.
ALTER TABLE public."CreemProduct" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- 2.4: Re-add the primary key constraint on the newly typed "id" column.
ALTER TABLE public."CreemProduct" ADD PRIMARY KEY (id);


-- Part 3: Update the "subscription" table to correctly link to the new Product UUID.

-- 3.1: Add a new 'product_id' column to the "subscription" table.
ALTER TABLE public."subscription" ADD COLUMN IF NOT EXISTS product_id UUID;

-- 3.2: Add a foreign key constraint on the new 'product_id' column.
ALTER TABLE public."subscription"
ADD CONSTRAINT fk_subscription_product
FOREIGN KEY (product_id) REFERENCES public."CreemProduct"(id) ON DELETE CASCADE;

-- 3.3 (Cleanup): Drop the old "creemProductId" column.
ALTER TABLE public."subscription" DROP COLUMN IF EXISTS "creemProductId";


-- Part 4: Update the "onetimepurchase" table.

-- 4.1: Rename table to snake_case convention.
ALTER TABLE IF EXISTS public."onetimepurchase" RENAME TO one_time_purchases;

-- 4.2: Rename columns to snake_case.
ALTER TABLE public.one_time_purchases RENAME COLUMN "profileId" TO profile_id;
ALTER TABLE public.one_time_purchases RENAME COLUMN "creemProductId" TO creem_product_id_old_text;
ALTER TABLE public.one_time_purchases RENAME COLUMN "creemPaymentIntentId" TO creem_payment_intent_id;
ALTER TABLE public.one_time_purchases RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.one_time_purchases RENAME COLUMN "updatedAt" TO updated_at;

-- 4.3: Add the new 'product_id' column with UUID type.
ALTER TABLE public.one_time_purchases ADD COLUMN IF NOT EXISTS product_id UUID;

-- 4.4: Add the new, correct foreign key constraint.
ALTER TABLE public.one_time_purchases
ADD CONSTRAINT fk_one_time_purchases_product
FOREIGN KEY (product_id) REFERENCES public."CreemProduct"(id) ON DELETE SET NULL;

-- 4.5 (Cleanup): Drop the old text-based product ID column.
ALTER TABLE public.one_time_purchases DROP COLUMN IF EXISTS creem_product_id_old_text;


-- Part 5: Update the "credit_transactions" table.

-- 5.1: Add the new 'product_id_new' column which will become the new foreign key.
ALTER TABLE public.credit_transactions ADD COLUMN IF NOT EXISTS product_id_new UUID;

-- 5.2: Add the new, correct foreign key constraint on the new column.
ALTER TABLE public.credit_transactions
ADD CONSTRAINT fk_credit_transactions_product
FOREIGN KEY (product_id_new) REFERENCES public."CreemProduct"(id) ON DELETE SET NULL;

-- 5.3 (Cleanup): Drop the old 'related_creem_product_id' column.
ALTER TABLE public.credit_transactions DROP COLUMN IF EXISTS related_creem_product_id;

-- 5.4: Rename the new column to the original name 'related_creem_product_id' to maintain compatibility.
ALTER TABLE public.credit_transactions RENAME COLUMN product_id_new TO related_creem_product_id;

