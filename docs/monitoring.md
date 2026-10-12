# Monitoring and alerts

Distinguishes monitoring that is **active** (runs today) from monitoring that is
**proposed** (requires configuration, and in some cases authorization).

## Active today

- **Health endpoint** — `GET /api/health` returns `200` (database connected) or
  `503` (`not_configured` / `unreachable`). See [operations.md](operations.md).
- **Structured logs** — JSON events for enquiry storage, email outcome and
  errors (`project_enquiry*`). No credentials or full bodies are logged.
- **Build-time checks** — CI runs lint, typecheck, tests and build on every push
  and PR (see `.github/workflows/ci.yml`).

## Proposed (not yet active)

| Capability | Tool/approach | Status |
| --- | --- | --- |
| Uptime check on `/api/health` | External monitor (e.g. Better Stack, UptimeRobot, platform healthcheck) | **Proposed** — needs an account; do not create without authorization. |
| Error-rate / latency monitoring | Platform logs or an error tracker (e.g. Sentry) | **Proposed** — needs an account and DSN env var. |
| Database / email failure visibility | Alert on `project_enquiry_store_failed` / `project_enquiry_email_failed` log events | **Proposed** — needs log-based alerting. |
| Actionable alerts + escalation | Route alerts to a real on-call channel | **Proposed** — needs a destination. |
| Backup / restore verification | Periodic restore test in staging | **Proposed** — needs a staging database. |

## Runbooks

See [operations.md](operations.md) for the incident-response flow and common
situations. Key runbooks:

- **Enquiry not recording** — check `/api/health`; inspect `project_enquiry_store_*`.
- **Email not sending** — check provider config; inspect `project_enquiry_email_*`.
- **Admin locked out** — verify `ADMIN_EMAILS` and email confirmation.
- **Dependency vulnerability** — run `npm audit --omit=dev`; review before upgrading.

## Backup and disaster recovery

- Backups are managed in the Supabase dashboard (outside this repo).
- A restore procedure is documented in [database.md](database.md) but **has not
  been tested**. A staging restore test is recommended before production.

## Proposed alert thresholds (configure once monitoring exists)

| Signal | Threshold (suggested) | Action |
| --- | --- | --- |
| `/api/health` | `503` for 2 consecutive checks | Page on-call; treat as incident. |
| Error rate | > 1% of requests over 5 min | Investigate logs. |
| p95 latency | > 1.5 s (API) / > 800 ms TTFB (pages) over 10 min | Review queries and dependencies. |
| Enquiry store failures | Any `project_enquiry_store_failed` spike | Check Supabase; see runbook. |
| Email failures | Any `project_enquiry_email_failed` spike | Check provider; see runbook. |
| Dependency advisory | Any production vulnerability | Review `npm audit --omit=dev`. |

## Incident response (summary)

Full flow in [operations.md](operations.md). Short version: **Detect → Triage →
Contain → Communicate → Prevent.** Capture the request id (`x-request-id`) from
logs to trace any affected submission.

## Environment separation

- Staging and production must use **separate** deployments, Supabase projects,
  Upstash databases, email config and `ADMIN_EMAILS`.
- Never use production credentials as staging credentials.
- Staging is disposable; production changes require explicit authorization.

## Error-tracking integration (proposed, not configured)

An external error tracker (e.g. Sentry) would capture uncaught exceptions with
context. To integrate you would need to:

1. Choose a tracker and create a project (external account — **not done**).
2. Add its SDK and set the DSN via an environment variable (e.g. `SENTRY_DSN`).
3. Confirm the tracker excludes PII and does not capture request bodies or auth
   headers (the app currently logs structured events; a tracker must be
   configured to redact).
4. Verify by triggering a test error in staging.

Until a tracker is configured and verified, error visibility is limited to
platform logs. **No external tracker is active.**

## What cannot be confirmed from the repository

Whether any external uptime monitor, error tracker, or alert destination is
configured cannot be determined from these files. Treat all "Proposed" rows as
not active until verified in the deployment environment.
