import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
import { rejectCrossOrigin, readJson } from "@/lib/auth/security";
import { updateRows } from "@/lib/supabase";
import { adminBanUser, adminDeleteUser, adminUnbanUser } from "@/lib/auth/gotrue";
import { deleteProfileData, getProfile } from "@/lib/auth/data";
import {
  isUuid,
  mergeBlockedFlag,
  parseAdminAction,
  parseProfileUpdate,
} from "@/lib/admin/validation";
import { recordAdminAudit } from "@/lib/admin/audit";

const MAX_BODY_BYTES = 8 * 1024;
const INDEFINITE_BAN = "876000h"; // ~100 years.

type AdminActor = { id: string; email: string | null };

async function requireAdmin(): Promise<{ user: AdminActor } | { response: NextResponse }> {
  const session = await readSession();
  const user = session.user;
  if (!user || !isAdmin(user)) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 403 }) };
  }
  return { user };
}

export async function PATCH(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const admin = await requireAdmin();
  if ("response" in admin) return admin.response;

  let raw: unknown;
  try {
    raw = await readJson(request, MAX_BODY_BYTES);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE";
    return NextResponse.json(
      { error: tooLarge ? "Request too large." : "Invalid request" },
      { status: tooLarge ? 413 : 400 },
    );
  }

  const body = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const { id, ...rest } = body;

  if (!isUuid(id)) {
    return NextResponse.json({ error: "A valid user ID is required" }, { status: 400 });
  }

  const parsed = parseProfileUpdate(rest);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 });
  }

  const result = await updateRows("profiles", `id=eq.${encodeURIComponent(id)}`, parsed.value);
  if (!result.ok) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }

  // Record only the field names, never the personal values.
  const audit = await recordAdminAudit({
    actorId: admin.user.id,
    action: "admin.user.updated",
    targetType: "user",
    targetId: id,
    metadata: { fields: Object.keys(parsed.value) },
  });
  if (!audit.ok) {
    return NextResponse.json(
      { error: "User updated, but audit logging failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const admin = await requireAdmin();
  if ("response" in admin) return admin.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!isUuid(id)) {
    return NextResponse.json({ error: "A valid user ID is required" }, { status: 400 });
  }

  const authResult = await adminDeleteUser(id);
  const profileDataResult = await deleteProfileData(id);

  // The auth record is the source of truth; if it was removed the cascade
  // handles related rows. Report failure only when the auth delete failed.
  if (!authResult.ok) {
    return NextResponse.json({ error: "Failed to delete user from auth system" }, { status: 500 });
  }
  if (!profileDataResult) {
    return NextResponse.json({ error: "User deleted, but profile cleanup failed" }, { status: 500 });
  }

  const audit = await recordAdminAudit({
    actorId: admin.user.id,
    action: "admin.user.deleted",
    targetType: "user",
    targetId: id,
  });
  if (!audit.ok) {
    return NextResponse.json(
      { error: "User deleted, but audit logging failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const admin = await requireAdmin();
  if ("response" in admin) return admin.response;

  let raw: unknown;
  try {
    raw = await readJson(request, MAX_BODY_BYTES);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE";
    return NextResponse.json(
      { error: tooLarge ? "Request too large." : "Invalid request" },
      { status: tooLarge ? 413 : 400 },
    );
  }

  const body = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const id = body.id;
  const action = parseAdminAction(body.action);

  if (!isUuid(id) || !action) {
    return NextResponse.json({ error: "A valid user ID and action are required" }, { status: 400 });
  }

  const block = action === "block";

  // Revoke/restore access through Supabase Auth (revokes existing sessions).
  const authResult = block ? await adminBanUser(id, INDEFINITE_BAN) : await adminUnbanUser(id);
  if (!authResult.ok) {
    return NextResponse.json(
      { error: `Failed to ${action} user` },
      { status: 500 },
    );
  }

  // Preserve the user's existing settings; only flip the `blocked` flag.
  const profile = await getProfile(id);
  const settings = mergeBlockedFlag(profile?.settings, block);
  const result = await updateRows("profiles", `id=eq.${encodeURIComponent(id)}`, { settings });

  if (!result.ok) {
    return NextResponse.json({ error: `Failed to ${action} user` }, { status: 500 });
  }

  const audit = await recordAdminAudit({
    actorId: admin.user.id,
    action: block ? "admin.user.blocked" : "admin.user.unblocked",
    targetType: "user",
    targetId: id,
    metadata: { action },
  });
  if (!audit.ok) {
    return NextResponse.json(
      { error: `User ${action === "block" ? "blocked" : "unblocked"}, but audit logging failed.` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
