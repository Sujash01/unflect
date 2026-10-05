# Unflect accounts setup

Unflect accounts use Supabase Auth through its REST API. No Supabase client SDK is required by the application.

## 1. Database

Run these in the same Supabase project, in order:

1. `supabase/schema.sql`
2. `supabase/accounts.sql`

The existing enquiries schema is intentionally unchanged.

## 2. Server environment

The account API uses the same two server-only variables already used by enquiries:

```env
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not expose the service-role key as `NEXT_PUBLIC_*`.

## 3. Supabase Auth

In Supabase Authentication settings:

- Enable Email provider.
- Configure the Site URL as `https://unflect.in` in production.
- Add the local callback URL `http://localhost:3000/auth/callback` while developing.
- Add `https://unflect.in/auth/callback` for production.
- Add `https://unflect.in/reset-password` if you customize recovery redirects.
- Configure SMTP for production email volume. Supabase's default mail service is intended for low-volume testing.

The app expects the standard GoTrue email links that return `access_token` and `refresh_token` in the URL hash. The `/auth/callback` client page immediately exchanges those values for httpOnly cookies and does not persist tokens in localStorage.

## 4. Production notes

- Use HTTPS.
- Review the legal pages with qualified counsel before launch.
- For high-volume deployments, move in-memory auth rate limits to a shared limiter.
- Consider a transactional email provider with a verified `@unflect.in` sender.
