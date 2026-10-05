import { NextResponse, type NextRequest } from "next/server";
import { readSession, clearSessionCookies } from "@/lib/auth/session";
import { signIn, adminDeleteUser } from "@/lib/auth/gotrue";
import { rejectCrossOrigin, readJson, rateLimit, clientKey } from "@/lib/auth/security";
import { deleteProfileData } from "@/lib/auth/data";

export async function DELETE(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "delete-account"), 60_000, 3)) return NextResponse.json({ ok: false, message: "Too many attempts. Please wait." }, { status: 429 });
  const session = await readSession(); if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request, 4 * 1024); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const password = typeof body.password === "string" ? body.password : "";
  const confirmation = typeof body.confirmation === "string" ? body.confirmation : "";
  if (confirmation !== "DELETE") return NextResponse.json({ ok: false, message: "Type DELETE to confirm account removal." }, { status: 400 });
  const check = await signIn(session.user.email ?? "", password);
  if (!check.ok) return NextResponse.json({ ok: false, message: "Current password is incorrect." }, { status: 401 });
  const deleted = await adminDeleteUser(session.user.id);
  if (!deleted.ok) return NextResponse.json({ ok: false, message: "The account could not be deleted right now." }, { status: deleted.status === 503 ? 503 : 500 });
  await deleteProfileData(session.user.id);
  const response = NextResponse.json({ ok: true }); clearSessionCookies(response); return response;
}
