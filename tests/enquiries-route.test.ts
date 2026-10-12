import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { resetMemoryRateLimit } from "@/lib/rate-limit";

const supabase = vi.hoisted(() => ({
  configured: true,
  insertOk: true,
}));

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => supabase.configured,
  insertRow: async () =>
    supabase.insertOk ? { ok: true as const } : { ok: false as const, status: 500, message: "boom" },
  selectRows: async () => ({ ok: true as const, data: [] }),
  selectPaged: async () => ({ ok: true as const, data: [], count: 0 }),
  updateRows: async () => ({ ok: true as const }),
  deleteRows: async () => ({ ok: true as const }),
  pingTable: async () => ({ ok: true as const }),
  upsertRow: async () => ({ ok: true as const, data: [] }),
}));

import { POST } from "@/app/api/enquiries/route";

const validBody = {
  name: "Ada Lovelace",
  company: "Analytical Engines",
  email: "ada@example.com",
  projectType: "web-application",
  goal: "We need a customer portal for our clients.",
  problem: "Everything is handled over email and it does not scale.",
  timeline: "3-6-months",
  budget: "25k-50k",
  details: "",
};

function makeRequest(
  body: unknown,
  { origin = "https://unflect.in", raw }: { origin?: string; raw?: string } = {},
): NextRequest {
  return new NextRequest("https://unflect.in/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      "x-forwarded-for": "203.0.113.7",
    },
    body: raw ?? JSON.stringify(body),
  });
}

beforeEach(() => {
  resetMemoryRateLimit();
  supabase.configured = true;
  supabase.insertOk = true;
  delete process.env.RESEND_API_KEY;
  delete process.env.POSTMARK_SERVER_TOKEN;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/enquiries", () => {
  it("returns 503 (not success) when Supabase is not configured", async () => {
    supabase.configured = false;
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.ok).toBe(false);
  });

  it("returns 500 when the database insert fails", async () => {
    supabase.insertOk = false;
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.ok).toBe(false);
  });

  it("returns 202 with a reference when the enquiry is stored", async () => {
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(202);
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(typeof json.reference).toBe("string");
    expect(json.reference.length).toBeGreaterThan(0);
  });

  it("still returns 202 when insertion succeeds but the notification email fails", async () => {
    process.env.RESEND_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );

    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(202);
    const json = await response.json();
    expect(json.ok).toBe(true);
  });

  it("rejects invalid submissions with field errors", async () => {
    const response = await POST(makeRequest({ ...validBody, email: "nope" }));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.errors?.email).toBeTruthy();
  });

  it("rejects oversized payloads with 413", async () => {
    const response = await POST(makeRequest(validBody, { raw: "x".repeat(20_000) }));
    expect(response.status).toBe(413);
  });

  it("blocks cross-origin submissions with 403", async () => {
    const response = await POST(makeRequest(validBody, { origin: "https://evil.example" }));
    expect(response.status).toBe(403);
  });

  it("rate limits per client after the threshold", async () => {
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(makeRequest(validBody));
      expect(ok.status).toBe(202);
    }
    const limited = await POST(makeRequest(validBody));
    expect(limited.status).toBe(429);
  });
});
