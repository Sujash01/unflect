import { NextResponse } from "next/server";

import { isSupabaseConfigured, pingTable } from "@/lib/supabase";

/**
 * GET /api/health
 *
 * Reports whether the backend can reach its database. Returns no credentials
 * or upstream error detail.
 *
 *   200 { ok: true,  database: "connected" | "not_configured" }
 *   503 { ok: false, database: "unreachable" }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, database: "not_configured" });
  }

  const result = await pingTable("enquiries");
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, database: "unreachable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, database: "connected" });
}
