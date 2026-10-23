"use client";

import { useEffect, useState } from "react";
import { setScrollController } from "@/lib/scroll";

/**
 * Inertial scrolling. Navigation/history restoration is handled separately by
 * ScrollManager so Lenis never carries an old route's momentum into a new page.
 */
export function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const isTouchOnly = window.matchMedia("(pointer: coarse) and (hover: none)").matches;
      setEnabled(
        !isTouchOnly &&
          document.documentElement.dataset.smoothScroll !== "false" &&
          document.documentElement.dataset.reducedMotion !== "true" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    };
    sync();
    window.addEventListener("unflect:preferences", sync);
    return () => window.removeEventListener("unflect:preferences", sync);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setScrollController(null);
      return;
    }

    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let raf = 0;
    let isCancelled = false;

    import("lenis").then(({ default: LenisClass }) => {
      if (isCancelled) return;

      lenis = new LenisClass({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      setScrollController(lenis);

      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -88 });
    };

    document.addEventListener("click", onClick);

    return () => {
      isCancelled = true;
      document.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
      setScrollController(null);
      lenis?.destroy();
    };
  }, [enabled]);

  return null;
}
