const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;
const COMMON = new Set([
  "password", "password1", "password123", "12345678", "123456789", "qwerty", "qwerty123",
  "qwerty-qwerty", "letmein", "welcome", "adminadmin", "unflect", "unflect123", "changeme",
]);

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateEmail(value: unknown): string | null {
  const email = normalizeEmail(value);
  if (!email || email.length > 254 || !EMAIL.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(value: unknown): string | null {
  if (typeof value !== "string") return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (value.length > 72) return "Keep your password under 72 characters.";
  const compact = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (COMMON.has(value.toLowerCase()) || COMMON.has(compact) || /^(.)\1+$/.test(value)) {
    return "Choose a less predictable password.";
  }
  return null;
}

export function validateName(value: unknown): string | null {
  if (typeof value !== "string") return "Enter your name.";
  const name = value.trim();
  if (!name) return "Enter your name.";
  if (name.length > 100) return "Keep your name under 100 characters.";
  return null;
}

export function cleanText(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/[ \t]+/g, " ").trim().slice(0, max)
    : "";
}
