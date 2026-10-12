import { NextResponse, type NextRequest } from "next/server";

export const REQUEST_ID_HEADER = "x-request-id";

// Only accept a client-supplied ID that is a safe, bounded token. Anything else
// (or none) is replaced with a server-generated ID, so a caller cannot inject
// arbitrary values or rotate IDs to defeat log correlation.
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function generateRequestId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  // Fallback for runtimes without Web Crypto (not expected on Node 18+ / edge).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getRequestId(request: NextRequest): string {
  const provided = request.headers.get(REQUEST_ID_HEADER);
  if (provided && SAFE_ID.test(provided)) return provided;
  return generateRequestId();
}

/** Attach the id to a response so clients and logs can correlate a request. */
export function setRequestId(response: NextResponse, id: string): NextResponse {
  response.headers.set(REQUEST_ID_HEADER, id);
  return response;
}
