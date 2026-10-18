import { isSupabaseConfigured } from "@/lib/supabase";

export type AuthUser = {
  id: string;
  email: string | null;
  email_confirmed_at?: string | null;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

type AuthTokens = { access_token: string; refresh_token: string; expires_in?: number; user?: AuthUser };

/**
 * Auth credentials.
 *
 *   - `anonKey` is the public/publishable key and is used for ordinary client
 *     authentication flows (sign up, sign in, refresh, recover, verify, update
 *     own user). This is the Supabase-recommended key for these operations.
 *   - `serviceKey` is the secret/service-role key and is used ONLY for
 *     privileged admin operations (delete/ban users). It must never reach the
 *     browser.
 *
 * If `SUPABASE_ANON_KEY` is not configured we fall back to the service key so
 * existing deployments keep working, but operators should set the anon key.
 */
function authConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !serviceKey) return null;
  return { url, serviceKey, anonKey: anonKey || serviceKey };
}

async function authRequest<T>(
  path: string,
  init: RequestInit,
  token?: string,
  options: { admin?: boolean } = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  const cfg = authConfig();
  if (!cfg || !isSupabaseConfigured()) return { ok: false, status: 503, message: "Authentication is not configured." };
  const key = options.admin ? cfg.serviceKey : cfg.anonKey;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${cfg.url}/auth/v1/${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: key,
        Authorization: `Bearer ${token ?? key}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const text = await response.text();
    let data: unknown = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }
    if (!response.ok) {
      const message = data && typeof data === "object" && "msg" in data && typeof data.msg === "string"
        ? data.msg
        : data && typeof data === "object" && "message" in data && typeof data.message === "string"
          ? data.message
          : "Authentication request failed.";
      return { ok: false, status: response.status, message };
    }
    return { ok: true, data: data as T };
  } catch (error) {
    return { ok: false, status: 503, message: error instanceof Error ? error.message : "Authentication request failed." };
  } finally {
    clearTimeout(timer);
  }
}

export function signUp(email: string, password: string, name: string, redirectTo: string) {
  return authRequest<AuthTokens>("signup", {
    method: "POST",
    body: JSON.stringify({ email, password, data: { full_name: name }, options: { email_redirect_to: redirectTo } }),
  });
}

export function signIn(email: string, password: string) {
  return authRequest<AuthTokens>("token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function refresh(refreshToken: string) {
  return authRequest<AuthTokens>("token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export function getUser(accessToken: string) {
  return authRequest<AuthUser>("user", { method: "GET" }, accessToken);
}

export function updateUser(accessToken: string, body: Record<string, unknown>) {
  return authRequest<AuthUser>("user", { method: "PUT", body: JSON.stringify(body) }, accessToken);
}

export function logout(accessToken: string) {
  return authRequest<null>("logout", { method: "POST" }, accessToken);
}

export function recover(email: string, redirectTo: string) {
  return authRequest<unknown>("recover", {
    method: "POST",
    body: JSON.stringify({
      email,
      options: { email_redirect_to: redirectTo, redirect_to: redirectTo },
      redirect_to: redirectTo,
    }),
  });
}

export function verifyTokenHash(tokenHash: string, type: "recovery" | "signup" | "email" = "recovery") {
  return authRequest<AuthTokens>("verify", {
    method: "POST",
    body: JSON.stringify({ token_hash: tokenHash, type }),
  });
}

export function exchangeCode(code: string) {
  return authRequest<AuthTokens>("token?grant_type=pkce", {
    method: "POST",
    body: JSON.stringify({ auth_code: code }),
  });
}

export function resendVerification(email: string, redirectTo: string) {
  return authRequest<unknown>("resend", {
    method: "POST",
    body: JSON.stringify({ type: "signup", email, options: { email_redirect_to: redirectTo } }),
  });
}

/* ------------------------------------------------------------------ */
/* Privileged admin operations — service-role only.                    */
/* ------------------------------------------------------------------ */

export function adminDeleteUser(userId: string) {
  return authRequest<unknown>(`admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" }, undefined, { admin: true });
}

/**
 * Ban a user so that Supabase Auth rejects their existing access/refresh
 * tokens (the supported session-revocation mechanism). `banDuration` is a
 * Go duration string, e.g. "876000h" (~100 years) to block indefinitely.
 */
export function adminBanUser(userId: string, banDuration: string) {
  return authRequest<AuthUser>(
    `admin/users/${encodeURIComponent(userId)}`,
    { method: "PUT", body: JSON.stringify({ ban_duration: banDuration }) },
    undefined,
    { admin: true },
  );
}

export function adminUnbanUser(userId: string) {
  return adminBanUser(userId, "none");
}
