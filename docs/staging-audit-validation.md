# Staging validation checklist — audit migration & admin mutations

Ordered checklist for validating the admin audit migration and related
behaviour against a **separate staging environment**. Every item is marked
**Local** (runs in this repo) or **Staging** (requires a configured staging
deployment + Supabase project). **No staging resource is currently
provisioned** — see [staging-resources.md](staging-resources.md).

Status legend: ✅ done · ⬜ pending · 🚫 blocked

## 0. Preconditions

- 🚫 **Staging Supabase project** — none exists/connected (no `supabase/config.toml`, no CLI, no `.env`). Needed before any DB work.
- 🚫 **Staging deployment** — none configured (no `vercel.json`/`netlify.toml`/etc.).
- 🚫 **Staging credentials** — no `.env` files present locally; no staging keys available.
- ⬜ Confirm staging is fully isolated from production (separate project, DB, env, email).

## 1. Apply the audit migration (staging only)

Target: the **staging** `account_events` table. File:
`supabase/migrations/20260101000004_account_events_audit_columns.sql`
(adds nullable `actor_id uuid`, `target_type text`, `target_id text`).

- ⬜ **Back up staging first** — Supabase dashboard → Database → Backups (or `pg_dump` from the staging DB). Confirm a restore path. Preserve the backup; never overwrite.
- ⬜ **Inspect current staging schema** before applying (see queries in [database.md](database.md)):
  - `\d+ public.account_events` — confirm base columns/types.
  - Confirm whether `actor_id`/`target_type`/`target_id` already exist (`add column if not exists` makes this safe either way).
- ⬜ **Apply deliberately** — Supabase SQL editor, or `supabase db push` once the staging project is linked. Do **not** auto-apply.
- ⬜ **Verify columns** after applying:
  ```sql
  select column_name, data_type, is_nullable
  from information_schema.columns
  where table_schema = 'public' and table_name = 'account_events'
  order by ordinal_position;
  ```
  Expect `actor_id` (uuid, nullable), `target_type` (text, nullable), `target_id` (text, nullable), alongside the base columns.
- ⬜ **Confirm existing rows intact** — `select count(*) from public.account_events;` unchanged; base columns unaffected.
- ⬜ **Confirm RLS** still enabled with **no** policies: `select relrowsecurity from pg_class where relname='account_events';` + `select * from pg_policies where schename='public';`

## 2. Admin mutations record audit events (staging)

Using a staging admin account (in `ADMIN_EMAILS`, email confirmed):

- ⬜ **Enquiry update** — PATCH `/api/admin/enquiries` → `200`; verify an `account_events` row with `event='admin.enquiry.updated'`, matching `actor_id`, `target_type='enquiry'`, `target_id`.
- ⬜ **Enquiry delete** — DELETE → `200`; verify `admin.enquiry.deleted`.
- ⬜ **User profile update** — PATCH `/api/admin/users` → `200`; verify `admin.user.updated` with `metadata.fields` only (no PII values).
- ⬜ **User delete** — DELETE → `200`; verify `admin.user.deleted`.
- ⬜ **Block / unblock** — POST `/api/admin/users` → `200`; verify `admin.user.blocked` / `admin.user.unblocked` and that `settings.blocked` flipped while other preferences persisted.
- ⬜ **Audit metadata is safe** — confirm no passwords/tokens/PII values in `metadata`; strings capped at 300 chars.

## 3. Audit-write failure handling (staging)

- ⬜ Simulate an audit-insert failure (e.g. temporarily revoke insert on `account_events`, or point the helper at a bad state) **on staging only**.
- ⬜ Confirm the mutation returns a **non-2xx** status with the specific message (e.g. "Enquiry updated, but audit logging failed.") — **not** a false success.
- ⬜ Confirm the **admin UI** displays that specific message (the tables now surface `response.error`), not a generic "Failed to X".
- ⬜ Confirm the mutation's effect and the audit gap are both visible/logged (`admin_audit_write_failed` in logs).
- ⬜ Restore the staging DB from the backup taken in §1 afterward.

## 4. Authentication, authorisation & enquiry submission (staging)

- ⬜ Signup + email confirmation; login/logout; password reset.
- ⬜ Confirmed vs unconfirmed email behaviour on `/account`.
- ⬜ Admin access for an allowlisted, confirmed user; rejection for non-admin and unauthenticated (`403`).
- ⬜ Forbidden-field updates rejected (`400`); invalid UUIDs rejected.
- ⬜ Valid enquiry saved (`202`); invalid/oversized rejected (`400`/`413`).
- ⬜ Rate limiting: exceed per-endpoint limits → `429` with `Retry-After`; independent clients unaffected.

## 5. Cache headers & request IDs (staging)

- ✅ `scripts/verify-cache-headers.mjs` — sensitive routes `no-store`, static assets cacheable (local).
- ⬜ Verify `Cache-Control: no-store` on `/api/{auth,account,admin}` + `/account`,`/admin`,`/settings` against the live staging host (headers behave correctly behind the real proxy).
- ⬜ Verify `x-request-id` is present in responses and appears in server logs for a traced request.

## 6. Browser smoke tests (staging, if URL + test accounts available)

- ⬜ Homepage, services, work, contact form render with no console errors.
- ⬜ Submit the enquiry form end-to-end.
- ⬜ Login → account page; admin panel loads for the staging admin.
- ⬜ CSP report-only: no first-party violations (see [csp.md](csp.md)).

## 7. Isolation & cleanup

- ⬜ Confirm staging data never touches production (separate project/DB).
- ⬜ After validation, drop/reset the disposable staging database and remove any test accounts.

## Local checks already passing (no staging needed)

- ✅ `npm run lint` · `npm run typecheck` · `npm test` (134) · `npm run build`
- ✅ `npm audit --omit=dev` → 0 vulnerabilities
- ✅ `scripts/verify-data-isolation.mjs` · `audit-production.mjs` · `test-routes.mjs` · `verify-no-secrets.mjs` · `verify-cache-headers.mjs`

## Blocker

All **Staging** items are blocked on a provisioned staging environment and
credentials. Local preparation is complete; no external action is taken
without explicit approval.
