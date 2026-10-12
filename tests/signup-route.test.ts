import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  setSessionCookies: vi.fn(),
  ensureProfile: vi.fn(async () => null),
  addAccountEvent: vi.fn(async () => ({ ok: true as const })),
}));

vi.mock("@/lib/auth/gotrue", () => ({
  signUp: mocks.signUp,
  signIn: vi.fn(),
  refresh: vi.fn(),
  getUser: vi.fn(),
  updateUser: vi.fn(),
  logout: vi.fn(),
  recover: vi.fn(),
  resendVerification: vi.fn(),
  adminDeleteUser: vi.fn(),
  adminBanUser: vi.fn(),
  adminUnbanUser: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({
  setSessionCookies: mocks.setSessionCookies,
  readSession: vi.fn(),
  refreshFromCookies: vi.fn(),
}));
vi.mock("@/lib/auth/data", () => ({
  ensureProfile: mocks.ensureProfile,
  addAccountEvent: mocks.addAccountEvent,
  getProfile: vi.fn(),
  getUserEnquiries: vi.fn(),
  updateProfile: vi.fn(),
  updateSettings: vi.fn(),
  getAccountEvents: vi.fn(),
  deleteProfileData: vi.fn(),
}));

import { POST } from "@/app/api/auth/signup/route";
import { resetMemoryRateLimit } from "@/lib/rate-limit";

function request(body: unknown): NextRequest {
  return new NextRequest("https://unflect.in/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "https://unflect.in" },
    body: JSON.stringify(body),
  });
}

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  password: "Str0ng!password",
};

beforeEach(() => {
  resetMemoryRateLimit();
  mocks.signUp.mockClear();
  mocks.setSessionCookies.mockClear();
});

describe("POST /api/auth/signup response privacy", () => {
  it("does not reveal that an email is already registered (422)", async () => {
    mocks.signUp.mockResolvedValue({ ok: false, status: 422, message: "User already registered" });
    const response = await POST(request(valid));
    const text = await response.text();

    expect(response.status).not.toBe(201);
    expect(text).not.toMatch(/already (registered|exists)|user already/i);
    expect(text).toMatch(/try signing in or resetting your password/i);
  });

  it("returns a generic message for unexpected provider errors", async () => {
    mocks.signUp.mockResolvedValue({ ok: false, status: 500, message: "SECRET_DETAIL leaked" });
    const response = await POST(request(valid));
    const text = await response.text();

    expect(text).not.toMatch(/SECRET_DETAIL/i);
    expect(text).toMatch(/try signing in or resetting your password/i);
  });

  it("returns 503 without provider detail when auth is unavailable", async () => {
    mocks.signUp.mockResolvedValue({ ok: false, status: 503, message: "upstream timeout" });
    const response = await POST(request(valid));

    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).not.toMatch(/upstream timeout/i);
  });

  it("creates the account and sets session cookies on success", async () => {
    mocks.signUp.mockResolvedValue({
      ok: true,
      data: {
        access_token: "access",
        refresh_token: "refresh",
        user: { id: "u1", email: "ada@example.com" },
      },
    });

    const response = await POST(request(valid));
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(mocks.setSessionCookies).toHaveBeenCalledTimes(1);
  });

  it("rejects cross-origin signups", async () => {
    const evil = new NextRequest("https://unflect.in/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "https://evil.example" },
      body: JSON.stringify(valid),
    });
    const response = await POST(evil);
    expect(response.status).toBe(403);
    expect(mocks.signUp).not.toHaveBeenCalled();
  });
});
