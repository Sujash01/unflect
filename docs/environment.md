# Environment variables

Copy [`.env.example`](../.env.example) to `.env.local` and fill it in. `.env*`
files are git-ignored. Anything not prefixed `NEXT_PUBLIC_` is server-only and
must never be exposed to the browser.

## Required

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key that bypasses Row Level Security. Never prefix with `NEXT_PUBLIC_`. |

If either is missing, enquiry submission returns `503` and `/api/health`
reports `database: "not_configured"`.

## Required for admin access

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAILS` | Comma-separated allowlist of admin email addresses. |

Admin access requires **all** of: an authenticated session, a confirmed email
address (`email_confirmed_at`), and membership in this allowlist. The value is
empty by default, so nobody is an admin until an operator opts in. Set it in the
deployment environment (for this project: `ADMIN_EMAILS=team@unflect.in`).

## Recommended

| Variable | Purpose |
| --- | --- |
| `SUPABASE_ANON_KEY` | Public/publishable key for ordinary auth (sign up, sign in, refresh). Falls back to the service-role key if unset, which is not recommended. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Alias used only if `SUPABASE_ANON_KEY` is unset. |

## Optional

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` / `POSTMARK_SERVER_TOKEN` | Email provider. If neither is set, enquiries are still stored; email is skipped and logged. |
| `EMAIL_FROM` | From address for outbound email. |
| `STUDIO_NOTIFICATION_EMAIL` | Studio inbox for enquiry notifications. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Shared rate-limit store. Without it, rate limiting is per-process (not shared across serverless instances). |
| `CLIENT_IP_HEADER` | Header carrying the real client IP (e.g. `cf-connecting-ip`). When set, only that header is trusted for rate-limit keys, so a spoofed `x-forwarded-for` cannot rotate the key. **The hosting platform is unconfirmed — choose this value only after verifying the proxy sets a trusted IP header.** |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` / `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Client analytics. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification. |
