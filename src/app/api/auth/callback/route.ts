import { NextResponse, type NextRequest } from "next/server";
import { setSessionCookies } from "@/lib/auth/session";
import { getUser } from "@/lib/auth/gotrue";
import { ensureProfile, addAccountEvent } from "@/lib/auth/data";
import { rejectCrossOrigin, safeNext } from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const data = body as Record<string, unknown>;
  const accessToken = typeof data.access_token === "string" ? data.access_token : "";
  const refreshToken = typeof data.refresh_token === "string" ? data.refresh_token : "";
  if (!accessToken || !refreshToken) return NextResponse.json({ ok: false, message: "Invalid authentication callback." }, { status: 400 });
  const user = await getUser(accessToken); if (!user.ok) return NextResponse.json({ ok: false, message: "Authentication callback expired." }, { status: 401 });
  const name = typeof user.data.user_metadata?.full_name === "string" ? user.data.user_metadata.full_name : user.data.email?.split("@")[0] ?? "";
  await ensureProfile(user.data.id, name);
  await addAccountEvent(user.data.id, "auth.callback");
  const response = NextResponse.json({ ok: true, next: safeNext(typeof data.next === "string" ? data.next : null, "/account") });
  setSessionCookies(response, accessToken, refreshToken);
  return response;
}
