import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
import { updateRows, deleteRows } from "@/lib/supabase";

export async function PATCH(request: Request) {
  const session = await readSession();
  
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    }

    const result = await updateRows(
      "enquiries",
      `id=eq.${encodeURIComponent(id)}`,
      updates
    );

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
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
      return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    }

    const result = await deleteRows("enquiries", `id=eq.${encodeURIComponent(id)}`);

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
