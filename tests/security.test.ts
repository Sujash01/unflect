import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { clientKey, rejectCrossOrigin, sameOrigin, safeNext } from "@/lib/auth/security";

const ORIGIN = "https://unflect.in";

function request(url: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, { headers });
}

beforeEach(() => {
  delete process.env.CLIENT_IP_HEADER;
});

afterEach(() => {
  delete process.env.CLIENT_IP_HEADER;
});

describe("sameOrigin / rejectCrossOrigin", () => {
  it("allows a matching origin", () => {
    expect(sameOrigin(request(`${ORIGIN}/api/enquiries`, { origin: ORIGIN }))).toBe(true);
    expect(rejectCrossOrigin(request(`${ORIGIN}/api/enquiries`, { origin: ORIGIN }))).toBeNull();
  });

  it("allows requests with no origin header", () => {
    expect(sameOrigin(request(`${ORIGIN}/api/enquiries`))).toBe(true);
  });

  it("blocks a mismatched origin", () => {
    const blocked = rejectCrossOrigin(
      request(`${ORIGIN}/api/enquiries`, { origin: "https://evil.example" }),
    );
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(403);
  });
});

describe("clientKey", () => {
  it("uses the left-most forwarded IP by default", () => {
    const key = clientKey(
      request(`${ORIGIN}/api/enquiries`, { "x-forwarded-for": "203.0.113.7, 10.0.0.1" }),
      "enquiry",
    );
    expect(key).toBe("203.0.113.7:enquiry");
  });

  it("falls back to x-real-ip then cf-connecting-ip", () => {
    expect(
      clientKey(request(`${ORIGIN}/api/enquiries`, { "x-real-ip": "198.51.100.9" }), "login"),
    ).toBe("198.51.100.9:login");
    expect(
      clientKey(request(`${ORIGIN}/api/enquiries`, { "cf-connecting-ip": "198.51.100.9" }), "login"),
    ).toBe("198.51.100.9:login");
  });

  it("keys on the configured trusted header only", () => {
    process.env.CLIENT_IP_HEADER = "cf-connecting-ip";
    const key = clientKey(
      request(`${ORIGIN}/api/enquiries`, {
        "x-forwarded-for": "spoofed",
        "cf-connecting-ip": "203.0.113.7",
      }),
      "enquiry",
    );
    expect(key).toBe("203.0.113.7:enquiry");
  });

  it("uses unknown when the trusted header is absent", () => {
    process.env.CLIENT_IP_HEADER = "cf-connecting-ip";
    expect(clientKey(request(`${ORIGIN}/api/enquiries`), "enquiry")).toBe("unknown:enquiry");
  });
});

describe("safeNext", () => {
  it("allows safe same-site paths", () => {
    expect(safeNext("/account")).toBe("/account");
    expect(safeNext("/admin?epage=2")).toBe("/admin?epage=2");
  });

  it("rejects open redirects and unsafe schemes", () => {
    expect(safeNext("https://evil.example")).toBe("/account");
    expect(safeNext("//evil.example")).toBe("/account");
    expect(safeNext("/\\evil")).toBe("/account");
    expect(safeNext("")).toBe("/account");
  });
});
