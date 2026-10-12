import { NextResponse } from "next/server";

import { isSupabaseConfigured, pingTable } from "@/lib/supabase";

/**
 * GET /api/health
 *
 * Reports whether the backend can reach its database. Returns no credentials
 * or upstream error detail.
 *
 *   200 { ok: true,  database: "connected",   email: "configured" | "not_configured" }
 *   503 { ok: false, database: "not_configured" | "unreachable" }
 *
 * A missing database configuration is reported as unhealthy: enquiries cannot
 * be recorded without it, so monitoring must not treat the app as healthy.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, database: "not_configured" },
      { status: 503 },
    );
  }

  const result = await pingTable("enquiries");
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, database: "unreachable" },
      { status: 503 },
    );
  }

  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY || process.env.POSTMARK_SERVER_TOKEN,
  );

  return NextResponse.json({
    ok: true,
    database: "connected",
    email: emailConfigured ? "configured" : "not_configured",
  });
}
