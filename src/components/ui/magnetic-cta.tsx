"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
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

  return (
    <div ref={outer} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex">
      <motion.div style={{ x, y }}>
        <Link
          href={href}
          className={
            variant === "solid"
              ? "group inline-flex h-14 items-center gap-2.5 rounded-full bg-indigo px-9 text-base font-semibold text-[#0A0A0A] transition-colors duration-300 hover:bg-indigo-bright active:scale-[0.98]"
              : "group inline-flex h-14 items-center gap-2.5 rounded-full border border-white/15 px-9 text-base font-medium text-bone transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.05] active:scale-[0.98]"
          }
        >
          <RollText>{label}</RollText>
        </Link>
      </motion.div>
    </div>
  );
}
