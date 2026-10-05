import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { updateUser, signIn } from "@/lib/auth/gotrue";
import { normalizeEmail, validateEmail } from "@/lib/auth/validation";
import { rejectCrossOrigin, readJson, rateLimit, clientKey } from "@/lib/auth/security";
import { addAccountEvent } from "@/lib/auth/data";

export async function PATCH(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "email"), 60_000, 5)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  const session = await readSession(); if (!session.user || !session.accessToken) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request, 4 * 1024); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const email = normalizeEmail(body.email);
  const error = validateEmail(email); if (error) return NextResponse.json({ ok: false, message: error }, { status: 400 });
  if (!currentPassword) return NextResponse.json({ ok: false, message: "Confirm your current password." }, { status: 400 });
  const check = await signIn(session.user.email ?? "", currentPassword);
  if (!check.ok) return NextResponse.json({ ok: false, message: "Current password is incorrect." }, { status: 401 });
  const result = await updateUser(session.accessToken, { email });
  if (!result.ok) return NextResponse.json({ ok: false, message: "Email could not be changed." }, { status: result.status === 503 ? 503 : 400 });
  await addAccountEvent(session.user.id, "auth.email_change_requested");
  return NextResponse.json({ ok: true, message: "Check your new email address to confirm the change." });
}
