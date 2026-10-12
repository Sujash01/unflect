import nextConfig from "../next.config.mjs";

/**
 * Verifies that sensitive API and authenticated page routes carry
 * `Cache-Control: no-store` (so shared caches cannot store them), while the
 * global rule does not force no-store on static assets / public pages.
 *
 * This checks the Next.js headers() configuration directly; it does not require
 * a running server. Run with: node scripts/verify-cache-headers.mjs
 */

const headers = await nextConfig.headers();

const sensitiveSources = [
  "/api/auth/:path*",
  "/api/account/:path*",
  "/api/admin/:path*",
  "/account/:path*",
  "/admin/:path*",
  "/settings/:path*",
];

let ok = true;

for (const source of sensitiveSources) {
  const entry = headers.find((item) => item.source === source);
  const cacheControl = entry?.headers.find((header) => header.key === "Cache-Control");
  if (!entry || !cacheControl || !cacheControl.value.includes("no-store")) {
    console.error(`MISSING no-store Cache-Control for ${source}`);
    ok = false;
  }
}

const globalEntry = headers.find((item) => item.source === "/(.*)");
const globalNoStore = globalEntry?.headers.find((header) => header.key === "Cache-Control")?.value.includes("no-store");
if (globalNoStore) {
  console.error("Global /(.*) rule must not force no-store (would break static asset caching)");
  ok = false;
}

if (!ok) {
  console.error("Cache header verification FAILED");
  process.exit(1);
}

console.log("Cache header verification passed: sensitive routes are no-store, static assets remain cacheable.");
