import { NextResponse, type NextRequest } from "next/server";

import { deliverEnquiry } from "@/lib/enquiry-delivery";
import { validateEnquiry } from "@/lib/enquiry";
import { enquiryReference } from "@/lib/utils";

/**
 * POST /api/enquiries
 *
 * Accepts a project enquiry, validates it server-side (the client result is
 * never trusted), and hands it to the delivery adapter.
 *
 * Responses:
 *   202 \u2014 accepted and queued for delivery
 *   400 \u2014 validation failed; `errors` maps field name to message
 *   413 \u2014 payload too large
 *   429 \u2014 rate limited
 *   500 \u2014 delivery failed
 *
 * No personal data is echoed back beyond field-level validation messages.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

/** In-memory sliding window. Sized for a shared office IP, not for a single user. */
const RATE_LIMIT = { windowMs: 60_000, max: 10 };
const hits: number[] = [];

function rateLimited(now: number): boolean {
  const cutoff = now - RATE_LIMIT.windowMs;
  while (hits.length > 0 && (hits[0] ?? 0) < cutoff) hits.shift();
  if (hits.length >= RATE_LIMIT.max) return true;
  hits.push(now);
  return false;
}

export async function POST(request: NextRequest) {
  if (rateLimited(Date.now())) {
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

  try {
    const delivery = await deliverEnquiry(result.value, reference);

    if (!delivery.delivered) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Your enquiry could not be delivered. Please try again shortly.",
          reference,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, reference, via: delivery.via },
      { status: 202 },
    );
  } catch (error) {
    // Never surface internal error detail to the client.
    console.error("[enquiries] delivery failed", {
      reference,
      error: error instanceof Error ? error.message : "unknown",
    });

    return NextResponse.json(
      {
        ok: false,
        message: "Your enquiry could not be delivered. Please try again shortly.",
        reference,
      },
      { status: 500 },
    );
  }
}

/** Explicit, rather than relying on an auto-generated 405. */
export function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
