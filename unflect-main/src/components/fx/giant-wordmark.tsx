"use client";

import type { CSSProperties, PointerEvent } from "react";

const TEXT_PROPS = {
  x: 4,
  y: 200,
  textLength: 992,
  lengthAdjust: "spacing" as const,
  fontSize: 250,
};
const FONT: CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.03em" };

/**
 * The outlined UNFLECT wordmark. Drawn as SVG text with a fixed text length so the
 * full word always fits its container at every width (CSS font sizing clipped the T).
 * On hover, a soft pointer-following fill is revealed inside the outline.
 */
export function GiantWordmark() {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const mask = "radial-gradient(circle 280px at var(--mx, 50%) var(--my, 50%), black, transparent 70%)";

  return (
    <div
      onPointerMove={onMove}
      className="group relative select-none [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
    >
      <svg viewBox="0 0 1000 230" className="block h-auto w-full overflow-visible" role="img" aria-label="UNFLECT">
        <text {...TEXT_PROPS} style={FONT} fill="none" stroke="var(--color-line-strong)" strokeWidth="1">
          UNFLECT
        </text>
      </svg>
      <svg
        viewBox="0 0 1000 230"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <text {...TEXT_PROPS} style={FONT} fill="rgba(78,140,163,0.16)" stroke="rgba(111,168,189,0.5)" strokeWidth="1">
          UNFLECT
        </text>
      </svg>
    </div>
  );
}
