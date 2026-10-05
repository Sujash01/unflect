import { NextResponse } from "next/server";
import { readSession, refreshFromCookies, setSessionCookies } from "@/lib/auth/session";
import { getProfile } from "@/lib/auth/data";
import { getUser } from "@/lib/auth/gotrue";

export async function GET() {
  let session = await readSession();
  let refreshed = false;
  let refreshedTokens: { accessToken: string; refreshToken: string } | null = null;

  if (!session.user) {
    const refresh = await refreshFromCookies();
    if (refresh.ok && refresh.accessToken && refresh.refreshToken) {
      const user = await getUser(refresh.accessToken);
      if (user.ok) {
        session = { user: user.data, accessToken: refresh.accessToken };
        refreshed = true;
        refreshedTokens = { accessToken: refresh.accessToken, refreshToken: refresh.refreshToken };
      }
    }
  }

  if (!session.user) {
    const response = NextResponse.json(
      { ok: true, authenticated: false, user: null, settings: {} },
      { headers: { "Cache-Control": "no-store" } },
    );
    return response;
  }

  const profile = await getProfile(session.user.id);
  const response = NextResponse.json(
    {
      ok: true,
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        emailConfirmed: Boolean(session.user.email_confirmed_at),
      },
      settings: profile?.settings ?? {},
    },
    { headers: { "Cache-Control": "no-store" } },
  );

  if (refreshed && refreshedTokens) {
    setSessionCookies(response, refreshedTokens.accessToken, refreshedTokens.refreshToken);
  }

  return response;
}
