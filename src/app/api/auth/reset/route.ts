import { NextResponse, type NextRequest } from "next/server";
import { rejectCrossOrigin, readJson, clientKey, rateLimit } from "@/lib/auth/security";
import { validatePassword } from "@/lib/auth/validation";
import { updateUser, getUser } from "@/lib/auth/gotrue";
import { readSession, refreshFromCookies, clearSessionCookies } from "@/lib/auth/session";
import { addAccountEvent } from "@/lib/auth/data";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  if (await rateLimit(clientKey(request, "reset"), 60_000, 5)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Please try again shortly." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await readJson(request);
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const data = (raw as Record<string, unknown>) || {};
  const password = typeof data.password === "string" ? data.password : "";
  const clientToken = typeof data.accessToken === "string" && data.accessToken.trim() ? data.accessToken.trim() : null;

  const error = validatePassword(password);
  if (error) return NextResponse.json({ ok: false, message: error }, { status: 400 });

  let session = await readSession();
  let activeToken = session.accessToken;

  // 1. Try refreshing session from cookies if access token expired
  if (!session.user) {
    const refreshed = await refreshFromCookies();
    if (refreshed.ok && refreshed.accessToken) {
      const user = await getUser(refreshed.accessToken);
      if (user.ok) {
        session = { user: user.data, accessToken: refreshed.accessToken };
        activeToken = refreshed.accessToken;
      }
    }
  }

  // 2. Fall back to client-provided token (e.g. from recovery URL hash)
  if (!session.user && clientToken) {
    const user = await getUser(clientToken);
    if (user.ok) {
      session = { user: user.data, accessToken: clientToken };
      activeToken = clientToken;
    }
  }

  if (!session.user || !activeToken) {
    return NextResponse.json(
      { ok: false, message: "Your recovery session has expired or is invalid. Please request a new recovery link." },
      { status: 401 }
    );
  }

  const result = await updateUser(activeToken, { password });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message || "We could not update your password. Please start the recovery flow again." },
      { status: result.status === 503 ? 503 : 400 }
    );
  }

  await addAccountEvent(session.user.id, "auth.password_reset");
  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
