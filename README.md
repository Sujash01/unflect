# Unflect

> A modern digital studio focused on building thoughtful digital experiences, products, and systems.

Unflect is a creative software company built around a simple idea: solve the real problem first, then build the right software around it.

The site combines an editorial marketing experience with a lightweight account system powered by Supabase Auth and a server-side enquiry pipeline.

## ✦ Features

- Responsive multi-page studio website
- Services, work, process, about, and contact experiences
- Animated editorial interface with motion, custom cursor, smooth scrolling, and magnetic navigation
- Supabase-backed project enquiries
- Email/password account creation and sign-in
- Email verification
- Password recovery and reset
- Profile editing
- Account settings
- Password and email changes with re-authentication
- Account data export
- Permanent account deletion with explicit confirmation
- Private account activity log
- Account enquiry history matched to a confirmed email address
- Terms & Conditions and Privacy Policy pages
- Security headers
- Server-side validation, CSRF origin checks, rate limiting, and httpOnly session cookies
- Reduced-motion, cursor-effect, and smooth-scroll preferences
- SEO metadata, sitemap, and robots configuration

## 🧭 Pages

| Route | Purpose |
|---|---|
| `/` | Main Unflect experience |
| `/services` | Services overview |
| `/services/[slug]` | Individual service |
| `/work` | Selected work |
| `/work/[slug]` | Individual case study |
| `/process` | Working process |
| `/about` | About Unflect |
| `/contact` | Project enquiry |
| `/login` | Sign in |
| `/signup` | Create an account |
| `/forgot-password` | Request password recovery |
| `/reset-password` | Set a new password |
| `/account` | Account overview and enquiry history |
| `/profile` | Profile details |
| `/settings` | Experience, security, and account controls |
| `/privacy` | Privacy Policy |
| `/terms` | Terms & Conditions |

## 🛠️ Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Motion / Framer Motion
- Lenis
- Supabase Auth REST API
- Supabase PostgREST

The application deliberately does not require a Supabase JavaScript SDK. Authentication and database operations are performed from trusted Next.js server routes using Supabase's HTTP APIs.

## 🚀 Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run start
```

## 🔐 Environment

Copy `.env.example` to `.env.local` and provide the server-only Supabase credentials:

```env
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The service-role/secret key must never be exposed to the browser or prefixed with `NEXT_PUBLIC_`.

`.env.local` is intentionally ignored by Git.

## 🗄️ Supabase setup

Run these SQL files in the same Supabase project, in order:

```text
supabase/schema.sql
supabase/accounts.sql
```

`schema.sql` contains the existing `enquiries` table. `accounts.sql` adds:

- `profiles`
- `account_events`

Both account tables have Row Level Security enabled and no browser policies. The application performs authorization in server routes and uses the trusted server key for these operations.

See [`docs/account-setup.md`](docs/account-setup.md) for the complete Auth configuration.

## 🔑 Account architecture

Sessions are stored in secure `httpOnly` cookies:

```text
Browser
   │
   ├── email/password
   │
   ▼
Next.js /api/auth/*
   │
   ▼
Supabase Auth (GoTrue)
   │
   ├── access token
   └── refresh token
          │
          ▼
      httpOnly cookies
```

Tokens are never stored in `localStorage`.

The public layout remains cookie-independent so the existing marketing pages retain their static-friendly architecture. The header asks `/api/auth/session` from a small client component to decide whether to show Sign in or Account.

## 📬 Enquiries

The existing enquiry pipeline remains separate from authentication:

```text
Contact form
    ↓
POST /api/enquiries
    ↓
Validation + honeypot + rate limit
    ↓
Existing delivery adapter
    ↓
Supabase enquiries table
```

Account history only reads enquiries whose submitted email matches the user's **confirmed** account email. It does not change the enquiry submission pipeline.

## 🛡️ Security notes

The account layer includes:

- httpOnly, SameSite cookies
- Same-origin checks on state-changing API routes
- Request-size limits
- Per-route in-memory rate limits
- Open-redirect-safe account navigation
- Generic password-recovery responses to reduce account enumeration
- Re-authentication before password/email changes
- Explicit `DELETE` confirmation plus password before account deletion
- Server-side validation
- No browser access to the service-role key
- RLS enabled on private account tables
- Security-focused HTTP headers

For a multi-instance production deployment, move in-memory rate limiting to a shared store.

## ⚖️ Legal pages

The included Terms & Conditions and Privacy Policy are implementation-aware starting points, not legal advice. They should be reviewed by qualified counsel before production use.

## 📱 Accessibility

The interface supports keyboard navigation, visible focus states, semantic controls, responsive layouts, and reduced-motion behavior.

Account settings additionally let signed-in users reduce motion, disable the custom cursor, or disable enhanced smooth scrolling.

## 📌 Status

**Active development.**

Unflect is evolving as new services, projects, account features, and product capabilities are added.

---

© Unflect
