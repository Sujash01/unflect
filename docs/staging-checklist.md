# Staging checklist

Ordered readiness checklist for a controlled staging test. Each item is marked
**Local** (can be done in this repo with no external config) or **Staging**
(requires a configured staging environment with Supabase and, where noted, email).

## Status summary (latest run)

| Area | Status |
| --- | --- |
| Local: lint / typecheck | **PASS** |
| Local: unit + route tests | **PASS** (99/99) |
| Local: production build | **PASS** |
| Local: production dependency audit (`--omit=dev`) | **PASS** (0 vulns) |
| Local: data-isolation / audit-production / test-routes scripts | **PASS** |
| Staging environment | **BLOCKED** — no staging deployment, Supabase project, Upstash, or email account provisioned; no credentials or authorization available |
| Migrations | **NOT APPLIED** — no staging database to apply to; awaiting authorization (see [database.md](database.md)) |
| End-to-end auth / admin / enquiry / email / rate-limit tests | **NOT RUN** — require a configured staging environment |
| CSP browser validation | **BLOCKED** — no browser automation configured and no staging build to test |

Staging is **not** provisioned. Every Staging item below remains open and is
gated on the resource-creation checklist in
[staging-resources.md](staging-resources.md) plus explicit authorization.

## 1. Environment variables
**Staging.** Provision a staging deployment environment and set:
- [ ] `SUPABASE_URL` — staging Supabase project URL (required).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — staging service-role key (required, server-only).
- [ ] `SUPABASE_ANON_KEY` — staging anon key (recommended).
- [ ] `ADMIN_EMAILS=team@unflect.in` — grants admin to that verified address (required for admin checks).
- [ ] `CLIENT_IP_HEADER` — set to the staging proxy's trusted IP header (see note below).
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — for shared rate limiting (optional but recommended).
- [ ] `RESEND_API_KEY` or `POSTMARK_SERVER_TOKEN` — to test email end-to-end (optional; enquiries still store without it).

> **Hosting platform is unconfirmed.** `CLIENT_IP_HEADER` must be chosen only
> after confirming the staging proxy sets a header carrying the real client IP
> (e.g. `cf-connecting-ip` on Cloudflare, `x-real-ip`/`x-vercel-forwarded-for` on
> Vercel). Until confirmed, per-client rate limits are not reliable — the
> in-memory fallback is process-local.

## 2. Admin authorization & email confirmation
**Staging.**
- [ ] Sign in as `team@unflect.in` and confirm the email (set `email_confirmed_at`).
- [ ] `/admin` loads and shows enquiries, profiles, events.
- [ ] A confirmed non-allowlisted user is redirected away from `/admin` and gets `403` on `/api/admin/*`.
- [ ] An unauthenticated request to `/api/admin/enquiries` returns `403`.
- [ ] A confirmed-but-unverified allowlisted email is denied.

## 3. Login, logout, password reset, account protection
**Staging.**
- [ ] Sign up → verify email → session cookie set (`httpOnly`, `Secure` in staging).
- [ ] Log in, log out.
- [ ] Request password reset; complete reset with the emailed link.
- [ ] `/account` is inaccessible while logged out (redirects to `/login`).
- [ ] Account export is gated behind email confirmation.

## 4. Blocked-user behavior
**Staging.**
- [ ] Block a user in the admin panel → their existing session stops working (API `403`).
- [ ] Their `settings.blocked` flag is set while other preferences are preserved.
- [ ] Unblock restores access.

## 5. Enquiry persistence & email failure
**Staging.**
- [ ] Submit a valid enquiry → `202` with a reference; row visible in admin and in `/account`.
- [ ] With email provider configured and reachable → `project_enquiry_email_dispatched` in logs.
- [ ] With provider key set but endpoint failing → enquiry still `202` and stored; log shows `project_enquiry_email_failed` (never a false success).
- [ ] With Supabase unreachable → `503`; form shows the "temporarily unable" message, **not** a success receipt.
- [ ] Frontend never shows a success receipt unless the response is `2xx`.

## 6. Rate limiting from separate clients
**Staging.**
- [ ] Configure Upstash; confirm shared store is used.
- [ ] Exceed the enquiry limit (5/min) from one client → `429`.
- [ ] A second, different client is **not** affected (independent keys).
- [ ] With `CLIENT_IP_HEADER` set, a spoofed `x-forwarded-for` does not rotate the key.

## 7. Health check when dependencies are unavailable
**Staging.**
- [ ] With Supabase configured and reachable → `200 { ok: true, database: "connected" }`.
- [ ] Stop/block Supabase → `503 { ok: false, database: "unreachable" }`; alerts fire.
- [ ] Unset Supabase config → `503 { ok: false, database: "not_configured" }`.

## 8. Admin pagination & updates
**Staging.**
- [ ] Enquiries and profiles paginate with deterministic ordering.
- [ ] `?epage=0` / negative / non-numeric clamp to page 1; unknown page sizes fall back to 25.
- [ ] Empty lists show an empty state; the pagination control is hidden for a single page.
- [ ] Editing status / display name persists; forbidden fields (`id`, `reference`, `settings`) are rejected with `400`.

## 9. Supabase schema & migration verification
**Staging.** Migrations are **never applied automatically** — see
[database.md](database.md) for the manual migration checklist.
- [ ] Back up the staging database (Supabase dashboard → Backup / PITR) before any change.
- [ ] Confirm the current schema matches the intended tables/indexes/triggers/RLS.
- [ ] Apply migrations deliberately, then verify `enquiries.email` index, `enquiries.updated_at` trigger, and RLS-enabled/no-policy state.

## 10. Browser console, CSP, accessibility, responsive
**Staging.** Follow [csp.md](csp.md).
- [ ] No console errors on homepage, services, work, contact, login, account, admin.
- [ ] CSP report-only shows no first-party violations (extension noise filtered).
- [ ] Keyboard navigation and screen-reader announcements work.
- [ ] Layout correct at mobile and desktop widths.

## 11. Logs, monitoring, backup & restore
**Staging.**
- [ ] Structured JSON logs are captured by the platform.
- [ ] Alerts wired to `/api/health` (`503`).
- [ ] Backup/restore path is documented and (if possible) restore-tested in staging.

## 12. Rollback procedure
**Staging.**
- [ ] Revert the deployment to the previous build (platform rollback).
- [ ] If a schema change was applied and is incompatible, restore from the backup taken in step 9.
- [ ] Confirm the prior build is healthy via `/api/health`.
- [ ] Record what was rolled back and why.

## Local-only checks (executed — all passing)

- [x] `npm run lint` → clean
- [x] `npm run typecheck` → clean
- [x] `npm test` → 13 files, 99 tests passed
- [x] `npm run build` → compiled successfully, 50 static pages generated
- [x] `npm audit --omit=dev` → 0 vulnerabilities
- [x] `scripts/verify-data-isolation.mjs` → ALL PASSED
- [x] `scripts/audit-production.mjs` → ALL PASSED
- [x] `scripts/test-routes.mjs` → all routes/redirects/canonical/JSON-LD OK

## Not performed (blocked)

- [ ] All **Staging** items above — no staging environment or credentials.
- [ ] Browser/CSP validation — no browser automation configured and no staging
      build to test against (see [csp.md](csp.md) for the manual procedure).
- [ ] Migrations — no staging database; not applied anywhere.
