import { NextResponse, type NextRequest } from "next/server";
import { logout } from "@/lib/auth/gotrue";
import { clearSessionCookies, readSession } from "@/lib/auth/session";
import { rejectCrossOrigin } from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  const session = await readSession();
  if (session.accessToken) await logout(session.accessToken);
  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
