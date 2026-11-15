-- Platform admin support: org status, audit log, RLS helpers for SUPER_ADMIN

create type public.organization_status as enum ('active', 'suspended');

alter table public.organizations
  add column status public.organization_status not null default 'active';

create index organizations_status_idx on public.organizations (status);

create table public.platform_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users (id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index platform_audit_logs_created_at_idx
  on public.platform_audit_logs (created_at desc);

create index platform_audit_logs_actor_user_id_idx
  on public.platform_audit_logs (actor_user_id);

alter table public.platform_audit_logs enable row level security;

-- No tenant policies: only service_role (bypasses RLS) reads/writes from the server.

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (select auth.jwt() -> 'app_metadata' ->> 'platform_role') = 'SUPER_ADMIN',
    false
  );
$$;

grant execute on function public.is_platform_admin() to authenticated;

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.organization_members m
      join public.organizations o on o.id = m.organization_id
      where m.organization_id = org_id
        and m.user_id = (select auth.uid())
        and o.status = 'active'
    );
$$;

create or replace function public.is_org_owner(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.organization_members m
      join public.organizations o on o.id = m.organization_id
      where m.organization_id = org_id
        and m.user_id = (select auth.uid())
        and m.role = 'OWNER'
        and o.status = 'active'
    );
$$;
