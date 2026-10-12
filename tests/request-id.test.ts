import { describe, expect, it } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { generateRequestId, getRequestId, setRequestId } from "@/lib/request-id";
import { middleware } from "@/middleware";

function req(url: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, { headers });
}

describe("request id helpers", () => {
  it("generates a non-empty id", () => {
    expect(generateRequestId().length).toBeGreaterThan(0);
  });

  it("accepts a valid client-supplied id", () => {
    const id = getRequestId(req("https://unflect.in/api/enquiries", { "x-request-id": "abc-123_def.456" }));
    expect(id).toBe("abc-123_def.456");
  });

  it("rejects an unsafe client-supplied id and generates one", () => {
    const id = getRequestId(req("https://unflect.in/api/enquiries", { "x-request-id": "<script>alert(1)</script>" }));
    expect(id).not.toContain("<script>");
    expect(id.length).toBeGreaterThan(0);
  });

  it("rejects an over-long client-supplied id", () => {
    const id = getRequestId(req("https://unflect.in/api/enquiries", { "x-request-id": "a".repeat(500) }));
    expect(id.length).toBeLessThanOrEqual(64);
  });

  it("sets the header on a response", async () => {
    const response = new NextResponse("ok");
    setRequestId(response, "req-1");
    expect(response.headers.get("x-request-id")).toBe("req-1");
  });
});

describe("middleware request id propagation", () => {
  it("returns an x-request-id header for an anonymous request", () => {
    const response = middleware(req("https://unflect.in/api/enquiries"));
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("reuses a valid client-supplied id end to end", () => {
    const response = middleware(req("https://unflect.in/api/enquiries", { "x-request-id": "trace-me-123" }));
    expect(response.headers.get("x-request-id")).toBe("trace-me-123");
  });

  it("replaces an unsafe client-supplied id", () => {
    const response = middleware(req("https://unflect.in/api/enquiries", { "x-request-id": "bad id with spaces" }));
    expect(response.headers.get("x-request-id")).not.toBe("bad id with spaces");
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });
});
