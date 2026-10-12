# UNFLECT

Marketing site and account portal for UNFLECT — "We build software that solves
real business problems." Project enquiries submitted through the site are stored
in Supabase and, when an email provider is configured, dispatched to the studio
inbox and the submitter.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19
- TypeScript 5.9, Tailwind CSS 4
- Supabase (Postgres + Auth) accessed over REST from the server; no client SDK
- Vitest for behavioural unit tests

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The site runs at http://localhost:3000. Without Supabase configured, enquiry
submission and login return a clear "unavailable" response rather than a false
success.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (unit tests) |

## Environment

All configuration is via environment variables. See
[`.env.example`](.env.example) and [`docs/environment.md`](docs/environment.md).
The only required variables are `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`; `ADMIN_EMAILS` is required to grant admin access.

## Documentation

- [Environment variables](docs/environment.md)
- [Database & migrations](docs/database.md)
- [Security model](docs/security.md)
- [Threat model](docs/security/threat-model.md)
- [Operations runbook](docs/operations.md)
- [Monitoring & alerts](docs/monitoring.md)
- [Backup & restore runbook](docs/backup-restore.md)
- [Performance validation plan](docs/performance.md)
- [System design](docs/system-design.md)
- [Architecture](docs/architecture.md)
- [CSP validation plan](docs/csp.md)
- [Staging checklist](docs/staging-checklist.md)
- [Staging audit-validation checklist](docs/staging-audit-validation.md)
- [Staging resource-creation checklist](docs/staging-resources.md)

## Project structure

```
src/app            Routes (pages + Route Handlers under app/api)
src/components     UI, grouped by area (admin, contact, marketing, …)
src/content        Site copy and configuration
src/lib            Auth, Supabase, validation, delivery, rate limiting
supabase           Schema and ordered migrations
tests              Vitest suites
```

## Contributing

- Run `npm run lint && npm run typecheck && npm test` before pushing.
- Never commit secrets. `NEXT_PUBLIC_*` values are public; everything else must
  stay server-side.
- Database changes go in `supabase/migrations/` and are applied manually — see
  [docs/database.md](docs/database.md).
