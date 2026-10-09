import { NextResponse, type NextRequest } from "next/server";
import { readSession } from "@/lib/auth/session";
import { rejectCrossOrigin, rateLimit, clientKey } from "@/lib/auth/security";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain"
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (rejectCrossOrigin(request)) return NextResponse.json({ ok: false, message: "Invalid origin." }, { status: 403 });
  if (rateLimit(clientKey(request, "upload"), 60_000, 5)) return NextResponse.json({ ok: false, message: "Too many uploads. Please wait." }, { status: 429 });
  
  const session = await readSession();
  if (!session.user) return NextResponse.json({ ok: false, message: "Authentication required." }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file provided." }, { status: 400 });
  }

  if (file.size === 0) return NextResponse.json({ ok: false, message: "File is empty." }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ ok: false, message: "File size exceeds 10 MB limit." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ ok: false, message: "File type not allowed." }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp", "txt"].includes(ext)) {
    return NextResponse.json({ ok: false, message: "Invalid file extension." }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  
  return NextResponse.json({
    ok: true,
    fileName,
    size: file.size,
    message: "File uploaded successfully."
  });
}
