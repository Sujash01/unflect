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

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const saveScrollPosition = () => {
      const state = (window.history.state ?? {}) as HistoryState;
      window.history.replaceState(
        { ...state, [POSITION_KEY]: Math.max(0, window.scrollY) },
        "",
        window.location.href,
      );
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(saveScrollPosition, 150);
    };

    const onPopState = () => {
      popNavigation.current = true;
    };

    const onPageHide = () => {
      clearTimeout(timer);
      saveScrollPosition();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pagehide", onPageHide);
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
