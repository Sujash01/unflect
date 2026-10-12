import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { resetMemoryRateLimit } from "@/lib/rate-limit";

const mocks = vi.hoisted(() => ({
  readSession: vi.fn(),
  signIn: vi.fn(),
  updateUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  adminDeleteUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  deleteProfileData: vi.fn(async () => true),
  addAccountEvent: vi.fn(async () => ({ ok: true as const })),
  clearSessionCookies: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  readSession: mocks.readSession,
  setSessionCookies: vi.fn(),
  clearSessionCookies: mocks.clearSessionCookies,
  refreshFromCookies: vi.fn(),
}));
vi.mock("@/lib/auth/gotrue", () => ({
  signIn: mocks.signIn,
  signUp: vi.fn(),
  refresh: vi.fn(),
  getUser: vi.fn(),
  updateUser: mocks.updateUser,
  logout: vi.fn(),
  recover: vi.fn(),
  resendVerification: vi.fn(),
  adminDeleteUser: mocks.adminDeleteUser,
  adminBanUser: vi.fn(),
  adminUnbanUser: vi.fn(),
}));
vi.mock("@/lib/auth/data", () => ({
  ensureProfile: vi.fn(),
  addAccountEvent: mocks.addAccountEvent,
  getProfile: vi.fn(),
  getUserEnquiries: vi.fn(),
  updateProfile: vi.fn(),
  updateSettings: vi.fn(),
  getAccountEvents: vi.fn(),
  deleteProfileData: mocks.deleteProfileData,
}));

import { DELETE as deleteAccount } from "@/app/api/account/delete/route";
import { PATCH as changePassword } from "@/app/api/account/password/route";

const session = {
  user: { id: "u1", email: "ada@example.com" },
  accessToken: "access-token",
};

function del(body: unknown, origin = "https://unflect.in"): NextRequest {
  return new NextRequest("https://unflect.in/api/account/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", origin, "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify(body),
  });
}

function patch(body: unknown, origin = "https://unflect.in"): NextRequest {
  return new NextRequest("https://unflect.in/api/account/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", origin, "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  resetMemoryRateLimit();
  mocks.readSession.mockResolvedValue(session);
  mocks.signIn.mockClear();
  mocks.adminDeleteUser.mockClear();
  mocks.updateUser.mockClear();
  mocks.clearSessionCookies.mockClear();
});

describe("DELETE /api/account/delete", () => {
  it("rejects unauthenticated requests", async () => {
    mocks.readSession.mockResolvedValue({ user: null, accessToken: null });
    const response = await deleteAccount(del({ password: "Str0ng!password", confirmation: "DELETE" }));
    expect(response.status).toBe(401);
    expect(mocks.adminDeleteUser).not.toHaveBeenCalled();
  });

  it("requires the DELETE confirmation phrase", async () => {
    const response = await deleteAccount(del({ password: "Str0ng!password", confirmation: "yes" }));
    expect(response.status).toBe(400);
    expect(mocks.adminDeleteUser).not.toHaveBeenCalled();
  });

  it("re-authenticates with the current password before deleting", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "bad" });
    const response = await deleteAccount(del({ password: "wrong", confirmation: "DELETE" }));
    expect(response.status).toBe(401);
    expect(mocks.adminDeleteUser).not.toHaveBeenCalled();
  });

  it("deletes the account and clears the session", async () => {
    mocks.signIn.mockResolvedValue({ ok: true as const, data: {} });
    const response = await deleteAccount(del({ password: "Str0ng!password", confirmation: "DELETE" }));
    expect(response.status).toBe(200);
    expect(mocks.adminDeleteUser).toHaveBeenCalledWith("u1");
    expect(mocks.clearSessionCookies).toHaveBeenCalledTimes(1);
  });
});

describe("PATCH /api/account/password", () => {
  it("rejects unauthenticated requests", async () => {
    mocks.readSession.mockResolvedValue({ user: null, accessToken: null });
    const response = await changePassword(patch({ currentPassword: "Str0ng!password", newPassword: "N3w!password" }));
    expect(response.status).toBe(401);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("enforces password rules", async () => {
    const response = await changePassword(patch({ currentPassword: "Str0ng!password", newPassword: "weak" }));
    expect(response.status).toBe(400);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("re-authenticates with the current password", async () => {
    mocks.signIn.mockResolvedValue({ ok: false as const, status: 401, message: "bad" });
    const response = await changePassword(patch({ currentPassword: "wrong", newPassword: "N3w!password" }));
    expect(response.status).toBe(401);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("changes the password for a valid session", async () => {
    mocks.signIn.mockResolvedValue({ ok: true as const, data: {} });
    const response = await changePassword(patch({ currentPassword: "Str0ng!password", newPassword: "N3w!password" }));
    expect(response.status).toBe(200);
    expect(mocks.updateUser).toHaveBeenCalledWith("access-token", { password: "N3w!password" });
  });
});
