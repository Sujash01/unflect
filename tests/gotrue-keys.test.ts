import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { adminBanUser, adminDeleteUser, adminUnbanUser, signIn, signUp } from "@/lib/auth/gotrue";

const AUTH_HEADER: string[] = [];

beforeEach(() => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
  process.env.SUPABASE_ANON_KEY = "anon-key";
  AUTH_HEADER.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: unknown, init?: { headers?: Record<string, string> }) => {
      AUTH_HEADER.push(init?.headers?.["Authorization"] ?? "");
      return new Response(JSON.stringify({ user: {} }), { status: 200 });
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;
});

describe("Supabase key separation", () => {
  it("uses the anon key for ordinary sign-up", async () => {
    await signUp("ada@example.com", "Str0ng!pass", "Ada", "https://unflect.in/auth/callback");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer anon-key");
  });

  it("uses the anon key for ordinary sign-in", async () => {
    await signIn("ada@example.com", "Str0ng!password");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer anon-key");
  });

  it("uses the service-role key only for privileged admin operations", async () => {
    await adminDeleteUser("3f2504e0-4f89-11d3-9a0c-0305e82c3301");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer service-key");

    await adminBanUser("3f2504e0-4f89-11d3-9a0c-0305e82c3301", "876000h");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer service-key");

    await adminUnbanUser("3f2504e0-4f89-11d3-9a0c-0305e82c3301");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer service-key");
  });

  it("falls back to the service key for normal auth when the anon key is unset", async () => {
    delete process.env.SUPABASE_ANON_KEY;
    await signIn("ada@example.com", "Str0ng!password");
    expect(AUTH_HEADER.at(-1)).toBe("Bearer service-key");
  });
});
