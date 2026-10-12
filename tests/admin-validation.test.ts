import { describe, expect, it } from "vitest";

import {
  isBlockedSettings,
  isUuid,
  mergeBlockedFlag,
  parseAdminAction,
  parseEnquiryUpdate,
  parseProfileUpdate,
} from "@/lib/admin/validation";

const UUID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";

describe("parseEnquiryUpdate", () => {
  it("accepts an allowlisted status change", () => {
    const result = parseEnquiryUpdate({ status: "contacted" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ status: "contacted" });
  });

  it("rejects an unknown status", () => {
    expect(parseEnquiryUpdate({ status: "root" }).ok).toBe(false);
  });

  it("rejects fields outside the allowlist (e.g. id, reference, created_at)", () => {
    expect(parseEnquiryUpdate({ id: UUID }).ok).toBe(false);
    expect(parseEnquiryUpdate({ reference: "X" }).ok).toBe(false);
    expect(parseEnquiryUpdate({ created_at: "2026-01-01" }).ok).toBe(false);
  });

  it("rejects empty mandatory fields", () => {
    expect(parseEnquiryUpdate({ name: "   " }).ok).toBe(false);
  });

  it("lowercases and validates email", () => {
    const ok = parseEnquiryUpdate({ email: "User@Example.COM" });
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.value.email).toBe("user@example.com");
    expect(parseEnquiryUpdate({ email: "bad" }).ok).toBe(false);
  });

  it("maps empty details to null and non-empty to text", () => {
    const empty = parseEnquiryUpdate({ details: "   " });
    expect(empty.ok).toBe(true);
    if (empty.ok) expect(empty.value.details).toBeNull();

    const filled = parseEnquiryUpdate({ details: "hello" });
    expect(filled.ok).toBe(true);
    if (filled.ok) expect(filled.value.details).toBe("hello");
  });

  it("rejects a body with no supported fields", () => {
    expect(parseEnquiryUpdate({}).ok).toBe(false);
  });
});

describe("parseProfileUpdate", () => {
  it("accepts display name and bio", () => {
    const result = parseProfileUpdate({ display_name: "Ada", bio: "Engineer" });
    expect(result.ok).toBe(true);
  });

  it("requires an HTTPS avatar URL", () => {
    expect(parseProfileUpdate({ avatar_url: "http://x.test/a.png" }).ok).toBe(false);
    expect(parseProfileUpdate({ avatar_url: "https://x.test/a.png" }).ok).toBe(true);
  });

  it("rejects unknown fields", () => {
    expect(parseProfileUpdate({ settings: {} }).ok).toBe(false);
    expect(parseProfileUpdate({ id: UUID }).ok).toBe(false);
  });
});

describe("admin action helpers", () => {
  it("parses only block/unblock", () => {
    expect(parseAdminAction("block")).toBe("block");
    expect(parseAdminAction("unblock")).toBe("unblock");
    expect(parseAdminAction("delete")).toBeNull();
  });

  it("merges the blocked flag without discarding other settings", () => {
    const merged = mergeBlockedFlag({ reducedMotion: true, cursorEffects: false }, true);
    expect(merged).toEqual({ reducedMotion: true, cursorEffects: false, blocked: true });
    expect(isBlockedSettings(merged)).toBe(true);
  });

  it("recovers from non-object settings", () => {
    expect(mergeBlockedFlag(null, true)).toEqual({ blocked: true });
    expect(isBlockedSettings("nope")).toBe(false);
  });
});

describe("isUuid", () => {
  it("accepts a v4-shaped uuid and rejects junk", () => {
    expect(isUuid(UUID)).toBe(true);
    expect(isUuid("123")).toBe(false);
    expect(isUuid(42)).toBe(false);
  });
});
