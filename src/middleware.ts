import { NextResponse, type NextRequest } from "next/server";

import { getRequestId, REQUEST_ID_HEADER } from "@/lib/request-id";

/**
 * Assigns a stable request id to every matched request and returns it in the
 * `x-request-id` response header. The id is also placed on the incoming request
 * headers so route handlers can include it in their logs. A client-supplied id
 * is reused only if it passes validation; otherwise a server id is generated.
 */
export function middleware(request: NextRequest) {
  const requestId = getRequestId(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

// Run on all pages and API routes, excluding Next.js static assets and images
// (which must stay cacheable and do not need request ids).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
