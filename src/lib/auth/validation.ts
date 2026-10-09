const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;
const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "guerrillamail.com", "10minutemail.com", "mailinator.com",
  "throwaway.email", "temp-mail.org", "yopmail.com", "maildrop.cc"
]);

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateEmail(value: unknown): string | null {
  const email = normalizeEmail(value);
  if (!email || email.length > 254 || !EMAIL.test(email)) return "Enter a valid email address.";
  const domain = email.split("@")[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) return "Disposable email addresses are not allowed.";
  return null;
}

export function validatePassword(value: unknown): string | null {
  if (typeof value !== "string") return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (value.length > 72) return "Keep your password under 72 characters.";
  if (!/[a-z]/.test(value)) return "Include at least one lowercase letter.";
  if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
  if (!/[0-9]/.test(value)) return "Include at least one number.";
  if (!/[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/.test(value)) return "Include at least one special character.";
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
