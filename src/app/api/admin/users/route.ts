import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
import { updateRows, deleteRows } from "@/lib/supabase";
import { adminDeleteUser } from "@/lib/auth/gotrue";
import { deleteProfileData } from "@/lib/auth/data";

export async function PATCH(request: Request) {
  const session = await readSession();
  
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Update profile
    const result = await updateRows(
      "profiles",
      `id=eq.${encodeURIComponent(id)}`,
      updates
    );

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await readSession();
  
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Delete from auth system
    const authResult = await adminDeleteUser(id);
    
    // Delete profile data (cascade will handle account_events)
    await deleteProfileData(id);

    if (!authResult.ok) {
      return NextResponse.json({ error: "Failed to delete user from auth system" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = await readSession();
  
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, action } = await request.json();
    
    if (!id || !action) {
      return NextResponse.json({ error: "User ID and action required" }, { status: 400 });
    }

    if (action === "block") {
      // Add blocked flag to settings
      const result = await updateRows(
        "profiles",
        `id=eq.${encodeURIComponent(id)}`,
        { settings: { blocked: true } }
      );

      if (!result.ok) {
        return NextResponse.json({ error: "Failed to block user" }, { status: 500 });
      }
    } else if (action === "unblock") {
      // Remove blocked flag from settings
      const result = await updateRows(
        "profiles",
        `id=eq.${encodeURIComponent(id)}`,
        { settings: { blocked: false } }
      );

      if (!result.ok) {
        return NextResponse.json({ error: "Failed to unblock user" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
