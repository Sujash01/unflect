/**
 * Admin audit logging.
 *
 * Reuses the existing `account_events` table (the audit trail that already exists)
 * rather than creating a parallel system. Security-relevant admin actions are
 * recorded with:
 *   - the acting admin   -> `actor_id`
 *   - the action type    -> `event` (e.g. `admin.enquiry.updated`)
 *   - the target resource-> `target_type` + `target_id`
 *   - a timestamp        -> `created_at` (set by the column default)
 *   - a minimal, safe payload -> `metadata`
 *
 * `user_id` is set to the acting admin so the existing NOT NULL foreign key to
 * `auth.users` is satisfied; the true subject of the action is `target_id`.
 *
 * Safety rules enforced here:
 *   - Passwords, tokens, service keys, auth headers and similar secrets are
 *     stripped from `metadata` before anything is written.
 *   - String values are capped to avoid storing large payloads.
 *   - A failed write is logged and reported as `{ ok: false }`; callers must not
 *     report the operation as successful when the audit record could not be
 *     persisted.
 */

import { insertRow } from "@/lib/supabase";

export type AdminAuditResult = { ok: true } | { ok: false };

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "access_token",
  "refresh_token",
  "secret",
  "authorization",
  "apikey",
  "api_key",
  "service_role",
  "servicekey",
  "session",
  "cookie",
]);

const MAX_STRING_LENGTH = 300;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) continue;
      out[key] = redact(entry);
    }
    return out;
  }
  if (typeof value === "string") return value.slice(0, MAX_STRING_LENGTH);
  return value;
}

export async function recordAdminAudit(params: {
  actorId: string;
  action: string;
  targetType: "enquiry" | "user";
  targetId: string;
  metadata?: Record<string, unknown>;
}): Promise<AdminAuditResult> {
  const result = await insertRow("account_events", {
    user_id: params.actorId,
    event: params.action,
    actor_id: params.actorId,
    target_type: params.targetType,
    target_id: params.targetId,
    metadata: redact(params.metadata ?? {}),
  });

  if (!result.ok) {
    // Never throw: the caller must decide how to surface the failure. The main
    // operation may have already succeeded, so this is logged, not swallowed.
    console.error(
      JSON.stringify({
        event: "admin_audit_write_failed",
        action: params.action,
        target_type: params.targetType,
        target: params.targetId,
      }),
    );
    return { ok: false };
  }

  return { ok: true };
}
