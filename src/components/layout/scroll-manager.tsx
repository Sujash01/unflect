"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { jumpToPosition, jumpToTop } from "@/lib/scroll";

const POSITION_KEY = "__unflectScroll";

type HistoryState = Record<string, unknown> & {
  [POSITION_KEY]?: number;
};

export function ScrollManager() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);
  const popNavigation = useRef(false);
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const replaceScrollPosition = () => {
      const now = Date.now();
      if (now - lastUpdateTime.current < 200) return;
      lastUpdateTime.current = now;

      const state = (window.history.state ?? {}) as HistoryState;
      window.history.replaceState(
        { ...state, [POSITION_KEY]: Math.max(0, window.scrollY) },
        "",
        window.location.href,
      );
    };

    replaceScrollPosition();

    let frame = 0;
    const remember = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(replaceScrollPosition);
    };
    const onPopState = () => {
      popNavigation.current = true;
    };

    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", onPopState);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", onPopState);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;

    const shouldRestore = popNavigation.current;
    popNavigation.current = false;

    if (!shouldRestore) {
      jumpToTop();
      return;
    }

    const state = (window.history.state ?? {}) as HistoryState;
    const saved = typeof state[POSITION_KEY] === "number" ? state[POSITION_KEY] : 0;
    requestAnimationFrame(() => jumpToPosition(saved));
  }, [pathname]);

  return null;
}
