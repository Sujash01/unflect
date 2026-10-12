-- Extend account_events to support auditable admin actions.
--
-- account_events already records account activity (actor = the account owner).
-- Admin actions need to record *who* performed the action (actor_id) and *what*
-- they acted on (target_type / target_id), because an admin may act on another
-- user or on an enquiry that has no owning user. These columns are additive and
-- nullable so existing rows and the existing account-activity feed are
-- unaffected. Idempotent and non-destructive. DO NOT apply automatically.

alter table public.account_events add column if not exists actor_id    uuid;
alter table public.account_events add column if not exists target_type text;
alter table public.account_events add column if not exists target_id    text;

comment on column public.account_events.actor_id    is 'User who performed a security-relevant action (set for admin audit events).';
comment on column public.account_events.target_type is 'Type of the acted-on resource: user | enquiry (set for admin audit events).';
comment on column public.account_events.target_id    is 'Identifier of the acted-on resource (set for admin audit events).';
