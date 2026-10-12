# Database & migrations

UNFLECT uses Supabase (Postgres). The server talks to it over PostgREST using
the service-role key; there is no client-side SDK and no browser access.

## Tables

| Table | Notes |
| --- | --- |
| `enquiries` | Project enquiries. Confidential; RLS enabled with no policies. |
| `profiles` | Account profile data, keyed by `auth.users.id`. |
| `account_events` | Append-only audit trail of account activity. |

Row Level Security is enabled on every table with **no policies**, so the public
anon key cannot read or write. Only the server's service-role key can.

## Migrations

Ordered, idempotent migrations live in `supabase/migrations/`. They mirror the
original `supabase/schema.sql` and `supabase/accounts.sql`, then add:

- `20260101000002_enquiries_email_index.sql` — index on `enquiries.email`
  (the account portal links a visitor's enquiries by exact email match).
- `20260101000003_enquiries_updated_at.sql` — adds `enquiries.updated_at` plus a
  trigger, so edits can be audited.

The `supabase/*.sql` files are kept as a readable snapshot. Treat the migrations
directory as the source of truth going forward.

## Applying migrations

**Migrations are never applied automatically.** Apply them deliberately, and
only after review:

```bash
# From the repo root, with the Supabase CLI installed and linked.
supabase link --project-ref <your-project-ref>
supabase db push          # applies pending migrations
```

Or apply the SQL manually in the Supabase SQL editor. Every migration is written
to be non-destructive (`if not exists`, additive columns), so it is safe to run
against a database that already has the original tables.

## Manual migration checklist

Migrations are **never applied automatically**. To apply them safely:

1. **Back up** the target database first (Supabase dashboard → Database → Backups,
   or rely on point-in-time recovery). Confirm a restore path exists.
2. **Inspect the current schema** and record it, so you can detect drift:
   - Tables: `\dt public.*`
   - Columns/types: `\d+ public.enquiries`, `\d+ public.profiles`, `\d+ public.account_events`
   - Indexes: `select indexname, indexdef from pg_indexes where schemaname='public';`
   - Triggers: `select event_object_table, trigger_name from information_schema.triggers where trigger_schema='public';`
   - RLS: `select relname, relrowsecurity from pg_class where relnamespace='public'::regnamespace;`
   - Policies: `select * from pg_policies where schemaname='public';`
   Compare against `supabase/schema.sql` / `supabase/accounts.sql`.
3. **Preconditions for a populated database:** every migration is idempotent and
   non-destructive (`if not exists`, `create or replace`, additive columns, trigger
   drop+recreate). The `updated_at` migration back-fills from `created_at`. No data
   is dropped, overwritten, or reset. If the database already has the original
   tables, the init migrations are effectively no-ops; only the index and `updated_at`
   migration change anything.
4. **Apply deliberately**, one at a time, verifying after each:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   Or run each file in `supabase/migrations/` in filename order in the SQL editor.
5. **Verify results:** re-run the step-2 queries and confirm:
   - `enquiries_email_idx` exists on `enquiries(email)`.
   - `enquiries.updated_at` exists and the `enquiries_updated_at` trigger is present.
   - RLS is enabled on all three tables and **no** policies exist.
   - Existing rows are intact (counts and sample rows unchanged; `updated_at` equals `created_at` for pre-existing rows).
6. **Rollback:** migrations are additive, so rolling back means restoring the
   pre-migration backup (or dropping the added index/column). Do not rely on an
   automatic "down" migration — none is provided.

## Follow-ups (not yet implemented)

- **Idempotency / soft delete for enquiries.** Deferred because it changes
  read/write behaviour. A future migration can add a `deleted_at` column and
  filter reads, and a unique `dedupe_hash` for duplicate-submission protection.
