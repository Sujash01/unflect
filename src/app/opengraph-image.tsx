import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph card, rendered at build time with no external image assets.
 * Mirrors the site: charcoal canvas, steel-teal atmosphere, and restrained action accent,
 * mono metadata.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(70% 60% at 14% 10%, rgba(78,140,163,0.22), transparent 62%), radial-gradient(60% 55% at 88% 82%, rgba(40,92,112,0.18), transparent 60%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              border: "2px solid rgba(78,140,163,0.34)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path
                d="M8 19.2 14 8.6l6 10.6"
                stroke="#4E8CA3"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#F4F2EC",
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "0.18em",
              }}
            >
              UNFLECT
            </div>
            <div style={{ color: "#A5AAA6", fontSize: "17px", marginTop: "6px" }}>
              Web · Systems · Integrations · Studio
            </div>
          </div>
        </div>

        {/* Statement */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
          <div
            style={{
              color: "#F4F2EC",
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            We build software that solves real business problems.
          </div>
          <div
            style={{
              color: "#B4B8B2",
              fontSize: "24px",
              lineHeight: 1.4,
              marginTop: "20px",
            }}
          >
            A small software studio that builds custom web products, internal systems and integrations.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "2px",
                backgroundImage: "linear-gradient(to right, #285C70, #4E8CA3)",
              }}
            />
            <div style={{ color: "#C9CCC6", fontSize: "20px" }}>
              Discover → Define → Build → Deploy → Evolve
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(78,140,163,0.16)",
            paddingTop: "28px",
          }}
        >
          <div style={{ color: "#A5AAA6", fontSize: "20px" }}>Solve the problem first.</div>
          <div style={{ color: "#A5AAA6", fontSize: "20px" }}>AI assists; people answer.</div>
        </div>
      </div>
    ),
    size,
  );
}
