-- Food costing (ingredients, sub-recipes, recipe BOMs) + kitchen tickets
-- Requires 20261115100000_init_multi_tenant.sql

-- Org food / tax settings
alter table public.organizations
  add column if not exists currency_symbol text not null default '₱',
  add column if not exists sales_tax_bps integer not null default 0
    check (sales_tax_bps >= 0 and sales_tax_bps <= 10000),
  add column if not exists prices_include_tax boolean not null default true,
  add column if not exists target_food_cost_bps integer not null default 3300
    check (target_food_cost_bps >= 0 and target_food_cost_bps <= 10000),
  add column if not exists dashboard_year integer not null default extract(year from now())::integer;

-- Category kind: menu dishes vs purchased ingredients
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'category_kind' and n.nspname = 'public'
  ) then
    create type public.category_kind as enum ('menu', 'ingredient');
  end if;
end $$;

alter table public.categories
  add column if not exists kind public.category_kind not null default 'menu';

create index if not exists categories_organization_id_kind_idx
  on public.categories (organization_id, kind);

-- Unit conversions (org-scoped; seeded per org on create)
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  code text not null,
  base_kind text not null check (base_kind in ('weight', 'volume', 'count')),
  to_base numeric(18, 6) not null check (to_base > 0),
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

create index if not exists units_organization_id_idx on public.units (organization_id);

-- Ingredients (purchased goods)
create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  category_id uuid references public.categories (id) on delete set null,
  supplier text,
  pack_price_cents integer not null default 0 check (pack_price_cents >= 0),
  pack_size numeric(18, 6) not null default 1 check (pack_size > 0),
  pack_unit text not null default 'pc',
  yield_bps integer not null default 10000
    check (yield_bps > 0 and yield_bps <= 10000),
  previous_pack_price_cents integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists ingredients_organization_id_name_idx
  on public.ingredients (organization_id, name);

create table if not exists public.ingredient_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  ingredient_id uuid not null unique references public.ingredients (id) on delete cascade,
  quantity numeric(18, 6) not null default 0,
  unit text not null default 'pc',
  min_stock numeric(18, 6) not null default 0,
  updated_at timestamptz not null default now()
);

create type public.ingredient_movement_type as enum (
  'IN', 'OUT', 'ADJUST', 'SALE', 'REFUND', 'PREP'
);

create table if not exists public.ingredient_stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id),
  type public.ingredient_movement_type not null,
  quantity numeric(18, 6) not null,
  unit text not null,
  reason text,
  user_id uuid references auth.users (id),
  sale_id uuid references public.sales (id),
  created_at timestamptz not null default now()
);

create index if not exists ingredient_stock_movements_ingredient_id_created_at_idx
  on public.ingredient_stock_movements (ingredient_id, created_at);

-- Sub-recipes (prep BOMs)
create table if not exists public.sub_recipes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  batch_qty numeric(18, 6) not null default 1 check (batch_qty > 0),
  batch_unit text not null default 'portion',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.sub_recipe_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sub_recipe_id uuid not null references public.sub_recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id),
  qty numeric(18, 6) not null check (qty > 0),
  unit text not null,
  sort_order integer not null default 0,
  unique (sub_recipe_id, ingredient_id)
);

create index if not exists sub_recipe_lines_sub_recipe_id_idx
  on public.sub_recipe_lines (sub_recipe_id);

-- Menu item recipe fields
alter table public.products
  add column if not exists portions_per_batch numeric(18, 6) not null default 1
    check (portions_per_batch > 0),
  add column if not exists labor_cents integer not null default 0 check (labor_cents >= 0),
  add column if not exists packaging_cents integer not null default 0 check (packaging_cents >= 0),
  add column if not exists allergens_notes text,
  add column if not exists sends_to_kitchen boolean not null default true;

create table if not exists public.recipe_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  ingredient_id uuid references public.ingredients (id) on delete restrict,
  sub_recipe_id uuid references public.sub_recipes (id) on delete restrict,
  qty numeric(18, 6) not null check (qty > 0),
  unit text not null,
  sort_order integer not null default 0,
  check (
    (ingredient_id is not null and sub_recipe_id is null)
    or (ingredient_id is null and sub_recipe_id is not null)
  )
);

create index if not exists recipe_lines_product_id_idx on public.recipe_lines (product_id);

-- Sale line food cost + notes
alter table public.sale_items
  add column if not exists food_cost_cents integer not null default 0 check (food_cost_cents >= 0),
  add column if not exists line_note text;

-- Kitchen tickets
create type public.kitchen_ticket_status as enum (
  'NEW', 'IN_PROGRESS', 'READY', 'DONE', 'CANCELLED'
);

create table if not exists public.kitchen_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sale_id uuid not null references public.sales (id) on delete cascade,
  ticket_number text not null,
  status public.kitchen_ticket_status not null default 'NEW',
  notes text,
  fired_at timestamptz not null default now(),
  started_at timestamptz,
  ready_at timestamptz,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, ticket_number)
);

create index if not exists kitchen_tickets_organization_id_status_idx
  on public.kitchen_tickets (organization_id, status, fired_at desc);

create table if not exists public.kitchen_ticket_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  ticket_id uuid not null references public.kitchen_tickets (id) on delete cascade,
  sale_item_id uuid references public.sale_items (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  line_note text,
  created_at timestamptz not null default now()
);

create index if not exists kitchen_ticket_items_ticket_id_idx
  on public.kitchen_ticket_items (ticket_id);

-- Updated_at triggers
create trigger ingredients_updated_at before update on public.ingredients
  for each row execute function public.set_updated_at();
