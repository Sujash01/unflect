# Threat model

A fresh, independent security review of the UNFLECT application. This is a
code-and-configuration review, **not** a professional penetration test.

## Assets

- Enquiries (confidential project details), profiles, account events.
- User sessions (httpOnly cookies) and Supabase Auth identities.
- Admin privilege (server-side allowlist).
- Email delivery and the studio inbox.
- Server secrets (service-role key, email keys, Upstash token).

## Scope and method

Reviewed: access control/IDOR, input validation/injection, XSS, CSRF, open
redirects, SSRF, file upload, cookies/sessions, secrets in client bundles and
logs, security headers/CSP, error responses, and dependency advisories.

## Threats and status

| # | Threat | Status | Mitigation / evidence | Residual risk |
| --- | --- | --- | --- | --- |
| 1 | IDOR / cross-tenant data access | **Mitigated** | Data helpers scoped by user id/email; account pages are Server Components; verified by `scripts/verify-data-isolation.mjs`. | Low — re-verify after any new data route. |
| 2 | Unauthorized admin access | **Mitigated** | `isAdmin` requires session + confirmed email + `ADMIN_EMAILS`; every admin route calls `assertAdmin`. | Low — depends on `ADMIN_EMAILS` being set correctly. |
| 3 | Auth bypass / session theft | **Mitigated** | httpOnly, sameSite=lax, Secure-in-production cookies; Supabase-validated sessions. | Low — Secure flag depends on `NODE_ENV=production`. |
| 4 | CSRF on state-changing endpoints | **Mitigated** | `rejectCrossOrigin` on all mutating routes; JSON content type forces preflight. | Low — non-browser clients are not CSRF. |
| 5 | XSS | **Mitigated** | React escapes output; no `dangerouslySetInnerHTML` found; CSP (report-only) adds defence-in-depth. | Low — CSP not yet enforced. |
| 6 | Open redirect | **Mitigated** | `safeNext` validates `next` params; tested in `tests/security.test.ts`. | Low. |
| 7 | SSRF | **Not applicable / low** | Server fetches only fixed provider endpoints (Supabase, Resend, Postmark, Upstash); no user-supplied URLs are fetched. | Low. |
| 8 | Injection (SQL) | **Mitigated** | PostgREST query params; no string-concatenated SQL; identifiers validated/allowlisted. | Low. |
| 9 | File upload abuse | **Not applicable** | No upload surface (the unused upload route was removed). | None. |
| 10 | Secrets in client bundle / logs | **Mitigated** | No `NEXT_PUBLIC_` secrets; logs contain structured events, no credentials or full bodies. | Low — verify no future logging of bodies. |
| 11 | Security headers / CSP | **Partial** | Full header set present; CSP is report-only pending browser validation. | Medium until CSP enforced. |
| 12 | Error/data exposure | **Mitigated** | Generic client messages; upstream detail logged server-side only. | Low. |
| 13 | Dependency advisories | **Partial** | Production deps clean; dev-only ESLint toolchain has 5 high advisories (non-breaking fix unavailable). | Low (dev only). |
| 14 | Rate-limit key spoofing | **Mitigated** | `CLIENT_IP_HEADER` pins a trusted proxy header; fallback documented. | Medium until host proxy confirmed. |
| 15 | Email/signup abuse | **Mitigated** | Per-endpoint rate limits; generic signup errors. | Low. |

## Recommendations (priority order)

1. Confirm the hosting proxy's trusted IP header and set `CLIENT_IP_HEADER`.
2. Complete browser CSP validation, then enforce CSP.
3. Resolve or formally accept the dev-toolchain advisories.
4. Add secret scanning and dependency-update automation to CI (requires GitHub
   settings change — not done here).

## Explicitly not claimed

No penetration test, no live attack simulation, no browser validation, and no
backup-restore test has been performed.
