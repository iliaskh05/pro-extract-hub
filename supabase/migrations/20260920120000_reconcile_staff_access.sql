-- Reconciles two staff-role schemas that evolved independently on this project:
--   - public.staff_profiles (role 'admin' | 'commercial')   — supabase/migrations/20260823170000
--   - public.user_roles      (role 'admin' | 'staff' | 'user') — drizzle/migrations/0001..0004
--
-- Idempotent and safe to run regardless of which of the two paths (if any) was
-- previously applied to this database: every statement below uses IF NOT EXISTS /
-- IF EXISTS / DO-block guards, and no statement assumes a specific starting state.
--
-- After this migration, both tables exist and either one can hold the staff
-- roster; public.is_staff() / public.is_admin() check both, so the `leads`
-- RLS policies work no matter which table your admin account lives in.
-- src/routes/admin.tsx queries staff_profiles first and falls back to
-- user_roles client-side as an extra safety net on top of this.

-- --- public.staff_profiles (supabase/migrations path) ---------------------

DO $$ BEGIN
  CREATE TYPE public.staff_role AS ENUM ('admin', 'commercial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.staff_role NOT NULL DEFAULT 'commercial',
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.staff_profiles TO authenticated;
GRANT ALL ON public.staff_profiles TO service_role;

DROP POLICY IF EXISTS "Staff can read own profile" ON public.staff_profiles;

-- --- public.user_roles (drizzle/migrations path) ---------------------------

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- --- unified role checks ----------------------------------------------------
-- Re-created (CREATE OR REPLACE) as no-arg, auth.uid()-based functions so both
-- this migration's callers and the older 20260823170000 definitions converge
-- on the same signature. Checks both tables, so it works regardless of which
-- one actually holds rows in this environment.

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (SELECT 1 FROM public.staff_profiles WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (
      SELECT 1 FROM public.staff_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.is_staff() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

CREATE POLICY "Staff can read own profile"
  ON public.staff_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- --- public.leads: single, unambiguous policy set --------------------------
-- Drops every policy name either prior path could have created, then
-- recreates one canonical set on top of the unified functions above.

DROP POLICY IF EXISTS "Authenticated can read leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can read leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can update leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;

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

-- After deploy, grant the first administrator in whichever table your
-- environment actually uses (check first — see PRODUCTION_CHECKLIST.md):
-- insert into public.staff_profiles (user_id, role, display_name)
-- values ('<auth.users.id>', 'admin', 'Direction');
-- -- or --
-- insert into public.user_roles (user_id, role)
-- values ('<auth.users.id>', 'admin');
