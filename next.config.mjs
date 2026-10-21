const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: "/work/operational-consolidation",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/commerce-platform",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/systems-integration",
        destination: "/work",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Content-Security-Policy is shipped in Report-Only mode so violations are
    // surfaced without breaking hydration, fonts, images or auth callbacks.
    // Promote to `Content-Security-Policy` only after validating in a browser.
    const cspReportOnly = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https:",
    ].join("; ");

    // Sensitive API responses and authenticated pages must never be stored in a
    // shared cache. Static assets (/_next/static, images) and public marketing
    // pages keep their normal, cacheable behaviour.
    const noStore = [{ key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" }];

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      { source: "/api/auth/:path*", headers: noStore },
      { source: "/api/account/:path*", headers: noStore },
      { source: "/api/admin/:path*", headers: noStore },
      { source: "/account/:path*", headers: noStore },
      { source: "/admin/:path*", headers: noStore },
      { source: "/settings/:path*", headers: noStore },
    ];
  },
};

export default nextConfig;
