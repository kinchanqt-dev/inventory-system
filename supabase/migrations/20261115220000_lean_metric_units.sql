-- Lean metric-first unit seed for Philippine food ops.
-- Keep conversion of legacy codes (oz, lb, etc.) in app code for existing rows.

create or replace function public.seed_default_units(org_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.units (organization_id, code, base_kind, to_base) values
    (org_id, 'g', 'weight', 1),
    (org_id, 'kg', 'weight', 1000),
    (org_id, 'ml', 'volume', 1),
    (org_id, 'l', 'volume', 1000),
    (org_id, 'tsp', 'volume', 4.92892),
    (org_id, 'tbsp', 'volume', 14.7868),
    (org_id, 'cup', 'volume', 236.588),
    (org_id, 'pc', 'count', 1),
    (org_id, 'dozen', 'count', 12),
    (org_id, 'portion', 'count', 1)
  on conflict (organization_id, code) do nothing;
end;
$$;

-- Ensure existing orgs have the lean catalog (do not delete legacy codes in use).
do $$
declare
  org record;
begin
  for org in select id from public.organizations loop
    perform public.seed_default_units(org.id);
  end loop;
end;
$$;
