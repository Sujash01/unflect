import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, REFRESH_MAX_AGE, SESSION_MAX_AGE } from "./constants";
import { getUser, type AuthUser, refresh } from "./gotrue";

export async function readSession(): Promise<{ user: AuthUser | null; accessToken: string | null }> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value ?? null;
  if (!accessToken) return { user: null, accessToken: null };
  const result = await getUser(accessToken);
  if (!result.ok) return { user: null, accessToken: null };
  return { user: result.data, accessToken };
}

export function setSessionCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_COOKIE, accessToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: SESSION_MAX_AGE });
  response.cookies.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: REFRESH_MAX_AGE });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function refreshFromCookies(): Promise<{ ok: boolean; status?: number; accessToken?: string; refreshToken?: string }> {
  const jar = await cookies();
  const token = jar.get(REFRESH_COOKIE)?.value;
  if (!token) return { ok: false };
  const result = await refresh(token);
  if (!result.ok) return { ok: false, status: result.status };
  return { ok: true, accessToken: result.data.access_token, refreshToken: result.data.refresh_token };
}

export async function requirePageSession(nextPath: string): Promise<{ user: AuthUser; accessToken: string }> {
  const session = await readSession();
  if (session.user && session.accessToken) return { user: session.user, accessToken: session.accessToken };

  const jar = await cookies();
  if (jar.get(REFRESH_COOKIE)?.value) {
    return redirect(`/api/auth/refresh?next=${encodeURIComponent(nextPath)}`);
  }

  return redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}
