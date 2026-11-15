-- Trim recommended starter categories for new organizations.
-- Existing orgs keep their current rows; only new seeds change.

create or replace function public.seed_default_categories(org_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.categories (organization_id, name, slug, kind) values
    (org_id, 'Mains', 'mains', 'menu'),
    (org_id, 'Drinks', 'drinks', 'menu'),
    (org_id, 'Produce', 'produce', 'ingredient'),
    (org_id, 'Dry Goods', 'dry-goods', 'ingredient'),
    (org_id, 'Packaging Supplies', 'packaging-supplies', 'ingredient')
  on conflict (organization_id, slug) do nothing;
end;
$$;
