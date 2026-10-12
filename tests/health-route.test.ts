import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({
  configured: true,
  pingOk: true,
}));

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => supabase.configured,
  pingTable: async () =>
    supabase.pingOk ? { ok: true as const } : { ok: false as const, status: 500, message: "down" },
  insertRow: vi.fn(),
  selectRows: vi.fn(),
  selectPaged: vi.fn(),
  updateRows: vi.fn(),
  deleteRows: vi.fn(),
  upsertRow: vi.fn(),
}));

import { GET } from "@/app/api/health/route";

beforeEach(() => {
  supabase.configured = true;
  supabase.pingOk = true;
  delete process.env.RESEND_API_KEY;
  delete process.env.POSTMARK_SERVER_TOKEN;
});

describe("GET /api/health", () => {
  it("returns 503 when Supabase is not configured", async () => {
    supabase.configured = false;
    const response = await GET();
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json).toEqual({ ok: false, database: "not_configured" });
  });

  it("returns 503 when the database is unreachable", async () => {
    supabase.pingOk = false;
    const response = await GET();
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.database).toBe("unreachable");
  });

  it("returns 200 with a connected database and email state", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const response = await GET();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.database).toBe("connected");
    expect(json.email).toBe("configured");
  });

  it("reports email as not configured without a provider", async () => {
    const response = await GET();
    const json = await response.json();
    expect(json.email).toBe("not_configured");
  });

  it("does not leak credentials or upstream detail", async () => {
    supabase.configured = false;
    const response = await GET();
    const text = await response.text();
    expect(text).not.toMatch(/service_role|supabase\.co|apikey|bearer/i);
  });
});
