-- UNFLECT — Supabase schema
-- Run this once in: Supabase dashboard → SQL Editor → New query → Run.

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  name          text not null,
  company       text not null,
  email         text not null,
  project_type  text not null,
  goal          text not null,
  problem       text not null,
  timeline      text not null,
  budget        text not null,
  details       text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam')),
  created_at    timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx     on public.enquiries (status);

-- Enquiries are confidential. Row Level Security is ON with no policies, so the
-- public anon key can neither read nor write. The Next.js server inserts using
-- the service-role key, which bypasses RLS.
alter table public.enquiries enable row level security;
