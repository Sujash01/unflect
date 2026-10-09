-- UNFLECT — account data
-- Run after supabase/schema.sql in the same Supabase project.
-- Safe to run more than once.

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  bio          text not null default '',
  avatar_url   text not null default '',
  settings     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.account_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  event      text not null,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists account_events_user_created_idx
  on public.account_events (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.account_events enable row level security;

-- No browser policies are intentionally created. The Next.js server uses the
-- service-role key and performs the authorization checks before every query.

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();
