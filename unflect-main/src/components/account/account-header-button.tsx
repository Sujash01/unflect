"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

function applyPreferences(settings: Record<string, unknown>) {
  const root = document.documentElement;
  root.dataset.reducedMotion = settings.reducedMotion === true ? "true" : "false";
  root.dataset.cursorEffects = settings.cursorEffects === false ? "false" : "true";
  root.dataset.smoothScroll = settings.smoothScroll === false ? "false" : "true";
  window.dispatchEvent(new CustomEvent("unflect:preferences"));
}

export function AccountHeaderButton() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

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

    void load();
    const interval = window.setInterval(load, 10 * 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (signedIn === null) {
    return <span aria-hidden="true" className="hidden h-9 w-9 sm:h-11 sm:w-11 sm:block" />;
  }

  if (signedIn) {
    return (
      <Link
        href="/account"
        aria-label="Account"
        className="inline-flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-line bg-bone/[0.04] text-bone transition-colors hover:bg-bone/[0.09]"
      >
        <UserRound className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden h-9 sm:h-11 items-center rounded-full border border-line bg-bone/[0.04] px-3 sm:px-4 text-xs sm:text-sm text-bone transition-colors hover:bg-bone/[0.09] sm:inline-flex"
    >
      Sign in
    </Link>
  );
}
