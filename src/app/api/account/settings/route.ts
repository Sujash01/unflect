import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getProfile, ensureProfile, updateSettings } from "@/lib/auth/data";
import { rejectCrossOrigin, readJson } from "@/lib/auth/security";

const ALLOWED = ["reducedMotion", "cursorEffects", "smoothScroll"] as const;

type SettingKey = (typeof ALLOWED)[number];

export async function GET() {
  const session = await readSession(); if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const profile = await ensureProfile(session.user.id, session.user.email?.split("@")[0] ?? "");
  return NextResponse.json({ ok: true, settings: profile?.settings ?? {} });
}

export async function PATCH(request: NextRequest) {
  const blocked = rejectCrossOrigin(request); if (blocked) return blocked;
  const session = await readSession(); if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  let raw: unknown; try { raw = await readJson(request, 4 * 1024); } catch { return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 }); }
  const incoming = (raw as Record<string, unknown>).settings;
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) return NextResponse.json({ ok: false, message: "Invalid settings." }, { status: 400 });
  const current = (await getProfile(session.user.id))?.settings ?? {};
  const next: Record<string, unknown> = { ...current };
  for (const key of ALLOWED) if (key in incoming && typeof (incoming as Record<string, unknown>)[key] === "boolean") next[key] = (incoming as Record<string, unknown>)[key];
  if (!Object.keys(next).length && Object.keys(incoming).length) return NextResponse.json({ ok: false, message: "No supported settings were provided." }, { status: 400 });
  const ok = await updateSettings(session.user.id, next); if (!ok) return NextResponse.json({ ok: false, message: "Settings could not be saved." }, { status: 503 });
  return NextResponse.json({ ok: true, settings: next });
}
