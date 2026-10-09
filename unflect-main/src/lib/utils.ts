export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generates a short, human-quotable enquiry reference, e.g. "UNF-4H2K9".
 * Not a security token \u2014 it exists so an enquirer and UNFLECT can refer to
 * the same enquiry in correspondence.
 */
export function enquiryReference(now: Date = new Date()): string {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(5);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (const byte of bytes) {
    suffix += alphabet[byte % alphabet.length];
  }
  return `UNF-${stamp}-${suffix}`;
}

/** Splits a heading into highlighted and plain segments. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
