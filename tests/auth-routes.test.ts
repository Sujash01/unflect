import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { resetMemoryRateLimit } from "@/lib/rate-limit";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  setSessionCookies: vi.fn(),
  ensureProfile: vi.fn(async () => null),
  addAccountEvent: vi.fn(async () => ({ ok: true as const })),
}));

vi.mock("@/lib/auth/gotrue", () => ({
  signIn: mocks.signIn,
  signUp: vi.fn(),
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

import { POST } from "@/app/api/auth/login/route";

function request(body: unknown, origin = "https://unflect.in"): NextRequest {
  return new NextRequest("https://unflect.in/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin, "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  resetMemoryRateLimit();
  mocks.signIn.mockClear();
  mocks.setSessionCookies.mockClear();
});

describe("POST /api/auth/login", () => {
  it("returns a generic message for invalid credentials", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "Invalid login credentials" });
    const response = await POST(request({ email: "ada@example.com", password: "wrong" }));
    const text = await response.text();
    expect(response.status).toBe(401);
    expect(text).toMatch(/incorrect email or password/i);
    expect(text).not.toMatch(/invalid login credentials/i);
    expect(mocks.setSessionCookies).not.toHaveBeenCalled();
  });

  it("returns 503 when auth is unavailable", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 503, message: "upstream down" });
    const response = await POST(request({ email: "ada@example.com", password: "Str0ng!password" }));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/upstream down/i);
  });

  it("rejects missing fields", async () => {
    const response = await POST(request({ email: "", password: "" }));
    expect(response.status).toBe(400);
  });

  it("blocks cross-origin logins", async () => {
    const response = await POST(request({ email: "ada@example.com", password: "Str0ng!password" }, "https://evil.example"));
    expect(response.status).toBe(403);
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("rate limits after the threshold", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "nope" });
    for (let i = 0; i < 10; i += 1) await POST(request({ email: "ada@example.com", password: "wrong" }));
    const limited = await POST(request({ email: "ada@example.com", password: "wrong" }));
    expect(limited.status).toBe(429);
  });

  it("sets a session on success", async () => {
    mocks.signIn.mockResolvedValue({
      ok: true,
      data: {
        access_token: "access",
        refresh_token: "refresh",
        user: { id: "u1", email: "ada@example.com" },
      },
    });
    const response = await POST(request({ email: "ada@example.com", password: "Str0ng!password" }));
    expect(response.status).toBe(200);
    expect(mocks.setSessionCookies).toHaveBeenCalledTimes(1);
  });
});