create trigger ingredient_stock_updated_at before update on public.ingredient_stock
  for each row execute function public.set_updated_at();
create trigger sub_recipes_updated_at before update on public.sub_recipes
  for each row execute function public.set_updated_at();
create trigger kitchen_tickets_updated_at before update on public.kitchen_tickets
  for each row execute function public.set_updated_at();

-- Seed default units for an org
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
    (org_id, 'oz', 'weight', 28.3495),
    (org_id, 'lb', 'weight', 453.592),
    (org_id, 'ml', 'volume', 1),
    (org_id, 'l', 'volume', 1000),
    (org_id, 'tsp', 'volume', 4.92892),
    (org_id, 'tbsp', 'volume', 14.7868),
    (org_id, 'cup', 'volume', 236.588),
    (org_id, 'fl oz', 'volume', 29.5735),
    (org_id, 'pc', 'count', 1),
    (org_id, 'each', 'count', 1),
    (org_id, 'portion', 'count', 1),
    (org_id, 'slice', 'count', 1),
    (org_id, 'dozen', 'count', 12)
  on conflict (organization_id, code) do nothing;
end;
$$;

create or replace function public.seed_default_categories(org_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.categories (organization_id, name, slug, kind) values
    (org_id, 'Starters', 'starters', 'menu'),
    (org_id, 'Mains', 'mains', 'menu'),
    (org_id, 'Sides', 'sides', 'menu'),
    (org_id, 'Desserts', 'desserts', 'menu'),
    (org_id, 'Drinks', 'drinks', 'menu'),
    (org_id, 'Packaging', 'packaging', 'menu'),
    (org_id, 'Meat & Fish', 'meat-fish', 'ingredient'),
    (org_id, 'Produce', 'produce', 'ingredient'),
    (org_id, 'Dairy & Eggs', 'dairy-eggs', 'ingredient'),
    (org_id, 'Dry Goods', 'dry-goods', 'ingredient'),
    (org_id, 'Oils & Sauces', 'oils-sauces', 'ingredient'),
    (org_id, 'Spices', 'spices', 'ingredient'),
    (org_id, 'Beverages', 'beverages-ing', 'ingredient'),
    (org_id, 'Packaging Supplies', 'packaging-supplies', 'ingredient')
  on conflict (organization_id, slug) do nothing;
end;
$$;

-- Extend org create trigger to seed units + categories
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, auth.uid(), 'OWNER');

  perform public.seed_default_units(new.id);
  perform public.seed_default_categories(new.id);

  return new;
end;
$$;

-- RLS
alter table public.units enable row level security;
alter table public.ingredients enable row level security;
alter table public.ingredient_stock enable row level security;
alter table public.ingredient_stock_movements enable row level security;
alter table public.sub_recipes enable row level security;
alter table public.sub_recipe_lines enable row level security;
alter table public.recipe_lines enable row level security;
alter table public.kitchen_tickets enable row level security;
alter table public.kitchen_ticket_items enable row level security;

grant all on all tables in schema public to authenticated;
grant execute on function public.seed_default_units(uuid) to authenticated;
grant execute on function public.seed_default_categories(uuid) to authenticated;

create policy "units_select_member"
  on public.units for select to authenticated
  using (public.is_org_member(organization_id));
create policy "units_write_owner"
  on public.units for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "ingredients_select_member"
  on public.ingredients for select to authenticated
  using (public.is_org_member(organization_id));
create policy "ingredients_write_owner"
  on public.ingredients for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "ingredient_stock_select_member"
  on public.ingredient_stock for select to authenticated
  using (public.is_org_member(organization_id));
create policy "ingredient_stock_write_member"
  on public.ingredient_stock for all to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "ingredient_movements_select_member"
  on public.ingredient_stock_movements for select to authenticated
  using (public.is_org_member(organization_id));
create policy "ingredient_movements_insert_member"
  on public.ingredient_stock_movements for insert to authenticated
  with check (public.is_org_member(organization_id));

create policy "sub_recipes_select_member"
  on public.sub_recipes for select to authenticated
  using (public.is_org_member(organization_id));
create policy "sub_recipes_write_owner"
  on public.sub_recipes for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "sub_recipe_lines_select_member"
  on public.sub_recipe_lines for select to authenticated
  using (public.is_org_member(organization_id));
create policy "sub_recipe_lines_write_owner"
  on public.sub_recipe_lines for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "recipe_lines_select_member"
  on public.recipe_lines for select to authenticated
  using (public.is_org_member(organization_id));
create policy "recipe_lines_write_owner"
  on public.recipe_lines for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "kitchen_tickets_select_member"
  on public.kitchen_tickets for select to authenticated
  using (public.is_org_member(organization_id));
create policy "kitchen_tickets_insert_member"
  on public.kitchen_tickets for insert to authenticated
  with check (public.is_org_member(organization_id));
create policy "kitchen_tickets_update_member"
  on public.kitchen_tickets for update to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "kitchen_ticket_items_select_member"
  on public.kitchen_ticket_items for select to authenticated
  using (public.is_org_member(organization_id));
create policy "kitchen_ticket_items_insert_member"
  on public.kitchen_ticket_items for insert to authenticated
  with check (public.is_org_member(organization_id));

-- Realtime for kitchen board (ignore if already added)
do $$
begin
  begin
    alter publication supabase_realtime add table public.kitchen_tickets;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.kitchen_ticket_items;
  exception when duplicate_object then null;
  end;
end $$;

-- Backfill units/categories for orgs created before this migration
do $$
declare
  org record;
begin
  for org in select id from public.organizations loop
    perform public.seed_default_units(org.id);
    perform public.seed_default_categories(org.id);
  end loop;
end $$;
