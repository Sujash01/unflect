# Operations runbook

## Health check

`GET /api/health`

- `200 { ok: true, database: "connected", email: "configured" | "not_configured" }`
- `503 { ok: false, database: "not_configured" | "unreachable" }`

Point uptime monitoring at this endpoint. `503` means enquiries cannot be
recorded; treat it as an alert.

## Common situations

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Enquiry form returns "temporarily unable" (`503`) | Supabase not configured | Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. |
| Enquiry form returns an error (`500`) | Supabase unreachable or rejected the write | Check `/api/health` and the Supabase project status; inspect server logs for `project_enquiry_store_failed`. |
| Enquiries stored but nobody emailed | No email provider configured | Set `RESEND_API_KEY` or `POSTMARK_SERVER_TOKEN`. Logs show `project_enquiry_email_skipped`. |
| `/admin` redirects to `/account` | Not signed in as an allowlisted, confirmed admin | Confirm the email is verified and listed in `ADMIN_EMAILS`. |
| Rate-limit errors under real traffic | In-process limiter only | Configure `UPSTASH_REDIS_REST_URL`/`_TOKEN` for a shared store. |
| Rate limits seem to apply to the wrong client | Spoofed `x-forwarded-for` | Set `CLIENT_IP_HEADER` to the proxy's trusted IP header. **Hosting platform is unconfirmed — verify the proxy sets a trusted header before relying on per-client limits.** |

## Logs

Structured JSON events (grep-able):

- `project_enquiry` — enquiry stored (`delivery: "supabase"`).
- `project_enquiry_store_unavailable` / `project_enquiry_store_failed` — storage problems.
- `project_enquiry_email_dispatched` / `_skipped` / `_failed` — email outcome (`studioAccepted`, `clientAccepted`).

Logs never contain credentials or full submission bodies.

## Backups

Supabase point-in-time recovery and backups are managed in the Supabase
dashboard (outside this repo). Confirm backups are enabled for the environment
and that a restore path is documented and (ideally) tested in staging.

## Monitoring and alerts

- [ ] Uptime monitoring points at `GET /api/health`; alert on `503`.
- [ ] Error monitoring captures server-side exceptions (platform logs or an
      error tracker). Do **not** add a paid monitor without authorization.
- [ ] Structured JSON logs are queryable by `event` and `reference`.
- [ ] Alerts are routed to a real on-call channel, not a personal inbox.

## Incident response

1. **Detect** — alert fires (`/api/health` 503, error spike, or user report).
2. **Triage** — check `database` status in `/api/health`; inspect logs for
   `project_enquiry_store_*` and `project_enquiry_email_*`.
3. **Contain** — roll back the deployment (staging first); do not apply
   forward-fixes under pressure.
4. **Communicate** — record the incident, impact (especially any enquiry or
   email that may have been dropped), and resolution.
5. **Prevent** — add a regression test or alert so the same failure is caught.

## Request IDs

The app logs a stable enquiry `reference` (`UNF-…`) across the store, email, and
account views. Use it to trace a single submission end to end. No per-request
ID is currently emitted; add one to logs if deeper tracing is needed.

## Deploys

`npm run build` must pass. Apply database migrations **manually and deliberately**
before deploying code that depends on them — see
[database.md](database.md). Do not let migrations auto-apply in CI.
