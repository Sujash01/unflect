import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isAdmin } from "@/lib/auth/admin";

const CONFIRMED = "2026-01-01T00:00:00Z";

beforeEach(() => {
  process.env.ADMIN_EMAILS = "admin@unflect.in, ops@unflect.in";
});

afterEach(() => {
  delete process.env.ADMIN_EMAILS;
});

describe("isAdmin", () => {
  it("grants access to a confirmed allowlisted email", () => {
    expect(
      isAdmin({ email: "admin@unflect.in", email_confirmed_at: CONFIRMED }),
    ).toBe(true);
  });

  it("is case-insensitive on email", () => {
    expect(
      isAdmin({ email: "  Admin@Unflect.in ", email_confirmed_at: CONFIRMED }),
    ).toBe(true);
  });

  it("denies an unconfirmed email", () => {
    expect(
      isAdmin({ email: "admin@unflect.in", email_confirmed_at: null }),
    ).toBe(false);
  });

  it("denies a confirmed email outside the allowlist", () => {
    expect(
      isAdmin({ email: "attacker@evil.example", email_confirmed_at: CONFIRMED }),
    ).toBe(false);
  });

  it("denies a missing user or email", () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(isAdmin({ email_confirmed_at: CONFIRMED })).toBe(false);
  });

  it("denies everyone when the allowlist is empty", () => {
    process.env.ADMIN_EMAILS = "";
    expect(
      isAdmin({ email: "admin@unflect.in", email_confirmed_at: CONFIRMED }),
    ).toBe(false);
  });

  it("ignores roles or profile fields as a source of privilege", () => {
    const user = {
      email: "admin@unflect.in",
      email_confirmed_at: CONFIRMED,
      role: "admin",
      settings: { role: "superadmin" },
    } as never;
    expect(isAdmin(user)).toBe(true);
  });
});
