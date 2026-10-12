# Content Security Policy — validation plan

The CSP in `next.config.mjs` is **report-only** (`Content-Security-Policy-Report-Only`).
It reports violations without blocking resources, so it is safe to keep enabled
during validation. **Do not promote it to the enforcing header until the steps
below are completed in a real browser.**

## Current policy and why it is permissive

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none';
form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data:;
script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
connect-src 'self' https:;
```

Each relaxation exists for a reason; none should be removed without evidence:

| Directive | Relaxation | Why it is needed | Risk if tightened blindly |
| --- | --- | --- | --- |
| `script-src` | `'unsafe-inline'` | Next.js injects inline bootstrap/hydration payloads (`__next_f`). | Breaks hydration → blank pages. |
| `script-src` | `'unsafe-eval'` | Some Next.js dev/migration tooling evaluates code. | Can often be dropped in production — test first. |
| `style-src` | `'unsafe-inline'` | Tailwind + Next.js emit inline styles. | Breaks all styling. |
| `connect-src` | `https:` | Supabase Auth/PostgREST run on `*.supabase.co`. | Breaks login and data reads. |
| `img-src` | `https:` | External images/CDNs. | Broken images. |

**Rule:** do not add `unsafe-eval`, `unsafe-inline`, or broad wildcards merely to
make reports quiet. Remove a relaxation only when the browser shows it is genuinely
unused in production.

## Sources to review before enforcing

1. **Next.js hydration** — inline `<script>` chunks (`script-src 'unsafe-inline'`).
2. **Supabase** — `*.supabase.co` for auth and PostgREST (`connect-src`).
3. **Images** — any external image host or CDN (`img-src`).
4. **Fonts** — self-hosted vs Google Fonts (`font-src`, `style-src`).
5. **Analytics** — if `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, its endpoint and any
   injected script (`script-src`, `connect-src`).
6. **Vercel/preview** — platform-injected scripts if applicable.

## Browser testing procedure

No browser automation is configured in this repository, so validation is manual.
Perform these steps against a **staging** build (not production).

1. Build and start: `npm run build && npm start` (or a staging deploy).
2. Open DevTools → **Console** and **Network** tabs.
3. Visit each page and watch for red CSP messages (they include the violated
   directive and the blocked URL):
   - `/` (homepage)
   - `/about`, `/services`, `/services/[slug]`
   - `/work`, `/work/[slug]`
   - `/process`
   - `/contact` (submit the enquiry form)
   - `/login`, `/signup`, `/forgot-password`, `/reset-password`
   - `/account` (signed in), `/admin` (as an allowlisted admin)
4. Exercise flows: sign up, log in, log out, request password reset, submit an
   enquiry, edit an admin enquiry/profile, block/unblock a user.
5. Check **accessibility** (keyboard nav, screen-reader announcements) and
   **responsive layout** at mobile and desktop widths on each page.
6. Note every CSP violation with the directive and blocked URL.

## Collecting and interpreting reports

Report-only mode logs violations to the console and (if configured) a reporting
endpoint. To collect them centrally:

1. Add a `report-uri` / `report-to` endpoint (e.g. a free CSP reporter or your own
   logging endpoint) and re-deploy. This does **not** block anything.
2. Browse the pages above; violations are POSTed as JSON to that endpoint.
3. Group reports by `effective-directive` and `blocked-uri`.
4. Distinguish real gaps (a resource the app actually needs) from noise (browser
   extensions, preview tooling). Extension noise can be filtered by user-agent.
5. Add only the specific source that is actually required — never a wildcard.

## Promotion criteria (enforcement)

Promote to `Content-Security-Policy` only when **all** hold:

- A full browser pass across every page and flow produces **zero** first-party
  violations (extension noise filtered).
- `'unsafe-eval'` has been tested and removed if unused.
- `connect-src` has been narrowed to `self` + the exact Supabase origin(s).
- A re-run after enforcement confirms the site still hydrates and functions.

Keep the report-only header alongside enforcement during a soak period so any
missed source is still visible.
