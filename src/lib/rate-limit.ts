/**
 * Rate limiting.
 *
 * Uses Upstash Redis (over REST, via `fetch` — no SDK dependency) when the
 * deployment provides `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
 * That store is shared and durable across serverless instances, which is what
 * makes per-client limits meaningful on platforms like Vercel.
 *
 * When Upstash is not configured, an in-process sliding window is used so the
 * application still works locally and in single-instance deployments. That
 * fallback is NOT shared across instances and is documented as such.
 *
 * Callers must key on a per-client value (see `clientKey`) so that one visitor
 * cannot exhaust a limit for everybody.
 */

export type RateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const MEMORY = new Map<string, number[]>();

function upstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

export function isSharedRateLimitConfigured(): boolean {
  return upstashConfig() !== null;
}

async function incrementUpstash(
  key: string,
  windowMs: number,
): Promise<number | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, windowMs],
      ]),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as Array<{ result?: number }>;
    const count = payload?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function incrementMemory(key: string, windowMs: number): number {
  const now = Date.now();
  const cutoff = now - windowMs;
  const current = (MEMORY.get(key) ?? []).filter((stamp) => stamp > cutoff);
  current.push(now);
  MEMORY.set(key, current);

  // Keep the fallback bounded on long-lived processes.
  if (MEMORY.size > 10_000) {
    for (const [entryKey, stamps] of MEMORY) {
      if (stamps.length === 0 || stamps[stamps.length - 1]! <= cutoff) MEMORY.delete(entryKey);
      if (MEMORY.size <= 8_000) break;
    }
  }
  return current.length;
}

export async function checkRateLimit(
  key: string,
  { windowMs = 60_000, max = 10 }: { windowMs?: number; max?: number } = {},
): Promise<RateLimitResult> {
  const upstream = await incrementUpstash(key, windowMs);
  const count = upstream ?? incrementMemory(key, windowMs);

  if (count > max) {
    return { limited: true, remaining: 0, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }
  return { limited: false, remaining: Math.max(0, max - count), retryAfterSeconds: 0 };
}

/** Test-only helper so suites can reset the in-memory fallback. */
export function resetMemoryRateLimit(): void {
  MEMORY.clear();
}
