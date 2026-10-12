import { beforeEach, describe, expect, it, vi } from "vitest";

const captured = vi.hoisted(() => ({ path: "" }));

vi.mock("@/lib/supabase", () => ({
  selectPaged: async (path: string) => {
    captured.path = path;
    return { ok: true as const, data: [], count: 0 };
  },
}));

import {
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_OPTIONS,
  countEnquiriesByStatus,
  getEnquiriesPage,
  getProfilesPage,
  normalizePage,
  normalizePageSize,
} from "@/lib/admin/data";

beforeEach(() => {
  captured.path = "";
});

describe("input normalization", () => {
  it("clamps page to a minimum of 1", () => {
    expect(normalizePage(undefined)).toBe(1);
    expect(normalizePage("0")).toBe(1);
    expect(normalizePage("-5")).toBe(1);
    expect(normalizePage("abc")).toBe(1);
    expect(normalizePage("2.9")).toBe(2);
  });

  it("accepts only known page sizes", () => {
    expect(normalizePageSize(undefined)).toBe(PAGE_SIZE_DEFAULT);
    expect(normalizePageSize("10")).toBe(10);
    expect(normalizePageSize("25")).toBe(25);
    expect(normalizePageSize("9999")).toBe(PAGE_SIZE_DEFAULT);
    expect(PAGE_SIZE_OPTIONS).toContain(25);
  });
});

describe("paginated queries", () => {
  it("builds a bounded, deterministically ordered enquiries query", async () => {
    await getEnquiriesPage(2, 25);
    expect(captured.path).toContain("order=created_at.desc,id.desc");
    expect(captured.path).toContain("limit=25");
    expect(captured.path).toContain("offset=25");
  });

  it("builds a bounded profiles query", async () => {
    await getProfilesPage(1, 10);
    expect(captured.path).toContain("limit=10");
    expect(captured.path).toContain("offset=0");
  });

  it("counts enquiries by status with a bounded query", async () => {
    const count = await countEnquiriesByStatus("new");
    expect(count).toBe(0);
    expect(captured.path).toContain("status=eq.new");
    expect(captured.path).toContain("limit=1");
  });

  it("encodes status values", async () => {
    await countEnquiriesByStatus("won");
    expect(captured.path).toContain("status=eq.won");
  });
});
