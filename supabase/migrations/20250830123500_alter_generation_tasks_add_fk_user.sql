-- Add foreign key from generation_tasks.user_id -> public.profiles(id)
-- Use ON DELETE SET NULL to preserve task records if a profile is removed
-- Use ON UPDATE CASCADE to follow profile id changes (rare but safe)

ALTER TABLE IF EXISTS public.generation_tasks
  ADD CONSTRAINT fk_generation_tasks_user
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Ensure index exists (already added in creation migration, but keep idempotency)
CREATE INDEX IF NOT EXISTS idx_generation_tasks_user ON public.generation_tasks(user_id);
