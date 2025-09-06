-- SQL script to populate CreemProduct table with one-time payment products for production
-- This creates 3 one-time payment products including 1 free trial

-- 1. Free Trial Product (one-time)
INSERT INTO public."CreemProduct" (
    "id", "name", "description", "price", "currency", "creemId", "active",
    "plan_tier", "billing_period", "grants_credits", "display_credits_per_month",
    "interval", "interval_count", "is_popular", "features", "button_text",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(), 'Free Trial', 'Get started with Flash Image AI and explore basic features.', 0.00, 'USD', 'flash_free_trial_v1', TRUE,
    'free_trial', 'one_time', 50, 0,
    NULL, NULL, FALSE, '["50 free credits", "Basic AI image generation", "Standard processing speed"]', 'Start Free Trial',
    NOW(), NOW()
)
ON CONFLICT ("creemId") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "price" = EXCLUDED."price",
    "currency" = EXCLUDED."currency",
    "active" = EXCLUDED."active",
    "plan_tier" = EXCLUDED."plan_tier",
    "billing_period" = EXCLUDED."billing_period",
    "grants_credits" = EXCLUDED."grants_credits",
    "display_credits_per_month" = EXCLUDED."display_credits_per_month",
    "interval" = EXCLUDED."interval",
    "interval_count" = EXCLUDED."interval_count",
    "is_popular" = EXCLUDED."is_popular",
    "features" = EXCLUDED."features",
    "button_text" = EXCLUDED."button_text",
    "updatedAt" = NOW();

-- 2. Starter Pack (one-time purchase)
-- Replace with your actual Creem Product ID for production
INSERT INTO public."CreemProduct" (
    "id", "name", "description", "price", "currency", "creemId", "active",
    "plan_tier", "billing_period", "grants_credits", "display_credits_per_month",
    "interval", "interval_count", "is_popular", "features", "button_text",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(), 'Basic Pack', 'Perfect for trying out Flash Image AI with more credits.', 4.49, 'USD', 'prod_7HVVxSV85ZZbeJTaL8TloJ', TRUE,
    'basic', 'one_time', 150, 0,
    NULL, NULL, FALSE, '["150 credits included", "Never expires", "All features unlocked", "Email support"]', 'Buy Basic Pack',
    NOW(), NOW()
)
ON CONFLICT ("creemId") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "price" = EXCLUDED."price",
    "currency" = EXCLUDED."currency",
    "active" = EXCLUDED."active",
    "plan_tier" = EXCLUDED."plan_tier",
    "billing_period" = EXCLUDED."billing_period",
    "grants_credits" = EXCLUDED."grants_credits",
    "display_credits_per_month" = EXCLUDED."display_credits_per_month",
    "interval" = EXCLUDED."interval",
    "interval_count" = EXCLUDED."interval_count",
    "is_popular" = EXCLUDED."is_popular",
    "features" = EXCLUDED."features",
    "button_text" = EXCLUDED."button_text",
    "updatedAt" = NOW();

-- 3. Pro Pack (one-time purchase)
-- Replace with your actual Creem Product ID for production
INSERT INTO public."CreemProduct" (
    "id", "name", "description", "price", "currency", "creemId", "active",
    "plan_tier", "billing_period", "grants_credits", "display_credits_per_month",
    "interval", "interval_count", "is_popular", "features", "button_text",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(), 'Pro Pack', 'Most popular choice for serious creators and professionals.', 9.99, 'USD', 'prod_1jjsbR7J75qHSAho4FqN4G', TRUE,
    'pro', 'one_time', 400, 0,
    NULL, NULL, TRUE, '["400 credits", "Never expires", "All features unlocked", "Priority support included"]', 'Buy Pro Pack',
    NOW(), NOW()
)
ON CONFLICT ("creemId") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "price" = EXCLUDED."price",
    "currency" = EXCLUDED."currency",
    "active" = EXCLUDED."active",
    "plan_tier" = EXCLUDED."plan_tier",
    "billing_period" = EXCLUDED."billing_period",
    "grants_credits" = EXCLUDED."grants_credits",
    "display_credits_per_month" = EXCLUDED."display_credits_per_month",
    "interval" = EXCLUDED."interval",
    "interval_count" = EXCLUDED."interval_count",
    "is_popular" = EXCLUDED."is_popular",
    "features" = EXCLUDED."features",
    "button_text" = EXCLUDED."button_text",
    "updatedAt" = NOW();

-- Verify the inserted data (uncomment to use)
-- SELECT "name", "price", "billing_period", "grants_credits", "creemId" FROM public."CreemProduct" WHERE "billing_period" = 'one_time' ORDER BY "price" ASC;
