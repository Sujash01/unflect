# Security model

## Admin authorization

Admin access is derived only from server-controlled inputs:

1. An authenticated session (checked by the caller).
2. A confirmed email address (`email_confirmed_at`).
3. Membership in the server-only `ADMIN_EMAILS` allowlist.

No hard-coded email, profile field, settings value or request payload can grant
admin rights. Block/users endpoints verify origin and admin status before any
mutation.

## Secrets

- The service-role key and all non-public values are server-only and never
  prefixed `NEXT_PUBLIC_`.
- Supabase keys are read from environment variables; none are hard-coded.
- Password data never leaves Supabase Auth; the app only stores httpOnly session
  cookies.

## Request hardening

- **Cross-origin writes** are rejected via an origin check (`rejectCrossOrigin`).
- **Body size** is capped (16 KB) on JSON endpoints.
- **Input validation** is server-side and authoritative; the client result is
  never trusted. Admin updates accept an explicit allowlist of fields, so `id`,
  `reference`, `created_at`, `settings` and ownership columns cannot be smuggled
  through.
- **Rate limiting** is per client (`x-forwarded-for` → `x-real-ip` →
  `cf-connecting-ip`) so one visitor cannot exhaust a limit for everyone. Use
  Upstash for a shared store in serverless deployments. Set `CLIENT_IP_HEADER`
  to your proxy's trusted IP header (e.g. `cf-connecting-ip`) so a spoofed
  `x-forwarded-for` cannot rotate the rate-limit key.

## Response hygiene

- Sign-up does not reveal whether an email is already registered.
- Enquiry submission never reports success unless the record was stored. When
  the store is unavailable it returns `503`; on write failure, `500`.
- `/api/health` returns `503` unless the database is configured and reachable.
- Upstream error detail is logged server-side, not returned to clients.

## Transport headers

Set in `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`,
`Strict-Transport-Security`, and a **report-only** `Content-Security-Policy`.

The CSP is report-only so it cannot break hydration, fonts, images or auth
callbacks. Validate it in a browser (`report-uri`/`report-to` recommended), then
promote it to the enforcing `Content-Security-Policy` header.

## Known, accepted findings

- `npm audit` reports high-severity advisories in the **dev-only** ESLint
  toolchain (`braces` via `fast-glob` via `@next/eslint-plugin-next`). These are
  not shipped at runtime; the suggested fix downgrades `eslint-config-next` and
  is not applied. Revisit when upstream releases a patched version.
