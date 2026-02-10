-- Dashboard authorization baseline for Supabase.
-- Apply this script in Supabase SQL editor with a privileged role.
-- Idempotent: safe to run multiple times.

-- 1) Profiles table (source of truth for app roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user'
    check (role in ('user', 'admin', 'owner', 'superadmin')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_is_admin_idx on public.profiles(is_admin);

-- 2) Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- 3) Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Never trust raw_user_meta_data for role assignment; users can control it.
  insert into public.profiles (id, email, role, is_admin)
  values (
    new.id,
    new.email,
    'user',
    false
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- 4) Backfill profiles for users that already exist
insert into public.profiles (id, email, role, is_admin)
select u.id, u.email, 'user', false
from auth.users u
on conflict (id) do nothing;

-- 5) Admin resolver function used by RLS and frontend guard RPC
create or replace function public.is_dashboard_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  profile_role text;
  profile_is_admin boolean;
  claim_role text;
begin
  -- Source of truth: profiles table
  select lower(coalesce(p.role, '')), coalesce(p.is_admin, false)
  into profile_role, profile_is_admin
  from public.profiles p
  where p.id = auth.uid()
  limit 1;

  if coalesce(profile_is_admin, false)
     or coalesce(profile_role, '') in ('admin', 'owner', 'superadmin')
  then
    return true;
  end if;

  -- Optional fallback to app_metadata claim only.
  -- Do not trust user_metadata.role for authorization decisions.
  claim_role := lower(
    coalesce(
      auth.jwt() -> 'app_metadata' ->> 'role',
      ''
    )
  );

  return claim_role in ('admin', 'owner', 'superadmin');
end;
$$;

revoke all on function public.is_dashboard_admin() from public;
grant execute on function public.is_dashboard_admin() to authenticated;

-- 6) Profiles RLS (minimal and safe)
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- 7) interaction_logs RLS bound to admin resolver
alter table if exists public.interaction_logs enable row level security;

drop policy if exists "interaction_logs_admin_select" on public.interaction_logs;
create policy "interaction_logs_admin_select"
on public.interaction_logs
for select
to authenticated
using (public.is_dashboard_admin());

drop policy if exists "interaction_logs_admin_update" on public.interaction_logs;
create policy "interaction_logs_admin_update"
on public.interaction_logs
for update
to authenticated
using (public.is_dashboard_admin())
with check (public.is_dashboard_admin());
