"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";
import { RollText } from "@/components/fx/roll-text";

/**
 * Primary CTA with a subtle magnetic pull (capped ~7px) and spring return.
 * Native cursor stays; reduced motion disables the pull.
 */
export function MagneticCta({
  href = "/contact",
  label = "Start a project",
  variant = "solid",
}: {
  href?: string;
  label?: string;
  variant?: "solid" | "outline";
}) {
  const outer = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavigatingHref(null);
  }

  const isNavigating = navigatingHref !== null && navigatingHref === href && navigatingHref !== pathname;

  const mx = useSpring(0, { damping: 18, stiffness: 180, mass: 0.5 });
  const my = useSpring(0, { damping: 18, stiffness: 180, mass: 0.5 });
  const x = useTransform(mx, (v) => v);
  const y = useTransform(my, (v) => v);

  function onMove(event: React.MouseEvent) {
    if (reduceMotion || !outer.current) return;
    const rect = outer.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    mx.set(Math.max(-7, Math.min(7, dx / 14)));
    my.set(Math.max(-7, Math.min(7, dy / 14)));
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const isInternal = href.startsWith("/") && !href.startsWith("//");

  return (
    <div ref={outer} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex">
      <motion.div style={{ x, y }}>
        <Link
          href={href}
          prefetch={false}
          aria-busy={isNavigating ? "true" : undefined}
          onClick={() => {
            if (isInternal && href !== pathname) {
              setNavigatingHref(href);
            }
          }}
          className={
            variant === "solid"
              ? `group inline-flex h-14 items-center gap-2.5 rounded-full bg-indigo px-9 text-base font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-indigo-bright active:scale-[0.97] active:brightness-95 ${isNavigating ? "cursor-wait pointer-events-none opacity-85" : ""}`
              : `group inline-flex h-14 items-center gap-2.5 rounded-full border border-line-strong px-9 text-base font-medium text-bone transition-all duration-200 hover:border-bone/40 hover:bg-bone/[0.05] active:scale-[0.97] active:brightness-95 ${isNavigating ? "cursor-wait pointer-events-none opacity-85" : ""}`
          }
        >
          {isNavigating ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0 text-current" />
          ) : null}
          <RollText>{label}</RollText>
        </Link>
      </motion.div>
    </div>
  );
}
