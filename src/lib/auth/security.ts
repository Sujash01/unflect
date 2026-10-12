import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function rejectCrossOrigin(request: NextRequest): NextResponse | null {
  if (sameOrigin(request)) return null;
  return NextResponse.json({ ok: false, message: "Cross-origin request blocked." }, { status: 403 });
}

/** Returns `true` when the caller has exceeded the limit for `key`. */
export async function rateLimit(key: string, windowMs = 60_000, max = 10): Promise<boolean> {
  const result = await checkRateLimit(key, { windowMs, max });
  return result.limited;
}

export async function readJson(request: NextRequest, maxBytes = 16 * 1024): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  if (!text) return {};
  return JSON.parse(text) as unknown;
}

export function safeNext(value: string | null, fallback = "/account"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const parsed = new URL(value, "https://unflect.invalid");
    if (parsed.origin !== "https://unflect.invalid") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function clientKey(request: NextRequest, suffix: string): string {
  // Behind a proxy, set CLIENT_IP_HEADER to the header that carries the real
  // client IP (e.g. "cf-connecting-ip"). Only that header is trusted, so a
  // spoofed `x-forwarded-for` cannot rotate the rate-limit key. Without it we
  // fall back to the common platform headers, which assumes the host sets or
  // sanitizes them — verify this against the hosting provider before relying on
  // per-client limits in production.
  const trustedHeader = process.env.CLIENT_IP_HEADER?.trim();
  if (trustedHeader) {
    const value = request.headers.get(trustedHeader)?.trim();
    return `${value || "unknown"}:${suffix}`;
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = request.headers.get("x-real-ip")?.trim();
  const cloudflare = request.headers.get("cf-connecting-ip")?.trim();
  const ip = forwarded || real || cloudflare || "unknown";
  return `${ip}:${suffix}`;
}
