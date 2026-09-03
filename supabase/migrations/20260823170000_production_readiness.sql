-- Production readiness: staff roles, tighter RLS, lead attribution, private storage.
-- Does not drop existing lead rows.

CREATE TYPE public.staff_role AS ENUM ('admin', 'commercial');

CREATE TABLE public.staff_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.staff_role NOT NULL DEFAULT 'commercial',
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

GRANT SELECT ON public.staff_profiles TO authenticated;
GRANT ALL ON public.staff_profiles TO service_role;

CREATE POLICY "Staff can read own profile"
  ON public.staff_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS preferred_contact text,
  ADD COLUMN IF NOT EXISTS assigned_user uuid REFERENCES auth.users (id),
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

DROP POLICY IF EXISTS "Authenticated can read leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated can delete leads" ON public.leads;

CREATE POLICY "Staff can read leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (public.is_admin());

-- Public visitors can still submit a quote. They cannot read or mutate leads.
-- INSERT policy "Anyone can submit a lead" is kept from the previous migration.

INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-documents', 'lead-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Staff can read lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role manages lead documents" ON storage.objects;

CREATE POLICY "Staff can read lead documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lead-documents' AND public.is_staff());

-- Uploads go through signed URLs created server-side (service role).
-- No public or anonymous read/write on this bucket.

-- After deploy, grant the first administrator:
-- insert into public.staff_profiles (user_id, role, display_name)
-- values ('<auth.users.id>', 'admin', 'Direction');
