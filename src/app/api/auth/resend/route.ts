import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, readJson, clientKey, rateLimit } from "@/lib/auth/security";
import { normalizeEmail, validateEmail } from "@/lib/auth/validation";
import { resendVerification } from "@/lib/auth/gotrue";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  if (rateLimit(clientKey(request, "resend"), 60_000, 3)) return NextResponse.json({ ok: false, message: "Please wait before requesting another email." }, { status: 429 });
  let raw: unknown; try { raw = await readJson(request); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const email = normalizeEmail((raw as Record<string, unknown>).email); if (validateEmail(email)) return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  const result = await resendVerification(email, `${new URL(request.url).origin}/auth/callback`);
  if (!result.ok && result.status === 503) return NextResponse.json({ ok: false, message: "Authentication is temporarily unavailable." }, { status: 503 });
  return NextResponse.json({ ok: true, message: "If the account exists, a new verification email has been sent." });
}
