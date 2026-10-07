import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getProfile, getAccountEvents, getUserEnquiries } from "@/lib/auth/data";

export async function GET() {
  const session = await readSession(); if (!session.user) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const email = session.user.email ?? "";
  const [profile, events, enquiries] = await Promise.all([
    getProfile(session.user.id),
    getAccountEvents(session.user.id),
    session.user.email_confirmed_at && email
      ? getUserEnquiries(email)
      : Promise.resolve({ ok: true as const, data: [] }),
  ]);
  return NextResponse.json({
    ok: true,
    exportedAt: new Date().toISOString(),
    account: { id: session.user.id, email, createdAt: session.user.created_at ?? null },
    profile,
    securityEvents: events.ok ? events.data : [],
    enquiries: enquiries.ok ? enquiries.data : [],
  });
}
