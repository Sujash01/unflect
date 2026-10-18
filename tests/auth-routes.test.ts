import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { resetMemoryRateLimit } from "@/lib/rate-limit";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  updateUser: vi.fn(),
  getUser: vi.fn(),
  recover: vi.fn(),
  readSession: vi.fn(),
  refreshFromCookies: vi.fn(),
  clearSessionCookies: vi.fn(),
  setSessionCookies: vi.fn(),
  ensureProfile: vi.fn(async () => null),
  addAccountEvent: vi.fn(async () => ({ ok: true as const })),
}));

vi.mock("@/lib/auth/gotrue", () => ({
  signIn: mocks.signIn,
  signUp: vi.fn(),
  refresh: vi.fn(),
  getUser: mocks.getUser,
  updateUser: mocks.updateUser,
  logout: vi.fn(),
  recover: mocks.recover,
  verifyTokenHash: vi.fn(),
  exchangeCode: vi.fn(),
  resendVerification: vi.fn(),
  adminDeleteUser: vi.fn(),
  adminBanUser: vi.fn(),
  adminUnbanUser: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({
  setSessionCookies: mocks.setSessionCookies,
  clearSessionCookies: mocks.clearSessionCookies,
  readSession: mocks.readSession,
  refreshFromCookies: mocks.refreshFromCookies,
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

import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as forgotPost } from "@/app/api/auth/forgot/route";
import { POST as resetPost } from "@/app/api/auth/reset/route";

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
  mocks.updateUser.mockClear();
  mocks.recover.mockClear();
  mocks.readSession.mockClear();
  mocks.setSessionCookies.mockClear();
  mocks.clearSessionCookies.mockClear();
});

describe("POST /api/auth/login", () => {
  it("returns a generic message for invalid credentials", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "Invalid login credentials" });
    const response = await loginPost(request({ email: "ada@example.com", password: "wrong" }));
    const text = await response.text();
    expect(response.status).toBe(401);
    expect(text).toMatch(/incorrect email or password/i);
    expect(text).not.toMatch(/invalid login credentials/i);
    expect(mocks.setSessionCookies).not.toHaveBeenCalled();
  });

  it("returns 503 when auth is unavailable", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 503, message: "upstream down" });
    const response = await loginPost(request({ email: "ada@example.com", password: "Str0ng!password" }));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/upstream down/i);
  });

  it("rejects missing fields", async () => {
    const response = await loginPost(request({ email: "", password: "" }));
    expect(response.status).toBe(400);
  });

  it("blocks cross-origin logins", async () => {
    const response = await loginPost(request({ email: "ada@example.com", password: "Str0ng!password" }, "https://evil.example"));
    expect(response.status).toBe(403);
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("rate limits after the threshold", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "nope" });
    for (let i = 0; i < 10; i += 1) await loginPost(request({ email: "ada@example.com", password: "wrong" }));
    const limited = await loginPost(request({ email: "ada@example.com", password: "wrong" }));
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
    const response = await loginPost(request({ email: "ada@example.com", password: "Str0ng!password" }));
    expect(response.status).toBe(200);
    expect(mocks.setSessionCookies).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/forgot", () => {
  it("rejects invalid email formats", async () => {
    const response = await forgotPost(request({ email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(mocks.recover).not.toHaveBeenCalled();
  });

  it("sends recovery email and returns friendly message without revealing user existence", async () => {
    mocks.recover.mockResolvedValue({ ok: true, data: {} });
    const response = await forgotPost(request({ email: "ada@example.com" }));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mocks.recover).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/reset", () => {
  it("returns 401 when recovery session has expired", async () => {
    mocks.readSession.mockResolvedValue({ user: null, accessToken: null });
    mocks.refreshFromCookies.mockResolvedValue({ ok: false });
    const response = await resetPost(request({ password: "Str0ng!NewPassword1" }));
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toMatch(/recovery session has expired/i);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("rejects passwords not meeting complexity requirements", async () => {
    const response = await resetPost(request({ password: "short" }));
    expect(response.status).toBe(400);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("successfully updates password and clears recovery cookies", async () => {
    mocks.readSession.mockResolvedValue({
      user: { id: "u1", email: "ada@example.com" },
      accessToken: "recovery-access-token",
    });
    mocks.updateUser.mockResolvedValue({ ok: true, data: {} });

    const response = await resetPost(request({ password: "Str0ng!NewPassword1" }));
    expect(response.status).toBe(200);
    expect(mocks.updateUser).toHaveBeenCalledWith("recovery-access-token", { password: "Str0ng!NewPassword1" });
    expect(mocks.clearSessionCookies).toHaveBeenCalledTimes(1);
  });
});
