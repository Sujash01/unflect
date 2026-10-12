# Backup and restore runbook (staging only)

A safe, staged procedure for testing backup restoration. **Do not run against
production.** No backup, restore, or migration is executed as part of creating
this document.

## Principles

- The destination database is **separate and disposable** — never production.
- The source backup is **preserved**; a restore never overwrites its source.
- Verify identity and credentials **before** any restore.
- Restore into the destination **only**.

## Procedure

1. **Identify source and destination.**
   - Source: the staging Supabase project (or a throwaway copy) that holds the
     backup to restore.
   - Destination: a separate, disposable staging database (e.g. `unflect-restore-test`).
   - Confirm both project refs/URLs; record them.

2. **Verify the destination is separate and disposable.**
   - Confirm the destination project ref differs from production and from the
     source.
   - Confirm it contains no data you need to keep (it will be overwritten).

3. **Verify credentials and target identity before any restore.**
   - Use the destination project's service-role key (staging only).
   - Confirm you are connected to the destination (e.g. `select current_database(),
     current_user;`) before proceeding.

4. **Preserve the source backup.**
   - Take a fresh backup of the source (Supabase dashboard → Database → Backups,
     or `pg_dump`) and store it safely. Do not delete or overwrite it.

5. **Restore into the destination only.**
   - Use the Supabase dashboard restore, or `pg_restore`/`psql` from the preserved
     backup into the destination. Double-check the target connection string.

6. **Verify the result.**
   - Schema: tables, columns, indexes, triggers, RLS (see
     [database.md](database.md) inspection queries).
   - Row counts: compare counts of `enquiries`, `profiles`, `account_events`
     against the source where appropriate.
   - Application compatibility: point the staging app at the destination and run
     the smoke checks (health, enquiry submission, login, admin).

7. **Document cleanup and recovery.**
   - Record what was restored, when, and the verification results.
   - Drop or reset the disposable destination when done.
   - If a restore fails, capture the error, do not retry blindly, and restore the
     destination to a clean state before another attempt.

## Status

**Not performed.** No backup or restore has been executed. This runbook is
ready for an authorized staging test.
