import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
import { rejectCrossOrigin, readJson } from "@/lib/auth/security";
import { deleteRows, updateRows } from "@/lib/supabase";
import { isUuid, parseEnquiryUpdate } from "@/lib/admin/validation";
import { recordAdminAudit } from "@/lib/admin/audit";

const MAX_BODY_BYTES = 16 * 1024;

type AdminActor = { id: string; email: string | null };

/** Independent server-side authorization for every admin mutation. */
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
    return NextResponse.json({ error: "A valid enquiry ID is required" }, { status: 400 });
  }

  const parsed = parseEnquiryUpdate(rest);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 });
  }

  const result = await updateRows(
    "enquiries",
    `id=eq.${encodeURIComponent(id)}`,
    parsed.value,
  );

  if (!result.ok) {
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }

  // Record a minimal audit entry (never the PII-bearing field values).
  const audit = await recordAdminAudit({
    actorId: admin.user.id,
    action: "admin.enquiry.updated",
    targetType: "enquiry",
    targetId: id,
    metadata: { status: parsed.value.status ?? null },
  });
  if (!audit.ok) {
    return NextResponse.json(
      { error: "Enquiry updated, but audit logging failed." },
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
    return NextResponse.json({ error: "A valid enquiry ID is required" }, { status: 400 });
  }

  const result = await deleteRows("enquiries", `id=eq.${encodeURIComponent(id)}`);
  if (!result.ok) {
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }

  const audit = await recordAdminAudit({
    actorId: admin.user.id,
    action: "admin.enquiry.deleted",
    targetType: "enquiry",
    targetId: id,
  });
  if (!audit.ok) {
    return NextResponse.json(
      { error: "Enquiry deleted, but audit logging failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
