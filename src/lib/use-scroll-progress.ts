"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven progress across an element, 0 → 1.
 *
 * Used by the two places on the site where a line fills as it travels:
 * the problem-to-outcome track and the process pipeline. One hook so both
 * behave identically, including under `prefers-reduced-motion`, where the
 * line simply reads as full.
 *
 * Writes are coalesced into a single animation frame, so a fast scroll cannot
 * queue up more work than the browser can retire.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced) {
        setProgress(1);
        return;
      }
      const rect = node.getBoundingClientRect();
      // Fill completes as the element's midpoint passes 40% down the viewport.
      const anchor = window.innerHeight * 0.4;
      const total = rect.height + anchor;
      const travelled = anchor - rect.top;
      setProgress(total > 0 ? Math.min(1, Math.max(0, travelled / total)) : 0);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    // First measurement deferred, so no state is written synchronously inside
    // the effect body.
    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { ref, progress };
}
