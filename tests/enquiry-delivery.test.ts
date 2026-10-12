import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import { deliverEnquiry } from "@/lib/enquiry-delivery";
import type { EnquiryInput } from "@/lib/enquiry";

const enquiry: EnquiryInput = {
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

function eventsFrom(spy: ReturnType<typeof vi.spyOn>): string[] {
  return spy.mock.calls
    .map((call: unknown[]) => {
      try {
        return JSON.parse(String(call[0])).event as string;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

beforeEach(() => {
  supabase.configured = true;
  supabase.insertOk = true;
  delete process.env.RESEND_API_KEY;
  delete process.env.POSTMARK_SERVER_TOKEN;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("deliverEnquiry", () => {
  it("reports not_configured without claiming delivery", async () => {
    supabase.configured = false;
    const result = await deliverEnquiry(enquiry, "REF-1");
    expect(result.delivered).toBe(false);
    if (!result.delivered) expect(result.reason).toBe("not_configured");
  });

  it("reports a database failure", async () => {
    supabase.insertOk = false;
    const result = await deliverEnquiry(enquiry, "REF-2");
    expect(result.delivered).toBe(false);
    if (!result.delivered) expect(result.reason).toBe("database");
  });

  it("delivers without email when no provider is configured", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await deliverEnquiry(enquiry, "REF-3");
    expect(result).toEqual({ delivered: true, via: "database" });
    expect(eventsFrom(info)).toContain("project_enquiry_email_skipped");
  });

  it("logs email as dispatched only after a 2xx provider response", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{\"id\":\"x\"}", { status: 200 })),
    );

    const result = await deliverEnquiry(enquiry, "REF-4");
    expect(result.delivered).toBe(true);
    expect(eventsFrom(info)).toContain("project_enquiry_email_dispatched");
  });

  it("does not log dispatched and still delivers when the provider rejects", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );

    const result = await deliverEnquiry(enquiry, "REF-5");
    expect(result.delivered).toBe(true);
    expect(eventsFrom(info)).not.toContain("project_enquiry_email_dispatched");
    expect(eventsFrom(error)).toContain("project_enquiry_email_failed");
  });

  it("treats a thrown network error as a failed send, not a crash", async () => {
    process.env.RESEND_API_KEY = "test-key";
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    const result = await deliverEnquiry(enquiry, "REF-6");
    expect(result.delivered).toBe(true);
  });
});
