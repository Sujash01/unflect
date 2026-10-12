# Architecture

Lightweight documentation of the current architecture. No changes to the
technology stack are proposed.

## Overview

Single Next.js application serving both the public marketing site and the
account/admin portal. All privileged logic runs on the server (Route Handlers
and React Server Components). Data lives in Supabase (Postgres + Auth), accessed
over REST from the server only — there is no client-side SDK and no browser
access to the database.

```
Browser  ──HTTP──►  Next.js (Route Handlers + RSC)
                        │
                        ├─► Supabase Postgres (PostgREST)  [enquiries, profiles, account_events]
                        ├─► Supabase Auth (GoTrue)          [users, sessions]
                        ├─► Email provider (Resend/Postmark) [transactional mail]
                        └─► Upstash Redis (optional)        [shared rate-limit store]
```

## Major dependencies

| Dependency | Role |
| --- | --- |
| Next.js 16 (App Router, Turbopack) | Framework, SSR/SSG, API routes |
| React 19 + TypeScript 5.9 | UI and type safety |
| Tailwind CSS 4 | Styling |
| Supabase (PostgREST + Auth over `fetch`) | Database + auth |
| Vitest 5 | Unit/route tests |
| ESLint 9 | Linting |

## Service boundaries

- **Next.js server** — all validation, authorization, session handling and data
  access. The browser never touches Supabase directly.
- **Supabase** — source of truth for data and identities. RLS is enabled with no
  policies; only the server's service-role key can read/write.
- **Email provider** — transactional mail only; keys are server-only.
- **Upstash (optional)** — shared rate-limit counters.

## Environment configuration

Server-only secrets (`SUPABASE_*`, `ADMIN_EMAILS`, `UPSTASH_*`, `RESEND_*`,
`POSTMARK_*`) are read from environment variables and never prefixed
`NEXT_PUBLIC_`. `NEXT_PUBLIC_*` values are limited to non-secret config
(analytics, site verification). See [environment.md](environment.md).

## Data flows

- **Enquiry** → `validateEnquiry` → `insertRow("enquiries")` → best-effort email.
- **Auth** → Supabase Auth with the anon key; session stored in httpOnly cookies.
- **Data access** → server helpers scoped by user id/email (`getProfile`,
  `getUserEnquiries`, `getAccountEvents`) — no cross-tenant queries.
- **Rate limiting** → `rateLimit(clientKey(req, endpoint), …)` per client/endpoint,
  shared (Upstash) or process-local fallback.

## Architecture decision records

- **ADR-1: No Supabase SDK.** The backend needs only inserts, reads and a
  connectivity check. `fetch`-based helpers keep the bundle and lockfile small
  and avoid a browser SDK. *Status: accepted.*
- **ADR-2: Service-role key only on the server.** RLS is enabled with no
  policies, so the public/anon key cannot read or write. All access goes through
  the server, which authorizes first. *Status: accepted.*
- **ADR-3: In-memory rate-limit fallback.** When Upstash is unconfigured, a
  per-process sliding window keeps the app working locally/single-instance. It is
  documented as not shared across instances. *Status: accepted (see
  [security.md](security.md)).*
- **ADR-4: No client-side data fetching.** All data pages are Server Components
  that read Supabase directly, avoiding a public data API. *Status: accepted.*

## Out of scope

Microservices, a separate API tier, queues/workers, Redis caching of app data,
and any infrastructure not justified by a measured bottleneck.
