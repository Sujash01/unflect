import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, safeNext } from "@/lib/auth/security";
import { refreshFromCookies, setSessionCookies, clearSessionCookies } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const result = await refreshFromCookies();
  if (!result.ok || !result.accessToken || !result.refreshToken) {
    if (result.status === 503) return NextResponse.json({ ok: false, temporary: true }, { status: 503 });
    const response = NextResponse.json({ ok: false }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookies(response, result.accessToken, result.refreshToken);
  return response;
}


export async function GET(request: NextRequest) {
  const result = await refreshFromCookies();
  const next = safeNext(new URL(request.url).searchParams.get("next"), "/account");

  if (!result.ok || !result.accessToken || !result.refreshToken) {
    const response = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url));
    if (result.status !== 503) clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  setSessionCookies(response, result.accessToken, result.refreshToken);
  return response;
}
