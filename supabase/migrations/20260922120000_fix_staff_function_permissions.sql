-- The authenticated CRM policies call these SECURITY DEFINER helpers.
-- PostgreSQL still requires EXECUTE on the function itself before evaluating
-- the RLS policy. Anonymous visitors must not call either helper.

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Enforce the same upload constraints at Storage level as in the quote form.
UPDATE storage.buckets
SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'lead-documents';
