-- Generic table for AI generation tasks across providers
CREATE TABLE IF NOT EXISTS public.generation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,                     -- e.g. 'kie'
  provider_task_id TEXT NOT NULL,             -- vendor task id
  user_id UUID,                               -- optional: owner if available
  state TEXT,                                 -- queued/processing/succeeded/failed/timeout/canceled
  result_json JSONB,                          -- raw or normalized vendor result
  error_code TEXT,
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_task_id)
);

CREATE INDEX IF NOT EXISTS idx_generation_tasks_provider_task ON public.generation_tasks(provider, provider_task_id);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_user ON public.generation_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_state ON public.generation_tasks(state);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_created_at ON public.generation_tasks(created_at);

-- Trigger to auto update updated_at
CREATE OR REPLACE FUNCTION public.set_timestamp_generation_tasks()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_generation_tasks ON public.generation_tasks;
CREATE TRIGGER set_timestamp_generation_tasks
BEFORE UPDATE ON public.generation_tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp_generation_tasks();
