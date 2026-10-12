/**
 * Minimal server-side Supabase client (PostgREST over fetch).
 *
 * No SDK dependency on purpose: the backend only needs inserts and a
 * connectivity check, and this keeps the bundle and lockfile untouched.
 *
 * Credentials come from environment variables (see `.env.local`):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * The service-role key bypasses Row Level Security, so it must only ever be
 * used here, on the server. Never prefix it with NEXT_PUBLIC_.
 */

const REQUEST_TIMEOUT_MS = 8_000;

function config(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return config() !== null;
}

type SupabaseResult = { ok: true } | { ok: false; status: number; message: string };

async function request(
  path: string,
  init: RequestInit & { headers?: Record<string, string> },
): Promise<SupabaseResult> {
  const cfg = config();
  if (!cfg) return { ok: false, status: 0, message: "Supabase is not configured." };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (response.ok) return { ok: true };

    // Keep upstream detail server-side only.
    const body = await response.text().catch(() => "");
    return { ok: false, status: response.status, message: body.slice(0, 300) };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "request failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Inserts one row. `Prefer: return=minimal` avoids echoing stored data back. */
export function insertRow(
  table: string,
  row: Record<string, unknown>,
): Promise<SupabaseResult> {
  return request(table, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
}

/** Cheap connectivity + table-exists check used by /api/health. */
export function pingTable(table: string): Promise<SupabaseResult> {
  return request(`${table}?select=id&limit=1`, {
    method: "GET",
    headers: { Prefer: "count=none" },
  });
}

export type SupabaseDataResult<T> =
  | { ok: true; data: T[] }
  | { ok: false; status: number; message: string };

async function dataRequest<T>(
  path: string,
  init: RequestInit & { headers?: Record<string, string> },
): Promise<SupabaseDataResult<T>> {
  const cfg = config();
  if (!cfg) return { ok: false, status: 503, message: "Supabase is not configured." };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const body = await response.text();
    if (!response.ok) return { ok: false, status: response.status, message: body.slice(0, 300) };
    if (!body) return { ok: true, data: [] };
    return { ok: true, data: JSON.parse(body) as T[] };
  } catch (error) {
    return { ok: false, status: 0, message: error instanceof Error ? error.message : "request failed" };
  } finally {
    clearTimeout(timer);
  }
}

export function selectRows<T>(path: string): Promise<SupabaseDataResult<T>> {
  return dataRequest<T>(path, { method: "GET" });
}

export type SupabasePagedResult<T> =
  | { ok: true; data: T[]; count: number }
  | { ok: false; status: number; message: string };

/**
 * Like `selectRows`, but asks PostgREST for an exact total count via
 * `Prefer: count=exact` and parses it from the `Content-Range` header.
 * Use with `limit`/`offset` query parameters for stable pagination.
 */
export async function selectPaged<T>(path: string): Promise<SupabasePagedResult<T>> {
  const cfg = config();
  if (!cfg) return { ok: false, status: 503, message: "Supabase is not configured." };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
    });
    const body = await response.text();
    if (!response.ok) return { ok: false, status: response.status, message: body.slice(0, 300) };
    const contentRange = response.headers.get("content-range") ?? "";
    const total = Number(contentRange.split("/")[1] ?? "");
    const data = body ? (JSON.parse(body) as T[]) : [];
    return { ok: true, data, count: Number.isFinite(total) ? total : data.length };
  } catch (error) {
    return { ok: false, status: 0, message: error instanceof Error ? error.message : "request failed" };
  } finally {
    clearTimeout(timer);
  }
}

export function upsertRow<T>(table: string, row: Record<string, unknown>, conflict: string): Promise<SupabaseDataResult<T>> {
  return dataRequest<T>(`${table}?on_conflict=${encodeURIComponent(conflict)}`, {
    method: "POST",
    headers: { Prefer: `resolution=merge-duplicates,return=representation`, "Content-Profile": "public" },
    body: JSON.stringify(row),
  });
}

export function updateRows(table: string, filter: string, row: Record<string, unknown>): Promise<SupabaseResult> {
  return request(`${table}?${filter}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
}

export function deleteRows(table: string, filter: string): Promise<SupabaseResult> {
  return request(`${table}?${filter}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}
