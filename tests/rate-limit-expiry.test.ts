import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, resetMemoryRateLimit } from "@/lib/rate-limit";

beforeEach(() => {
  vi.useFakeTimers();
  resetMemoryRateLimit();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit expiry (in-memory fallback)", () => {
  it("forgets hits once the window has fully elapsed", async () => {
    const key = "test:expiry";
    const opts = { windowMs: 60_000, max: 2 };

    expect((await checkRateLimit(key, opts)).limited).toBe(false);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);
    expect((await checkRateLimit(key, opts)).limited).toBe(true);

    // Advance past the window: the old hits expire.
    await vi.advanceTimersByTimeAsync(60_001);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);
  });

  it("uses a sliding window so old stamps age out", async () => {
    const key = "test:sliding";
    const opts = { windowMs: 10_000, max: 2 };

    await vi.setSystemTime(0);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);

    await vi.setSystemTime(6_000);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);

    // At 11s the first hit (t=0) is outside the window.
    await vi.setSystemTime(11_000);
    expect((await checkRateLimit(key, opts)).limited).toBe(false);

    // Two hits inside the latest window now block.
    await vi.setSystemTime(11_500);
    expect((await checkRateLimit(key, opts)).limited).toBe(true);
  });
});
