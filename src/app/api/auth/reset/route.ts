import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, readJson, clientKey, rateLimit } from "@/lib/auth/security";
import { validatePassword } from "@/lib/auth/validation";
import { updateUser } from "@/lib/auth/gotrue";
import { readSession, clearSessionCookies } from "@/lib/auth/session";
import { addAccountEvent } from "@/lib/auth/data";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "reset"), 60_000, 5)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  const session = await readSession(); if (!session.user || !session.accessToken) return NextResponse.json({ ok: false, message: "Your recovery session has expired. Start again." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const password = typeof (raw as Record<string, unknown>).password === "string" ? (raw as Record<string, string>).password : "";
  const error = validatePassword(password); if (error) return NextResponse.json({ ok: false, message: error }, { status: 400 });
  const result = await updateUser(session.accessToken, { password });
  if (!result.ok) return NextResponse.json({ ok: false, message: "We could not update your password. Please start the recovery flow again." }, { status: result.status === 503 ? 503 : 400 });
  await addAccountEvent(session.user.id, "auth.password_reset");
  const response = NextResponse.json({ ok: true }); clearSessionCookies(response); return response;
}
