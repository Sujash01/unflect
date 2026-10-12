import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const UUID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
const ORIGIN = "https://unflect.in";

const mocks = vi.hoisted(() => ({
  readSession: vi.fn(),
  updateRows: vi.fn(async (): Promise<{ ok: boolean; status?: number; message?: string }> => ({ ok: true })),
  deleteRows: vi.fn(async () => ({ ok: true as const })),
  insertRow: vi.fn(async (): Promise<{ ok: boolean; status?: number; message?: string }> => ({ ok: true })),
  adminBanUser: vi.fn(async () => ({ ok: true as const, data: {} })),
  adminUnbanUser: vi.fn(async () => ({ ok: true as const, data: {} })),
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
  adminDeleteUser: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  refresh: vi.fn(),
  getUser: vi.fn(),
  updateUser: vi.fn(),
  logout: vi.fn(),
  recover: vi.fn(),
  resendVerification: vi.fn(),
}));
vi.mock("@/lib/auth/data", () => ({
  getProfile: mocks.getProfile,
  deleteProfileData: mocks.deleteProfileData,
  ensureProfile: vi.fn(),
  addAccountEvent: vi.fn(),
  getUserEnquiries: vi.fn(),
  updateProfile: vi.fn(),
  updateSettings: vi.fn(),
  getAccountEvents: vi.fn(),
}));

import { recordAdminAudit } from "@/lib/admin/audit";
import { PATCH as patchEnquiry } from "@/app/api/admin/enquiries/route";
import { POST as usersBlock } from "@/app/api/admin/users/route";

const adminSession = {
  user: { id: "admin-1", email: "admin@unflect.in", email_confirmed_at: "2026-01-01T00:00:00Z" },
  accessToken: "token",
};

function adminRequest(url: string, body: unknown, method = "PATCH"): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json", origin: ORIGIN },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.ADMIN_EMAILS = "admin@unflect.in";
  mocks.readSession.mockResolvedValue(adminSession);
  mocks.updateRows.mockResolvedValue({ ok: true });
  mocks.deleteRows.mockResolvedValue({ ok: true });
  mocks.insertRow.mockClear().mockResolvedValue({ ok: true });
});

describe("recordAdminAudit", () => {
  it("writes an audit row reusing account_events with actor, action and target", async () => {
    const result = await recordAdminAudit({
      actorId: "admin-1",
      action: "admin.enquiry.deleted",
      targetType: "enquiry",
      targetId: UUID,
    });

    expect(result).toEqual({ ok: true });
    expect(mocks.insertRow).toHaveBeenCalledWith("account_events", {
      user_id: "admin-1",
      event: "admin.enquiry.deleted",
      actor_id: "admin-1",
      target_type: "enquiry",
      target_id: UUID,
      metadata: {},
    });
  });

  it("strips secrets from metadata", async () => {
    await recordAdminAudit({
      actorId: "admin-1",
      action: "admin.user.blocked",
      targetType: "user",
      targetId: UUID,
      metadata: { action: "block", password: "hunter2", token: "abc", note: "ok" },
    });

    const row = (mocks.insertRow.mock.calls[0] as unknown as [string, { metadata: Record<string, unknown> }])[1];
    expect(row.metadata).toEqual({ action: "block", note: "ok" });
  });

  it("caps long string values", async () => {
    await recordAdminAudit({
      actorId: "admin-1",
      action: "admin.user.blocked",
      targetType: "user",
      targetId: UUID,
      metadata: { blob: "x".repeat(1000) },
    });
    const row = (mocks.insertRow.mock.calls[0] as unknown as [string, { metadata: { blob: string } }])[1];
    expect(row.metadata.blob.length).toBe(300);
  });

  it("returns ok:false when persistence fails (does not throw)", async () => {
    mocks.insertRow.mockResolvedValue({ ok: false as const, status: 500, message: "down" });
    const result = await recordAdminAudit({
      actorId: "admin-1",
      action: "admin.enquiry.deleted",
      targetType: "enquiry",
      targetId: UUID,
    });
    expect(result).toEqual({ ok: false });
  });
});

describe("admin route audit integration", () => {
  it("records a minimal audit entry on enquiry update without PII", async () => {
    const response = await patchEnquiry(
      adminRequest(`${ORIGIN}/api/admin/enquiries`, {
        id: UUID,
        status: "contacted",
        email: "client@company.com",
      }),
    );

    expect(response.status).toBe(200);
    const call = mocks.insertRow.mock.calls.find(
      (c) => (c as unknown as [string, { event: string }])[1].event === "admin.enquiry.updated",
    ) as [string, { target_id: string; metadata: Record<string, unknown> }] | undefined;
    expect(call).toBeTruthy();
    expect(call![1].target_id).toBe(UUID);
    // The enquiry's email/name must never be persisted in the audit metadata.
    expect(JSON.stringify(call![1].metadata)).not.toMatch(/client@company\.com/);
  });

  it("does not report success when the audit write fails", async () => {
    mocks.insertRow.mockResolvedValue({ ok: false as const, status: 500, message: "down" });
    const response = await patchEnquiry(
      adminRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }),
    );
    expect(response.status).toBe(500);
  });

  it("returns a distinct, actionable message when the audit write fails after a successful update", async () => {
    mocks.insertRow.mockResolvedValue({ ok: false as const, status: 500, message: "down" });
    const response = await patchEnquiry(
      adminRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }),
    );
    const body = await response.json();
    expect(response.status).toBe(500);
    // The frontend surfaces this message verbatim, so it must be distinct from a
    // plain "operation failed" response.
    expect(body.error).toMatch(/audit logging failed/i);
    expect(body.error).not.toMatch(/failed to update enquiry/i);
  });

  it("returns a generic failure message when the update itself fails", async () => {
    mocks.updateRows.mockResolvedValue({ ok: false as const, status: 500, message: "db down" });
    const response = await patchEnquiry(
      adminRequest(`${ORIGIN}/api/admin/enquiries`, { id: UUID, status: "contacted" }),
    );
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to update enquiry");
  });

  it("records block/unblock audit entries", async () => {
    mocks.adminBanUser.mockResolvedValue({ ok: true as const, data: {} });
    const response = await usersBlock(
      adminRequest(`${ORIGIN}/api/admin/users`, { id: UUID, action: "block" }, "POST"),
    );
    expect(response.status).toBe(200);
    const call = mocks.insertRow.mock.calls.find(
      (c) => (c as unknown as [string, { event: string }])[1].event === "admin.user.blocked",
    ) as [string, { target_id: string }] | undefined;
    expect(call).toBeTruthy();
    expect(call![1].target_id).toBe(UUID);
  });
});
