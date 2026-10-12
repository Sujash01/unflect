import { NextResponse, type NextRequest } from "next/server";

import { deliverEnquiry } from "@/lib/enquiry-delivery";
import { validateEnquiry } from "@/lib/enquiry";
import { enquiryReference } from "@/lib/utils";
import { clientKey, rateLimit, rejectCrossOrigin } from "@/lib/auth/security";
import { getRequestId } from "@/lib/request-id";

/**
 * POST /api/enquiries
 *
 * Accepts a project enquiry, validates it server-side (the client result is
 * never trusted), and hands it to the delivery adapter.
 *
 * Responses:
 *   202 — accepted and stored (email delivery is best-effort)
 *   400 — validation failed; `errors` maps field name to message
 *   413 — payload too large
 *   429 — rate limited (per client)
 *   500 — storage failed
 *   503 — the enquiry store is not configured; nothing was saved
 *
 * No personal data is echoed back beyond field-level validation messages.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  // Per-client limit so one visitor cannot block everybody else.
  if (await rateLimit(clientKey(request, "enquiry"), 60_000, 5)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, message: "Submission too large." },
      { status: 413 },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, message: "Submission too large." },
        { status: 413 },
      );
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }

  const result = validateEnquiry(raw);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", errors: result.errors },
      { status: 400 },
    );
  }

  const reference = enquiryReference();

  // Honeypot hit: acknowledge, deliver nothing, reveal nothing.
  if (result.disposition === "discard") {
    return NextResponse.json(
      { ok: true, reference, via: "discarded" },
      { status: 202 },
    );
  }

  const delivery = await deliverEnquiry(result.value, reference, {
    requestId: getRequestId(request),
  });

  if (!delivery.delivered) {
    const notConfigured = delivery.reason === "not_configured";
    return NextResponse.json(
      {
        ok: false,
        message: notConfigured
          ? "We are temporarily unable to record enquiries. Please email us directly and we will reply."
          : "Your enquiry could not be recorded. Please try again shortly.",
        reference,
      },
      { status: notConfigured ? 503 : 500 },
    );
  }

  return NextResponse.json(
    { ok: true, reference, via: delivery.via },
    { status: 202 },
  );
}

/** Explicit, rather than relying on an auto-generated 405. */
export function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
