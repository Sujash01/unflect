import { NextResponse, type NextRequest } from "next/server";
import { setSessionCookies } from "@/lib/auth/session";
import { getUser, verifyTokenHash, exchangeCode } from "@/lib/auth/gotrue";
import { ensureProfile, addAccountEvent } from "@/lib/auth/data";
import { rejectCrossOrigin, safeNext } from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const data = (body as Record<string, unknown>) || {};
  let accessToken = typeof data.access_token === "string" ? data.access_token.trim() : "";
  let refreshToken = typeof data.refresh_token === "string" ? data.refresh_token.trim() : "";
  const tokenHash = typeof data.token_hash === "string" ? data.token_hash.trim() : "";
  const code = typeof data.code === "string" ? data.code.trim() : "";
  const type = (typeof data.type === "string" ? data.type : "recovery") as "recovery" | "signup" | "email";

  // 1. If token_hash provided, verify with GoTrue
  if (tokenHash && !accessToken) {
    const verified = await verifyTokenHash(tokenHash, type);
    if (!verified.ok) {
      return NextResponse.json({ ok: false, message: verified.message || "Invalid or expired recovery link." }, { status: 400 });
    }
    accessToken = verified.data.access_token;
    refreshToken = verified.data.refresh_token;
  }

  // 2. If code provided, exchange with GoTrue
  if (code && !accessToken) {
    const exchanged = await exchangeCode(code);
    if (!exchanged.ok) {
      return NextResponse.json({ ok: false, message: exchanged.message || "Invalid or expired authentication code." }, { status: 400 });
    }
    accessToken = exchanged.data.access_token;
    refreshToken = exchanged.data.refresh_token;
  }

  if (!accessToken) {
    return NextResponse.json({ ok: false, message: "Invalid authentication callback." }, { status: 400 });
  }

  const user = await getUser(accessToken);
  if (!user.ok) {
    return NextResponse.json({ ok: false, message: "Authentication callback expired or invalid." }, { status: 401 });
  }

  const name = typeof user.data.user_metadata?.full_name === "string"
    ? user.data.user_metadata.full_name
    : user.data.email?.split("@")[0] ?? "";

  await ensureProfile(user.data.id, name);
  await addAccountEvent(user.data.id, "auth.callback");

  const nextTarget = safeNext(typeof data.next === "string" ? data.next : null, "/account");
  const response = NextResponse.json({ ok: true, next: nextTarget, accessToken });
  setSessionCookies(response, accessToken, refreshToken || accessToken);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const nextParam = safeNext(searchParams.get("next"), "/account");
  const error = searchParams.get("error_description") || searchParams.get("error");
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");
  const type = (searchParams.get("type") || "recovery") as "recovery" | "signup" | "email";

  if (error) {
    const redirectUrl = new URL(nextParam, request.url);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }

  let accessToken = "";
  let refreshToken = "";

  if (tokenHash) {
    const verified = await verifyTokenHash(tokenHash, type);
    if (verified.ok) {
      accessToken = verified.data.access_token;
      refreshToken = verified.data.refresh_token;
    }
  } else if (code) {
    const exchanged = await exchangeCode(code);
    if (exchanged.ok) {
      accessToken = exchanged.data.access_token;
      refreshToken = exchanged.data.refresh_token;
    }
  }

  if (accessToken) {
    const user = await getUser(accessToken);
    if (user.ok) {
      const name = typeof user.data.user_metadata?.full_name === "string"
        ? user.data.user_metadata.full_name
        : user.data.email?.split("@")[0] ?? "";
      await ensureProfile(user.data.id, name);
      await addAccountEvent(user.data.id, "auth.callback");
      const response = NextResponse.redirect(new URL(nextParam, request.url));
      setSessionCookies(response, accessToken, refreshToken || accessToken);
      return response;
    }
  }

  // Fallback to the client callback page to process any hash fragment
  return NextResponse.redirect(new URL(`/auth/callback?next=${encodeURIComponent(nextParam)}`, request.url));
}
