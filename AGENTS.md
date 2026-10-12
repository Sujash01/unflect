<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

## Commands

- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest unit tests (`tests/**/*.test.ts`)
- `npm run build` — production build

Run lint, typecheck and tests before considering work complete.

## Conventions

- New database changes belong in `supabase/migrations/` as ordered, idempotent,
  non-destructive SQL. Never auto-apply migrations to production.
- Keep secrets server-only: no secret may be prefixed `NEXT_PUBLIC_`.
- Validate all request input on the server; never trust client validation.
- Admin writes must go through the field allowlists in `src/lib/admin/validation.ts`.
- Do not add comments unless necessary.
- See `docs/` for environment, database, security and operations guidance.
