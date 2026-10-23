"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, UserRound } from "lucide-react";

function applyPreferences(settings: Record<string, unknown>) {
  const root = document.documentElement;
  root.dataset.reducedMotion = settings.reducedMotion === true ? "true" : "false";
  root.dataset.cursorEffects = settings.cursorEffects === false ? "false" : "true";
  root.dataset.smoothScroll = settings.smoothScroll === false ? "false" : "true";
  window.dispatchEvent(new CustomEvent("unflect:preferences"));
}

const BOT_UA_REGEX =
  /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|crawler|spider|robot|crawling/i;

function isCrawler(): boolean {
  if (typeof navigator === "undefined") return false;
  return Boolean(navigator.webdriver || BOT_UA_REGEX.test(navigator.userAgent || ""));
}

export function AccountHeaderButton() {
  const [signedIn, setSignedIn] = useState<boolean | null>(() =>
    isCrawler() ? false : null,
  );
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset navigation state whenever pathname changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNavigatingTo(null);
  }, [pathname]);

  useEffect(() => {
    let active = true;

    // Search crawlers never have an authenticated session. Skipping the request
    // prevents Search Console "Other error" alerts caused by robots.txt disallow rules.
    if (isCrawler()) {
      return;
    }

    const load = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as {
          authenticated?: boolean;
          settings?: Record<string, unknown>;
        };
        if (!active) return;
        applyPreferences(data.settings ?? {});
        setSignedIn(Boolean(data.authenticated));
      } catch {
        if (active) setSignedIn(false);
      }
    };

    let idleId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(() => void load(), { timeout: 2000 });
    } else {
      timerId = setTimeout(() => void load(), 200);
    }

    const interval = window.setInterval(load, 10 * 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      if (idleId !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (signedIn === null) {
    return <span aria-hidden="true" className="hidden h-9 w-9 sm:h-11 sm:w-11 sm:block" />;
  }

  if (signedIn) {
    const isNavigating = navigatingTo === "/account";
    return (
      <Link
        href="/account"
        prefetch={false}
        aria-label="Account"
        aria-busy={isNavigating ? "true" : undefined}
        onClick={() => {
          if (pathname !== "/account") setNavigatingTo("/account");
        }}
        className="inline-flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-line bg-bone/[0.04] text-bone transition-all duration-200 hover:bg-bone/[0.09] active:scale-[0.96] active:brightness-95"
      >
        {isNavigating ? (
          <Loader2 className="h-4 w-4 animate-spin text-indigo shrink-0" />
        ) : (
          <UserRound className="h-4 w-4" />
        )}
      </Link>
    );
  }

  const isNavigatingLogin = navigatingTo === "/login";
  return (
    <Link
      href="/login"
      prefetch={false}
      aria-busy={isNavigatingLogin ? "true" : undefined}
      onClick={() => {
        if (pathname !== "/login") setNavigatingTo("/login");
      }}
      className="hidden h-9 sm:h-11 items-center gap-1.5 rounded-full border border-line bg-bone/[0.04] px-3 sm:px-4 text-xs sm:text-sm text-bone transition-all duration-200 hover:bg-bone/[0.09] active:scale-[0.96] active:brightness-95 sm:inline-flex"
    >
      {isNavigatingLogin ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo shrink-0" />
      ) : null}
      <span>Sign in</span>
    </Link>
  );
}
