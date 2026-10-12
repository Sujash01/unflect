# System design

A concise description of what UNFLECT is and is not, based on the actual
application in this repository.

## Purpose

UNFLECT is a marketing website and client portal for a software studio. The
public site presents services, work and a process, and lets prospective clients
submit a project enquiry. Registered users can sign in, manage their profile and
credentials, and see the enquiries linked to their email. A small allowlisted
admin team can review enquiries and manage user accounts.

## Users

- **Visitors** — read public pages and submit an enquiry.
- **Registered users** — manage their own profile, credentials and data export.
- **Admins** — a fixed, server-side allowlist of staff emails. No self-service
  roles, teams or organizations.

## Core workflows

1. **Enquiry** — visitor fills the contact form → validated server-side → stored
   in Supabase → best-effort studio notification + submitter receipt.
2. **Auth** — sign up (email confirmation), log in, log out, password reset.
3. **Account** — view linked enquiries, update profile, change email/password,
   delete account, export data.
4. **Admin** — list enquiries/profiles/events, update enquiry status and profile
   fields, block/unblock users, delete enquiries/users.

## Data sensitivity

| Data | Sensitivity | Notes |
| --- | --- | --- |
| Enquiries (name, company, email, project detail) | Confidential | Stored with RLS enabled, no policies; server-only access. |
| Profiles, account events | Personal data | Keyed by `auth.users.id`; account deletion cascades. |
| Sessions | Sensitive | httpOnly, sameSite=lax, Secure in production. |
| Admin allowlist | Server-only | `ADMIN_EMAILS`; empty by default. |

## Availability expectations

Not formally defined. The studio is small; the site is informational with a
contact form rather than a high-throughput product. See open questions.

## Out of scope

Billing/subscriptions, organizations/teams, team invitations, public API,
multi-tenancy, CMS, internationalisation, and any self-service admin features.

## Open questions (do not invent answers)

- Expected traffic volume and peak concurrency (drives rate-limit and scaling
  choices).
- Availability SLA and recovery-time/recovery-point objectives.
- Data-retention policy for enquiries and account events.
- Which email provider is canonical (Resend vs Postmark) and its sending domain.
- Whether a CDN/caching layer is required for the marketing site.
- Hosting platform and its trusted proxy IP header (affects rate limiting).
