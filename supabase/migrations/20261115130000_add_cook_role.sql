-- Add COOK role for kitchen-only staff
alter type public.org_role add value if not exists 'COOK';
