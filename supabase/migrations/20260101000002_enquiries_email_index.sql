-- Index on enquiries.email.
--
-- Justification: the account portal links a visitor's enquiries to their
-- account by matching `email` exactly (`getUserEnquiries` in
-- src/lib/auth/data.ts issues `enquiries?email=eq.<email>`). Without an index
-- this is a sequential scan. The index is additive and safe.

create index if not exists enquiries_email_idx on public.enquiries (email);
