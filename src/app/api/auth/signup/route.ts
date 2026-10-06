import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, readJson, clientKey, rateLimit } from "@/lib/auth/security";
import { normalizeEmail, validateEmail, validateName, validatePassword } from "@/lib/auth/validation";
import { signUp } from "@/lib/auth/gotrue";
import { setSessionCookies } from "@/lib/auth/session";
import { addAccountEvent, ensureProfile } from "@/lib/auth/data";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "signup"), 60_000, 5)) return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  let raw: unknown;
  try { raw = await readJson(request); } catch (e) { return NextResponse.json({ ok: false, message: e instanceof Error && e.message === "PAYLOAD_TOO_LARGE" ? "Request too large." : "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const emailError = validateEmail(email), passwordError = validatePassword(password), nameError = validateName(name);
  if (emailError || passwordError || nameError) return NextResponse.json({ ok: false, message: emailError ?? passwordError ?? nameError ?? "Check the highlighted fields.", errors: { email: emailError, password: passwordError, name: nameError } }, { status: 400 });
  const origin = new URL(request.url).origin;
  const result = await signUp(email, password, name, `${origin}/auth/callback`);
  if (!result.ok) {
    console.error("[signup] Supabase error:", { status: result.status, message: result.message });
    const message =
      result.status === 422
        ? "That email address is already registered or cannot be used."
        : result.status === 503
          ? "Authentication is temporarily unavailable."
          : result.message || "We could not create your account.";

    return NextResponse.json(
      { ok: false, message },
      { status: result.status === 503 ? 503 : 400 },
    );
  }
  if (result.data.user) {
    await ensureProfile(result.data.user.id, name);
    await addAccountEvent(result.data.user.id, "account.created");
  }
  const response = NextResponse.json({ ok: true, needsVerification: !result.data.access_token, message: result.data.access_token ? "Account created." : "Check your email to verify your account." }, { status: 201 });
  if (result.data.access_token && result.data.refresh_token) setSessionCookies(response, result.data.access_token, result.data.refresh_token);
  return response;
}
