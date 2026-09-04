INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email IN ('iliaskharbouch17@gmail.com', 'sabrikharbouch@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;