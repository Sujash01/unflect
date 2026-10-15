"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Dispatch an event to start the global route loading indicator manually.
 */
export function startRouteLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("unflect:route-loading", { detail: { active: true } }));
  }
}

/**
 * Dispatch an event to stop the global route loading indicator manually.
 */
export function stopRouteLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("unflect:route-loading", { detail: { active: false } }));
  }
}

function RouteLoaderListener({
  onStart,
  onComplete,
}: {
  onStart: () => void;
  onComplete: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams?.toString() ?? "";
  const initialRef = useRef(true);

  // Complete progress whenever the route changes
  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    onComplete();
  }, [pathname, searchString, onComplete]);

  // Intercept click on links to trigger loader immediately
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Ignore modified clicks or non-primary clicks
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore external, hash-only, mailto, tel, javascript, download
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      try {
        const url = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Check if same origin
        if (url.origin !== currentUrl.origin) return;

        // Check if same page with same search query
        if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
          // If hash only differs, don't show route loader
          if (url.hash !== currentUrl.hash) return;
        }

        // Navigating to a new route or query!
        onStart();
      } catch {
        // invalid URL, ignore
      }
    };

    const handlePopState = () => {
      onStart();
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>;
      if (customEvent.detail?.active === false) {
        onComplete();
      } else {
        onStart();
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("unflect:route-loading", handleCustomEvent);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("unflect:route-loading", handleCustomEvent);
    };
  }, [onStart, onComplete]);

  return null;
}

export function RouteLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pillTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  };

  const start = () => {
    clearAllTimers();
    setVisible(true);
    setProgress(20);

    // Show floating pill if loading takes more than 150ms
    pillTimerRef.current = setTimeout(() => {
      setShowPill(true);
    }, 150);

    // Incrementally move progress bar
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + 15;
        if (prev < 75) return prev + 6;
        if (prev < 90) return prev + 2;
        return prev;
      });
    }, 200);

    // Safety timeout after 10s to avoid stuck loader
    safetyTimeoutRef.current = setTimeout(() => {
      finish();
    }, 10000);
  };

  const finish = () => {
    clearAllTimers();
    setProgress(100);
    setShowPill(false);

    // Allow the bar to reach 100% before fading out
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setProgress(0);
      }, 300);
    }, 200);
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <RouteLoaderListener onStart={start} onComplete={finish} />
      </Suspense>

      {/* Top progress bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="h-full bg-indigo transition-all duration-300 ease-out shadow-[0_0_12px_#4E8CA3,0_0_4px_#4E8CA3]"
          style={{
            width: `${progress}%`,
            transitionProperty: "width",
          }}
        />
      </div>

      {/* Subtle floating badge when page loading is underway */}
      {visible && showPill && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed right-4 top-4 z-[100] flex items-center gap-2 rounded-full border border-indigo/40 bg-navy/90 px-3 py-1.5 text-[11px] font-mono text-indigo shadow-lg shadow-black/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo shrink-0" />
          <span>Loading…</span>
        </div>
      )}
    </>
  );
}
