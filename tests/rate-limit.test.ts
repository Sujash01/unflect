import { beforeEach, describe, expect, it } from "vitest";

import { checkRateLimit, resetMemoryRateLimit } from "@/lib/rate-limit";

beforeEach(() => {
  resetMemoryRateLimit();
});

describe("checkRateLimit (in-memory fallback)", () => {
  it("allows requests up to the limit, then blocks", async () => {
    const key = "test:burst";
    const opts = { windowMs: 60_000, max: 3 };

    expect((await checkRateLimit(key, opts)).limited).toBe(false);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);

    const blocked = await checkRateLimit(key, opts);
    expect(blocked.limited).toBe(true);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isolates keys so one client cannot exhaust another", async () => {
    const opts = { windowMs: 60_000, max: 1 };
    expect((await checkRateLimit("client:a", opts)).limited).toBe(false);
    expect((await checkRateLimit("client:b", opts)).limited).toBe(false);
  });

  it("resets via the test helper", async () => {
    const opts = { windowMs: 60_000, max: 1 };
    await checkRateLimit("client:a", opts);
    resetMemoryRateLimit();
    expect((await checkRateLimit("client:a", opts)).limited).toBe(false);
  });
});
