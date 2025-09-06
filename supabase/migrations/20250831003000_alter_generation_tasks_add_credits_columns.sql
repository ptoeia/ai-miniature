-- Add credit consumption tracking columns to generation_tasks
ALTER TABLE IF EXISTS public.generation_tasks
  ADD COLUMN IF NOT EXISTS credits_consumed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS credits_cost INTEGER;

-- Helpful index for analytics/cleanup
CREATE INDEX IF NOT EXISTS idx_generation_tasks_credits_consumed_at ON public.generation_tasks(credits_consumed_at);
