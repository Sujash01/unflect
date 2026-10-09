/**
 * Admin authorization utilities
 */

const ADMIN_EMAILS = ["team@unflect.in"];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export async function requireAdmin(email: string | null | undefined) {
  if (!isAdmin(email)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
