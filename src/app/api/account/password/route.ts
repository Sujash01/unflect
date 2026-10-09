import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { updateUser } from "@/lib/auth/gotrue";
import { validatePassword } from "@/lib/auth/validation";
import { rejectCrossOrigin, readJson, rateLimit, clientKey } from "@/lib/auth/security";
import { addAccountEvent } from "@/lib/auth/data";

export async function PATCH(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "password"), 60_000, 5)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  const session = await readSession(); if (!session.user || !session.accessToken) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request, 4 * 1024); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const next = typeof body.newPassword === "string" ? body.newPassword : "";
  if (!current || !next) return NextResponse.json({ ok: false, message: "Enter your current and new password." }, { status: 400 });
  const passwordError = validatePassword(next); if (passwordError) return NextResponse.json({ ok: false, message: passwordError }, { status: 400 });
  // Re-authenticate by signing in with the current password.
  const { signIn } = await import("@/lib/auth/gotrue");
  const check = await signIn(session.user.email ?? "", current);
  if (!check.ok) return NextResponse.json({ ok: false, message: "Current password is incorrect." }, { status: 401 });
  const result = await updateUser(session.accessToken, { password: next });
  if (!result.ok) return NextResponse.json({ ok: false, message: "Password could not be changed." }, { status: result.status === 503 ? 503 : 400 });
  await addAccountEvent(session.user.id, "auth.password_changed");
  return NextResponse.json({ ok: true, message: "Password changed. Other sessions may need to sign in again." });
}
