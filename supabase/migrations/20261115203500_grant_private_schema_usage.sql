-- RLS helpers live in schema private; authenticated needs USAGE to call them
-- via public.is_org_member / is_org_owner (security invoker wrappers).
grant usage on schema private to authenticated;
