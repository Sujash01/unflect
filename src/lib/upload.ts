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

export type UploadResult = 
  | { ok: true; fileName: string; size: number }
  | { ok: false; error: string };

export function validateFile(file: File): string | null {
  if (!file) return "No file selected.";
  if (file.size === 0) return "File is empty.";
  if (file.size > MAX_FILE_SIZE) return "File size exceeds 10 MB limit.";
  if (!ALLOWED_TYPES.has(file.type)) return "File type not allowed. Use PDF, DOC, DOCX, JPG, PNG, WEBP, or TXT.";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp", "txt"].includes(ext)) {
    return "Invalid file extension.";
  }
  return null;
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  const error = validateFile(file);
  if (error) return { ok: false, error };
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const data = await response.json();
      return { ok: false, error: data.message || "Upload failed." };
    }
    
    const data = await response.json();
    return { ok: true, fileName: data.fileName, size: file.size };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
