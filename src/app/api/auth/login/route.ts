import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, readJson, clientKey, rateLimit } from "@/lib/auth/security";
import { normalizeEmail } from "@/lib/auth/validation";
import { signIn } from "@/lib/auth/gotrue";
import { setSessionCookies } from "@/lib/auth/session";
import { ensureProfile, addAccountEvent } from "@/lib/auth/data";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "login"), 60_000, 10)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  let raw: unknown; try { raw = await readJson(request); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const email = normalizeEmail(body.email); const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ ok: false, message: "Enter your email and password." }, { status: 400 });
  const result = await signIn(email, password);
  if (!result.ok) return NextResponse.json({ ok: false, message: result.status === 503 ? "Authentication is temporarily unavailable." : "Incorrect email or password." }, { status: result.status === 503 ? 503 : 401 });
  if (!result.data.access_token || !result.data.refresh_token || !result.data.user) return NextResponse.json({ ok: false, message: "Authentication did not return a complete session." }, { status: 502 });
  await ensureProfile(result.data.user.id, typeof result.data.user.user_metadata?.full_name === "string" ? result.data.user.user_metadata.full_name : email.split("@")[0] ?? "");
  await addAccountEvent(result.data.user.id, "auth.signed_in");
  const response = NextResponse.json({ ok: true });
  setSessionCookies(response, result.data.access_token, result.data.refresh_token);
  return response;
}
