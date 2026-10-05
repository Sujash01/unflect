# Backend setup (Supabase)

1. Create a project at supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. Project Settings → API. Copy the Project URL and the `service_role` key into `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Restart `npm run dev`. Open `/api/health`; it should return `"database": "connected"`.
5. Submit the contact form; the row appears in Table Editor → `enquiries`.

On Vercel (or any host), add the same two variables in the project's environment settings.
The service-role key is server-only. Never prefix it with `NEXT_PUBLIC_`.
Until the variables are set, enquiries fall back to a server-log line and the site works as before.
