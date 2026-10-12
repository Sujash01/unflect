import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const UUID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
const ORIGIN = "https://unflect.in";

const mocks = vi.hoisted(() => ({
  readSession: vi.fn(),
  updateRows: vi.fn(async () => ({ ok: true as const })),
  deleteRows: vi.fn(async () => ({ ok: true as const })),
  insertRow: vi.fn(async () => ({ ok: true as const })),
  adminBanUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  adminUnbanUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  adminDeleteUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  getProfile: vi.fn(async () => ({ settings: { reducedMotion: true } })),
  deleteProfileData: vi.fn(async () => true),
}));

vi.mock("@/lib/auth/session", () => ({ readSession: mocks.readSession }));
vi.mock("@/lib/supabase", () => ({
  updateRows: mocks.updateRows,
  deleteRows: mocks.deleteRows,
  insertRow: mocks.insertRow,
  selectRows: vi.fn(),
  selectPaged: vi.fn(),
  pingTable: vi.fn(),
  upsertRow: vi.fn(),
  isSupabaseConfigured: () => true,
}));
vi.mock("@/lib/auth/gotrue", () => ({
  adminBanUser: mocks.adminBanUser,
  adminUnbanUser: mocks.adminUnbanUser,
  adminDeleteUser: mocks.adminDeleteUser,
}));
vi.mock("@/lib/auth/data", () => ({
  getProfile: mocks.getProfile,
  deleteProfileData: mocks.deleteProfileData,
}));

import { DELETE as deleteEnquiry, PATCH as patchEnquiry } from "@/app/api/admin/enquiries/route";
import { POST as usersAction, PATCH as patchUser } from "@/app/api/admin/users/route";

const adminSession = {
  user: {
    id: "admin-1",
    email: "admin@unflect.in",
    email_confirmed_at: "2026-01-01T00:00:00Z",
  },
  accessToken: "token",
};

function jsonRequest(
  url: string,
  body: unknown,
  { method = "PATCH", origin = ORIGIN }: { method?: string; origin?: string } = {},
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.ADMIN_EMAILS = "admin@unflect.in";
  mocks.readSession.mockResolvedValue(adminSession);
  mocks.updateRows.mockClear().mockResolvedValue({ ok: true });
  mocks.deleteRows.mockClear().mockResolvedValue({ ok: true });
  mocks.insertRow.mockClear().mockResolvedValue({ ok: true });
  mocks.adminBanUser.mockClear().mockResolvedValue({ ok: true, data: {} });
  mocks.adminUnbanUser.mockClear().mockResolvedValue({ ok: true, data: {} });
  mocks.getProfile.mockClear().mockResolvedValue({ settings: { reducedMotion: true } });
});

describe("admin authorization", () => {
  it("rejects unauthenticated requests with 403", async () => {
    mocks.readSession.mockResolvedValue({ user: null, accessToken: null });
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }));
    expect(response.status).toBe(403);
    expect(mocks.updateRows).not.toHaveBeenCalled();
  });

  it("rejects a confirmed user not in the allowlist", async () => {
    mocks.readSession.mockResolvedValue({
      user: { id: "u", email: "user@example.com", email_confirmed_at: "2026-01-01T00:00:00Z" },
      accessToken: "t",
    });
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }));
    expect(response.status).toBe(403);
  });

  it("rejects an allowlisted but unconfirmed user", async () => {
    mocks.readSession.mockResolvedValue({
      user: { id: "u", email: "admin@unflect.in", email_confirmed_at: null },
      accessToken: "t",
    });
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }));
    expect(response.status).toBe(403);
  });

  it("rejects cross-origin mutations", async () => {
    const response = await patchEnquiry(
      jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }, { origin: "https://evil.example" }),
    );
    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/admin/enquiries", () => {
  it("applies an allowlisted status update", async () => {
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }));
    expect(response.status).toBe(200);
    expect(mocks.updateRows).toHaveBeenCalledWith("enquiries", `id=eq.${UUID}`, { status: "contacted" });
  });

  it("rejects fields outside the allowlist", async () => {
    const response = await patchEnquiry(
      jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, reference: "HACK", status: "contacted" }),
    );
    expect(response.status).toBe(400);
    expect(mocks.updateRows).not.toHaveBeenCalled();
  });

  it("rejects a non-UUID identifier", async () => {
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: "1", status: "contacted" }));
    expect(response.status).toBe(400);
  });

  it("rejects an invalid status value", async () => {
    const response = await patchEnquiry(jsonRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "root" }));
    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/admin/enquiries", () => {
  it("rejects an invalid id", async () => {
    const response = await deleteEnquiry(new NextRequest(`${ORIGIN}/api/admin/enquiries?id=abc`, { method: "DELETE", headers: { origin: ORIGIN } }));
    expect(response.status).toBe(400);
  });

  it("deletes a valid enquiry", async () => {
    const response = await deleteEnquiry(new NextRequest(`${ORIGIN}/api/admin/enquiries?id=${UUID}`, { method: "DELETE", headers: { origin: ORIGIN } }));
    expect(response.status).toBe(200);
    expect(mocks.deleteRows).toHaveBeenCalledWith("enquiries", `id=eq.${UUID}`);
  });
});

describe("POST /api/admin/users (block/unblock)", () => {
  it("blocks by banning the auth user and preserving settings", async () => {
    const response = await usersAction(jsonRequest(`${ORIGIN}/api/admin/users`, { id: UUID, action: "block" }, { method: "POST" }));
    expect(response.status).toBe(200);
    expect(mocks.adminBanUser).toHaveBeenCalledWith(UUID, "876000h");
    expect(mocks.updateRows).toHaveBeenCalledWith("profiles", `id=eq.${UUID}`, {
      settings: { reducedMotion: true, blocked: true },
    });
  });

  it("unblocks and preserves settings", async () => {
    const response = await usersAction(jsonRequest(`${ORIGIN}/api/admin/users`, { id: UUID, action: "unblock" }, { method: "POST" }));
    expect(response.status).toBe(200);
    expect(mocks.adminUnbanUser).toHaveBeenCalledWith(UUID);
    expect(mocks.updateRows).toHaveBeenCalledWith("profiles", `id=eq.${UUID}`, {
      settings: { reducedMotion: true, blocked: false },
    });
  });

  it("rejects an invalid action", async () => {
    const response = await usersAction(jsonRequest(`${ORIGIN}/api/admin/users`, { id: UUID, action: "promote" }, { method: "POST" }));
    expect(response.status).toBe(400);
    expect(mocks.adminBanUser).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/admin/users", () => {
  it("rejects the protected settings field", async () => {
    const response = await patchUser(jsonRequest(`${ORIGIN}/api/admin/users`, { id: UUID, settings: { blocked: false } }));
    expect(response.status).toBe(400);
    expect(mocks.updateRows).not.toHaveBeenCalled();
  });

  it("applies an allowlisted profile update", async () => {
    const response = await patchUser(jsonRequest(`${ORIGIN}/api/admin/users`, { id: UUID, display_name: "Ada" }));
    expect(response.status).toBe(200);
    expect(mocks.updateRows).toHaveBeenCalledWith("profiles", `id=eq.${UUID}`, { display_name: "Ada" });
  });
});
