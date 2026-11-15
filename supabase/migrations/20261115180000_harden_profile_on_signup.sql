-- Make signup profile creation idempotent, and backfill any auth users
-- that were created before the trigger existed / without a profiles row.

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
    coalesce(
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'User'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

insert into public.profiles (id, name)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'name',
    split_part(u.email, '@', 1),
    'User'
  )
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- Allow signed-in users to self-heal a missing profile row.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
