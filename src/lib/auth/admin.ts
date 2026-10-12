/**
 * Admin authorization utilities.
 *
 * Admin privileges are NEVER granted from a hard-coded email or from any
 * user-writable data (profile, settings, request payload). A user is an admin
 * only when ALL of the following hold:
 *
 *   1. They have an authenticated session (checked by the caller).
 *   2. Their email address has been confirmed (`email_confirmed_at` set).
 *   3. Their email appears in the server-only `ADMIN_EMAILS` allowlist.
 *
 * `ADMIN_EMAILS` is a comma-separated list configured in the deployment
 * environment (never `NEXT_PUBLIC_`). It is empty by default, so a fresh
 * deployment grants nobody admin access until an operator opts in.
 */

export type AdminCandidate =
  | { email?: string | null; email_confirmed_at?: string | null }
  | null
  | undefined;

function configuredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);
}

export function isAdmin(user: AdminCandidate): boolean {
  if (!user || typeof user.email !== "string") return false;
  if (!user.email_confirmed_at) return false;
  const email = user.email.trim().toLowerCase();
  if (!email) return false;
  return configuredAdminEmails().includes(email);
}

export async function requireAdmin(user: AdminCandidate): Promise<void> {
  if (!isAdmin(user)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
