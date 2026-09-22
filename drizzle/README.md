# drizzle/

`drizzle-kit` here is used only as a **migration-authoring CLI** against
`LOVABLE_DB_MIGRATION_URL` (see `drizzle.config.ts`) — `drizzle/schema.ts` is
intentionally blank and `drizzle-orm` is not used anywhere in `src/` as a
runtime query builder. All actual database access in the app goes through
`@supabase/supabase-js` (`src/integrations/supabase/`).

This folder's migration history (`drizzle/migrations/`) evolved independently
from `supabase/migrations/` and at one point defined a **different** staff-role
schema (`public.user_roles`) than the one documented in
`supabase/migrations/20260823170000_production_readiness.sql`
(`public.staff_profiles`). `supabase/migrations/20260920120000_reconcile_staff_access.sql`
reconciles the two so the app works regardless of which one is live on a given
database — see `PRODUCTION_CHECKLIST.md` for the full explanation and the SQL
to check which schema your production database actually has.

**Before removing this folder or the `drizzle-orm`/`drizzle-kit` dependencies**,
confirm whether Lovable Cloud's own deploy/migration pipeline relies on
`drizzle-kit push`/`migrate` against `LOVABLE_DB_MIGRATION_URL` to sync schema
changes — if it does, deleting this would break that pipeline. This could not
be verified from a local checkout without access to Lovable's platform
internals.
