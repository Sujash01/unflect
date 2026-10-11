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

/** Lightweight, zero-dependency relative date formatter compatible with date-fns formatDistanceToNow */
export function formatDistanceToNow(
  date: Date | string | number | null | undefined,
  options?: { addSuffix?: boolean },
): string {
  if (!date) return options?.addSuffix ? "recently" : "recent";
  const d = date instanceof Date ? date : new Date(date);
  const time = d.getTime();
  if (Number.isNaN(time)) return options?.addSuffix ? "recently" : "recent";

  const diffMs = Date.now() - time;
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isFuture = diffMs < 0;

  let timeStr = "";
  if (diffSec < 45) {
    timeStr = "less than a minute";
  } else if (diffSec < 90) {
    timeStr = "about 1 minute";
  } else if (diffSec < 45 * 60) {
    timeStr = `${Math.round(diffSec / 60)} minutes`;
  } else if (diffSec < 90 * 60) {
    timeStr = "about 1 hour";
  } else if (diffSec < 24 * 3600) {
    timeStr = `about ${Math.round(diffSec / 3600)} hours`;
  } else if (diffSec < 42 * 3600) {
    timeStr = "1 day";
  } else if (diffSec < 30 * 24 * 3600) {
    timeStr = `${Math.round(diffSec / (24 * 3600))} days`;
  } else if (diffSec < 45 * 24 * 3600) {
    timeStr = "about 1 month";
  } else if (diffSec < 365 * 24 * 3600) {
    timeStr = `${Math.round(diffSec / (30 * 24 * 3600))} months`;
  } else {
    const years = Math.round(diffSec / (365 * 24 * 3600));
    timeStr = years <= 1 ? "about 1 year" : `over ${years} years`;
  }

  if (options?.addSuffix) {
    return isFuture ? `in ${timeStr}` : `${timeStr} ago`;
  }
  return timeStr;
}

