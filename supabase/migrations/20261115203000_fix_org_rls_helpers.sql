-- Fix org create RLS failures caused by recursive policy checks.
-- public.is_org_member / is_org_owner joined organizations while those same
-- helpers are used in organizations policies (INSERT RETURNING + SELECT).
-- Move the privileged lookup into private SECURITY DEFINER helpers.

create schema if not exists private;

grant usage on schema private to authenticated;

create or replace function private.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(
      (select auth.jwt() -> 'app_metadata' ->> 'platform_role') = 'SUPER_ADMIN',
      false
    )
    or exists (
      select 1
      from public.organization_members m
      join public.organizations o on o.id = m.organization_id
      where m.organization_id = org_id
        and m.user_id = (select auth.uid())
        and o.status = 'active'
    );
$$;

create or replace function private.is_org_owner(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(
      (select auth.jwt() -> 'app_metadata' ->> 'platform_role') = 'SUPER_ADMIN',
      false
    )
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

revoke all on function private.is_org_member(uuid) from public;
revoke all on function private.is_org_owner(uuid) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.is_org_owner(uuid) to authenticated;

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select private.is_org_member(org_id);
$$;

create or replace function public.is_org_owner(org_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select private.is_org_owner(org_id);
$$;

-- Explicit bootstrap RPC so org creation does not depend on INSERT RETURNING
-- surviving SELECT policies during the same statement.
create or replace function public.create_organization(
  p_name text,
  p_slug text,
  p_shop_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_org_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.organizations (
    name,
    slug,
    shop_title,
    industry
  )
  values (
    p_name,
    p_slug,
    coalesce(nullif(trim(p_shop_title), ''), p_name),
    'food'
  )
  returning id into v_org_id;

  return v_org_id;
end;
$$;

revoke all on function public.create_organization(text, text, text) from public;
grant execute on function public.create_organization(text, text, text) to authenticated;
