-- The CRM dashboard filters/sorts leads by status, priority and created_at
-- (src/components/admin/Dashboard.tsx) with no supporting indexes so far.

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_priority_idx ON public.leads (priority);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
