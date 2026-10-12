/**
 * Admin data access.
 *
 * All list queries are paginated with a validated page size and a stable
 * ordering (`created_at desc, id desc`) so records never shift between pages.
 */

import { selectPaged } from "@/lib/supabase";

export const PAGE_SIZE_DEFAULT = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/** Stable ordering: newest first, with id as a deterministic tie-breaker. */
const ORDER = "created_at.desc,id.desc";

export type EnquiryRow = {
  id: string;
  reference: string;
  name: string;
  company: string;
  email: string;
  project_type: string;
  goal: string;
  problem: string;
  timeline: string;
  budget: string;
  details: string | null;
  status: string;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AccountEventRow = {
  id: string;
  user_id: string;
  event: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export function normalizePage(value: unknown): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function normalizePageSize(value: unknown): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(n) ? n : PAGE_SIZE_DEFAULT;
}

export function getEnquiriesPage(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return selectPaged<EnquiryRow>(
    `enquiries?select=*&order=${ORDER}&limit=${pageSize}&offset=${offset}`,
  );
}

export function getProfilesPage(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return selectPaged<ProfileRow>(
    `profiles?select=*&order=${ORDER}&limit=${pageSize}&offset=${offset}`,
  );
}

export function getAccountEvents(limit = 200) {
  return selectPaged<AccountEventRow>(
    `account_events?select=*&order=${ORDER}&limit=${limit}`,
  );
}

export async function countEnquiriesByStatus(status: string): Promise<number> {
  const result = await selectPaged<{ id: string }>(
    `enquiries?select=id&status=eq.${encodeURIComponent(status)}&limit=1`,
  );
  return result.ok ? result.count : 0;
}
