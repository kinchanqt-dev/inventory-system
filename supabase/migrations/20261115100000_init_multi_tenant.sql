-- Multi-tenant food inventory + POS (Supabase Auth + RLS + Storage)

create extension if not exists "pgcrypto";

create type public.org_role as enum ('OWNER', 'CASHIER', 'COOK');
create type public.stock_movement_type as enum ('IN', 'OUT', 'ADJUST', 'SALE', 'REFUND');
create type public.payment_method as enum ('CASH', 'QRPH', 'GCASH', 'MAYA', 'CARD', 'OTHER');
create type public.sale_status as enum ('COMPLETED', 'VOIDED', 'REFUNDED');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text not null default 'food',
  shop_title text not null default 'Inventory POS',
  tagline text,
  logo_path text,
  primary_color text not null default '#1a1a1a',
  accent_color text not null default '#2f5d50',
  background_color text not null default '#f7f4ef',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.org_role not null default 'CASHIER',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_members_user_id_idx on public.organization_members (user_id);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug),
  unique (organization_id, name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sku text not null,
  barcode text,
  name text not null,
  description text,
  image_path text,
  category_id uuid references public.categories (id) on delete set null,
  price_cents integer not null check (price_cents >= 0),
  cost_cents integer not null default 0 check (cost_cents >= 0),
  unit text not null default 'pc',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku),
  unique (organization_id, barcode)
);

create index products_organization_id_name_idx on public.products (organization_id, name);
create index products_organization_id_is_active_idx on public.products (organization_id, is_active);

create table public.stock_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null unique references public.products (id) on delete cascade,
  quantity integer not null default 0,
  reorder_level integer not null default 5,
  updated_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sale_number text not null,
  status public.sale_status not null default 'COMPLETED',
  subtotal_cents integer not null,
  discount_cents integer not null default 0,
  total_cents integer not null,
  payment_method public.payment_method not null,
  payment_note text,
  amount_tendered_cents integer,
  change_cents integer,
  cashier_id uuid not null references auth.users (id),
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sale_number)
);

create index sales_organization_id_created_at_idx on public.sales (organization_id, created_at);

create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sale_id uuid not null references public.sales (id) on delete cascade,
  product_id uuid not null references public.products (id),
  product_name text not null,
  product_sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null,
  line_total_cents integer not null
);

create index sale_items_sale_id_idx on public.sale_items (sale_id);

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.products (id),
  type public.stock_movement_type not null,
  quantity integer not null,
  reason text,
  user_id uuid references auth.users (id),
  sale_id uuid references public.sales (id),
  created_at timestamptz not null default now()
);

create index stock_movements_product_id_created_at_idx
  on public.stock_movements (product_id, created_at);

-- Membership helpers (SECURITY INVOKER)
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_org_owner(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = (select auth.uid())
      and m.role = 'OWNER'
  );
$$;

create or replace function public.member_role(org_id uuid)
returns public.org_role
language sql
stable
security invoker
set search_path = public
as $$
  select m.role
  from public.organization_members m
  where m.organization_id = org_id
    and m.user_id = (select auth.uid())
  limit 1;
$$;

-- Auto-add creator as OWNER when an org is inserted
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

  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row
  execute function public.handle_new_organization();

-- Profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger stock_items_updated_at before update on public.stock_items
  for each row execute function public.set_updated_at();
create trigger sales_updated_at before update on public.sales
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stock_items enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.stock_movements enable row level security;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;
grant execute on function public.member_role(uuid) to authenticated;

-- Profiles
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Organizations
create policy "organizations_select_member"
  on public.organizations for select to authenticated
  using (public.is_org_member(id));

create policy "organizations_insert_authenticated"
  on public.organizations for insert to authenticated
  with check ((select auth.uid()) is not null);

create policy "organizations_update_owner"
  on public.organizations for update to authenticated
  using (public.is_org_owner(id))
  with check (public.is_org_owner(id));

-- Members
create policy "members_select_same_org"
  on public.organization_members for select to authenticated
  using (public.is_org_member(organization_id));

create policy "members_insert_owner"
  on public.organization_members for insert to authenticated
  with check (public.is_org_owner(organization_id));

create policy "members_update_owner"
  on public.organization_members for update to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "members_delete_owner"
  on public.organization_members for delete to authenticated
  using (public.is_org_owner(organization_id));

-- Tenant tables: member read; owner write (cashiers can write stock/sales)
create policy "categories_select_member"
  on public.categories for select to authenticated
  using (public.is_org_member(organization_id));
create policy "categories_write_owner"
  on public.categories for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "products_select_member"
  on public.products for select to authenticated
  using (public.is_org_member(organization_id));
create policy "products_write_owner"
  on public.products for all to authenticated
  using (public.is_org_owner(organization_id))
  with check (public.is_org_owner(organization_id));

create policy "stock_items_select_member"
  on public.stock_items for select to authenticated
  using (public.is_org_member(organization_id));
create policy "stock_items_write_member"
  on public.stock_items for all to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "sales_select_member"
  on public.sales for select to authenticated
  using (public.is_org_member(organization_id));
create policy "sales_insert_member"
  on public.sales for insert to authenticated
  with check (public.is_org_member(organization_id));
create policy "sales_update_member"
  on public.sales for update to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "sale_items_select_member"
  on public.sale_items for select to authenticated
  using (public.is_org_member(organization_id));
create policy "sale_items_insert_member"
  on public.sale_items for insert to authenticated
  with check (public.is_org_member(organization_id));

create policy "stock_movements_select_member"
  on public.stock_movements for select to authenticated
  using (public.is_org_member(organization_id));
create policy "stock_movements_insert_member"
  on public.stock_movements for insert to authenticated
  with check (public.is_org_member(organization_id));

-- Storage bucket for uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

create policy "uploads_select_public"
  on storage.objects for select
  using (bucket_id = 'uploads');

create policy "uploads_insert_member"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

create policy "uploads_update_member"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'uploads'
    and public.is_org_member(((storage.foldername(name))[1])::uuid)
  );

create policy "uploads_delete_owner"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'uploads'
    and public.is_org_owner(((storage.foldername(name))[1])::uuid)
  );
