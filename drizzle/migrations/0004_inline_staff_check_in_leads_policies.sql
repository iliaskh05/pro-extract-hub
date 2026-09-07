DROP POLICY IF EXISTS "Staff can read leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can update leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can delete leads" ON public.leads;

CREATE POLICY "Staff can read leads" ON public.leads
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')
));

CREATE POLICY "Staff can update leads" ON public.leads
FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')
));

CREATE POLICY "Staff can delete leads" ON public.leads
FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','staff')
));