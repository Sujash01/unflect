import { isSupabaseConfigured } from "@/lib/supabase";

export type AuthUser = {
  id: string;
  email: string | null;
  email_confirmed_at?: string | null;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

type AuthTokens = { access_token: string; refresh_token: string; expires_in?: number; user?: AuthUser };

function authConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

async function authRequest<T>(path: string, init: RequestInit, token?: string): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  const cfg = authConfig();
  if (!cfg || !isSupabaseConfigured()) return { ok: false, status: 503, message: "Authentication is not configured." };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${cfg.url}/auth/v1/${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${token ?? cfg.key}`,
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
    body: JSON.stringify({ email, options: { redirect_to: redirectTo } }),
  });
}

export function resendVerification(email: string, redirectTo: string) {
  return authRequest<unknown>("resend", {
    method: "POST",
    body: JSON.stringify({ type: "signup", email, options: { email_redirect_to: redirectTo } }),
  });
}

export function adminDeleteUser(userId: string) {
  return authRequest<unknown>(`admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
}
