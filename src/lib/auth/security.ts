import { NextRequest, NextResponse } from "next/server";

const LIMITS = new Map<string, number[]>();

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

export function rateLimit(key: string, windowMs = 60_000, max = 10): boolean {
  const now = Date.now();
  const current = LIMITS.get(key) ?? [];
  const fresh = current.filter((stamp) => stamp > now - windowMs);
  if (fresh.length === 0) {
    LIMITS.delete(key);
  }
  if (fresh.length >= max) {
    LIMITS.set(key, fresh);
    return true;
  }
  fresh.push(now);
  LIMITS.set(key, fresh);

  // Keep the in-memory limiter bounded on long-lived server processes.
  if (LIMITS.size > 5000) {
    for (const [entryKey, stamps] of LIMITS) {
      if (stamps.length === 0 || stamps.every((stamp) => stamp <= now - windowMs)) LIMITS.delete(entryKey);
      if (LIMITS.size <= 4000) break;
    }
  }
  return false;
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
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${forwarded || "unknown"}:${suffix}`;
}
