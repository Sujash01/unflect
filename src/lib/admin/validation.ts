/**
 * Server-side validation for admin mutations.
 *
 * Every admin endpoint accepts an explicit allowlist of writable fields. Any
 * payload containing a field outside that allowlist is rejected outright, so a
 * caller can never smuggle `id`, `reference`, `created_at`, `settings`, role or
 * ownership columns through an update.
 */

import { cleanText, validateEmail } from "@/lib/auth/validation";

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

const ENQUIRY_EDITABLE = [
  "name",
  "company",
  "email",
  "project_type",
  "goal",
  "problem",
  "timeline",
  "budget",
  "details",
  "status",
] as const;

export type EnquiryUpdate = {
  name?: string;
  company?: string;
  email?: string;
  project_type?: string;
  goal?: string;
  problem?: string;
  timeline?: string;
  budget?: string;
  details?: string | null;
  status?: EnquiryStatus;
};

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function rejectUnknown(
  input: Record<string, unknown>,
  allowed: readonly string[],
): string | null {
  const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    return `Unsupported field(s): ${unknown.join(", ")}.`;
  }
  return null;
}

const LIMITS = {
  name: 100,
  company: 160,
  project_type: 60,
  timeline: 60,
  budget: 60,
  goal: 2000,
  problem: 2000,
  details: 2000,
  bio: 500,
  display_name: 100,
  avatar_url: 500,
} as const;

export function parseEnquiryUpdate(input: unknown): ParseResult<EnquiryUpdate> {
  if (!isPlainObject(input)) return { ok: false, message: "Invalid request body." };

  const unknownError = rejectUnknown(input, ENQUIRY_EDITABLE);
  if (unknownError) return { ok: false, message: unknownError };

  const value: EnquiryUpdate = {};

  for (const key of ["name", "company", "project_type", "timeline", "budget", "goal", "problem"] as const) {
    if (key in input) {
      const cleaned = cleanText(input[key], LIMITS[key]);
      if (!cleaned) return { ok: false, message: `${key} cannot be empty.` };
      value[key] = cleaned;
    }
  }

  if ("details" in input) {
    const cleaned = cleanText(input.details, LIMITS.details);
    value.details = cleaned.length > 0 ? cleaned : null;
  }

  if ("email" in input) {
    const email = cleanText(input.email, 254).toLowerCase();
    const emailError = validateEmail(email);
    if (emailError) return { ok: false, message: emailError };
    value.email = email;
  }

  if ("status" in input) {
    const status = typeof input.status === "string" ? input.status : "";
    if (!ENQUIRY_STATUSES.includes(status as EnquiryStatus)) {
      return { ok: false, message: "Invalid enquiry status." };
    }
    value.status = status as EnquiryStatus;
  }

  if (Object.keys(value).length === 0) {
    return { ok: false, message: "No supported fields were provided." };
  }

  return { ok: true, value };
}

const PROFILE_EDITABLE = ["display_name", "bio", "avatar_url"] as const;

export type ProfileUpdate = {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
};

export function parseProfileUpdate(input: unknown): ParseResult<ProfileUpdate> {
  if (!isPlainObject(input)) return { ok: false, message: "Invalid request body." };

  const unknownError = rejectUnknown(input, PROFILE_EDITABLE);
  if (unknownError) return { ok: false, message: unknownError };

  const value: ProfileUpdate = {};

  if ("display_name" in input) {
    const name = cleanText(input.display_name, LIMITS.display_name);
    if (!name) return { ok: false, message: "Display name cannot be empty." };
    value.display_name = name;
  }

  if ("bio" in input) {
    value.bio = cleanText(input.bio, LIMITS.bio);
  }

  if ("avatar_url" in input) {
    const url = cleanText(input.avatar_url, LIMITS.avatar_url);
    if (url && !/^https:\/\//i.test(url)) {
      return { ok: false, message: "Avatar URL must use HTTPS." };
    }
    value.avatar_url = url;
  }

  if (Object.keys(value).length === 0) {
    return { ok: false, message: "No supported fields were provided." };
  }

  return { ok: true, value };
}

export type AdminAction = "block" | "unblock";

export function parseAdminAction(value: unknown): AdminAction | null {
  return value === "block" || value === "unblock" ? value : null;
}

/**
 * Merge a block flag into an existing settings object without discarding the
 * user's other preferences (reducedMotion, cursorEffects, smoothScroll, …).
 */
export function mergeBlockedFlag(
  current: unknown,
  blocked: boolean,
): Record<string, unknown> {
  const base = isPlainObject(current) ? current : {};
  return { ...base, blocked };
}

export function isBlockedSettings(settings: unknown): boolean {
  return isPlainObject(settings) && settings.blocked === true;
}
