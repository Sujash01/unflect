-- Add `updated_at` to enquiries so edits can be audited.
--
-- Additive only: preserves existing rows (back-filled from created_at) and
-- adds a trigger to keep the column current. Soft-delete is deliberately NOT
-- introduced here because it would change read/write behaviour; see
-- docs/database.md for the recommended approach.

alter table public.enquiries
  add column if not exists updated_at timestamptz not null default now();

update public.enquiries set updated_at = created_at where updated_at > created_at;

create or replace function public.set_enquiry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at
before update on public.enquiries
for each row execute function public.set_enquiry_updated_at();
