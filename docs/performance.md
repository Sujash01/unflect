# Performance validation plan

A practical plan for measuring the application's real performance. **No
benchmark results are claimed here** — this is the procedure to follow when a
staging environment becomes available. Do not load-test production.

## What to measure

| Area | Routes | Metrics |
| --- | --- | --- |
| Marketing pages | `/`, `/about`, `/services`, `/services/[slug]`, `/work`, `/work/[slug]`, `/process` | p50/p95 LCP, TTFB, error rate |
| Contact form | `/contact` + `POST /api/enquiries` | p50/p95 response time, success rate |
| Auth | `/login`, `/signup`, `POST /api/auth/*` | p50/p95 response time, error rate |
| Account/admin | `/account`, `/admin`, `/api/admin/*` | p50/p95 response time (authenticated) |
| Static assets | `/_next/static/*`, images | cache hit rate, `Cache-Control` correctness |

## Local checks (no staging needed)

- [x] `npm run build` succeeds; 50 static pages generated.
- [x] `scripts/test-routes.mjs` verifies routes, redirects, canonical tags.
- [ ] Confirm `Cache-Control: no-store` on `/api/{auth,account,admin}` and
      `/account`, `/admin`, `/settings` (see `next.config.mjs`); confirm static
      assets remain cacheable.
- [ ] Run a local Lighthouse pass (if tooling is available) on `/` and `/contact`
      for a baseline — record, do not invent, numbers.

## Staging measurements (when available)

1. Deploy to staging with production-like env (Supabase, email, Upstash).
2. Warm up, then measure with a lightweight tool (e.g. `k6`, `autocannon`, or
   the platform's analytics). Keep volume modest; do not load-test production.
3. Record p50/p95 latency and error rate for each route above.
4. Check image loading (Next.js `next/image` optimization) and responsive layout
   at mobile/desktop widths.
5. Review database query performance (Supabase dashboard → Query Performance) for
   the enquiries/profiles/events queries; confirm indexes are used.

## Pass criteria (proposed)

- p95 TTFB < 800 ms for marketing pages; p95 API response < 1.5 s.
- Error rate < 1% under modest staging load.
- No unbounded queries; all list endpoints paginated.
- Sensitive responses carry `Cache-Control: no-store`.

## Status

**Not measured.** Local build and route checks pass; no staging environment or
load test has been run.
