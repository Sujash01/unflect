import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { cleanText, validateName } from "@/lib/auth/validation";
import { getProfile, ensureProfile, updateProfile, addAccountEvent } from "@/lib/auth/data";
import { rejectCrossOrigin, readJson } from "@/lib/auth/security";

export async function GET() {
  const session = await readSession();
  if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const profile = await ensureProfile(session.user.id, session.user.email?.split("@")[0] ?? "");
  return NextResponse.json({ ok: true, profile });
}

export async function PATCH(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  const session = await readSession(); if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request, 8 * 1024); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const body = raw as Record<string, unknown>;
  const name = cleanText(body.display_name, 100); const nameError = validateName(name);
  if (nameError) return NextResponse.json({ ok: false, message: nameError }, { status: 400 });
  const bio = cleanText(body.bio, 500);
  const avatarUrl = cleanText(body.avatar_url, 500);
  if (avatarUrl && !/^https:\/\//i.test(avatarUrl)) return NextResponse.json({ ok: false, message: "Avatar URL must use HTTPS." }, { status: 400 });
  const ok = await updateProfile(session.user.id, { display_name: name, bio, avatar_url: avatarUrl });
  if (!ok) return NextResponse.json({ ok: false, message: "Profile could not be saved." }, { status: 503 });
  await addAccountEvent(session.user.id, "profile.updated");
  return NextResponse.json({ ok: true, profile: await getProfile(session.user.id) });
}
