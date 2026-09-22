/**
 * Staff-role resolution shared by both schemas that have existed on this
 * project (see supabase/migrations/20260920120000_reconcile_staff_access.sql):
 *   - public.staff_profiles: role 'admin' | 'commercial'
 *   - public.user_roles (legacy): role 'admin' | 'staff' | 'user'
 */

export function isStaffFromProfile(row: { role?: string | null } | null | undefined): boolean {
  return row?.role === "admin" || row?.role === "commercial";
}

export function isStaffFromLegacyRoles(
  rows: Array<{ role?: string | null }> | null | undefined,
): boolean {
  return (rows ?? []).some((r) => r.role === "admin" || r.role === "staff");
}
