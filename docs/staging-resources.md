# Staging resource-creation checklist

> **Status: NOT PROVISIONED.** No staging deployment, Supabase project, Upstash
> database, or email-provider account currently exists, and no credentials or
> authorization to create them are available. This document is the exact
> runbook for creating them. **Do not create or deploy any external resource
> without explicit authorization.** Production is never touched.

## Why a separate staging environment

Staging must be fully isolated from production so that testing cannot affect
live data, email, or visitors:

- **Separate deployment** (not the production domain).
- **Separate Supabase project + database** (never the production project).
- **Separate environment variables** (staging values only).
- **Separate email configuration** or a safe test sink (never production inboxes).
- **Separate Upstash credentials** if shared rate limiting is enabled.

The production domain (`https://unflect.in/`) and all production resources
remain unchanged.

## 1. Staging deployment (host TBD)

The hosting platform is **unconfirmed** (no `vercel.json`, `netlify.toml`, or
other deploy config exists). Confirm the platform first, then:

- [ ] Choose the staging host (e.g. Vercel, Netlify, or a VPS).
- [ ] Create a **new** project/site for staging; do not reuse production.
- [ ] Connect the repository and set the **staging** environment variable set.
- [ ] Set the production domain unchanged; assign a staging domain/preview URL.
- [ ] Confirm the platform's **trusted proxy IP header** (see §4) — required
      before `CLIENT_IP_HEADER` can be set.

**Billing/plan implications (confirm before creating):** most platforms offer
a free/hobby tier sufficient for staging. Some features (custom domains, team
seats, higher serverless limits) may require a paid plan. Confirm the current
plan on the provider's pricing page before creating a paid resource.

## 2. Separate Supabase project

- [ ] In the Supabase dashboard, create a **new project** (e.g. `unflect-staging`).
- [ ] Choose a region and a strong database password (store in a password manager).
- [ ] Record the **staging** values (never production):
  - `SUPABASE_URL` — `https://<ref>.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY` — server-only
  - `SUPABASE_ANON_KEY` — public/anon key
- [ ] Confirm the project's **Auth** settings (email confirm, redirect URLs).
- [ ] Enable **point-in-time recovery / backups** if available on the plan.

**Billing/plan implications:** a second Supabase project is typically free on
the free tier. Note that free-tier projects may pause after inactivity —
confirm the plan's limits. Never use production credentials as staging
credentials.

## 3. Separate Upstash (only if shared rate limiting is enabled)

Skip this section if staging will use the in-memory fallback.

- [ ] In the Upstash console, create a **new Redis database** for staging.
- [ ] Record `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (both required).
- [ ] Keep them **separate** from any production Upstash database.

**Billing/plan implications:** Upstash has a free tier (limited commands/day).
Confirm the free-tier limit is sufficient for staging traffic before relying on
it; a paid plan may be needed for higher volume.

## 4. Confirm the trusted proxy header (blocking for `CLIENT_IP_HEADER`)

`CLIENT_IP_HEADER` must **not** be guessed. To set it:

- [ ] Identify the staging host's edge/proxy (e.g. Cloudflare, Vercel, Netlify).
- [ ] Confirm which request header the proxy sets to the **real client IP**
      and whether it overwrites or appends to client-supplied values.
      - Cloudflare: `cf-connecting-ip` (set by the proxy; client cannot spoof).
      - Vercel: `x-forwarded-for` / `x-vercel-forwarded-for` (verify behavior).
- [ ] Only after confirmation, set `CLIENT_IP_HEADER` to that header.
- [ ] Until confirmed, leave it unset and treat per-client limits as
      process-local (the in-memory fallback).

## 5. Email provider (test-safe)

- [ ] Prefer a **test sink** for staging: Postmark's test server, Resend's test
      mode, or a dedicated staging inbox — **not** production inboxes.
- [ ] Record `RESEND_API_KEY` **or** `POSTMARK_SERVER_TOKEN` (staging values).
- [ ] Set `EMAIL_FROM` and `STUDIO_NOTIFICATION_EMAIL` to staging-safe addresses.
- [ ] Verify the provider allows the staging "from" domain.

**Billing/plan implications:** Resend and Postmark offer free/test tiers.
Confirm sending limits and whether a verified domain (paid) is required.

## 6. Staging environment variables (summary)

Set these in the **staging** deployment environment only:

| Variable | Staging value |
| --- | --- |
| `SUPABASE_URL` | staging project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | staging service key (server-only) |
| `SUPABASE_ANON_KEY` | staging anon key |
| `ADMIN_EMAILS` | staging admin email (e.g. a team address you control) |
| `CLIENT_IP_HEADER` | proxy trusted header (after §4 confirmation) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | staging Upstash (if used) |
| `RESEND_API_KEY` / `POSTMARK_SERVER_TOKEN` | staging/test email |
| `EMAIL_FROM`, `STUDIO_NOTIFICATION_EMAIL` | staging-safe addresses |

## Authorization required before proceeding

Creating any of the above requires the repository owner's explicit
authorization and access to the provider dashboards. Until then, no external
resource is created and no staging validation is performed.
