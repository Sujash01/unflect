"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { pointerX, pointerY } from "@/lib/pointer";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const tilt = (v: number, size: number, max: number) =>
  v <= -500 || typeof window === "undefined" ? 0 : Math.max(-max, Math.min(max, ((v - size / 2) / (size / 2)) * max));

/**
 * An open laptop, drawn in CSS/SVG. The screen carries the UNFLECT mark and name,
 * the lid chin carries the small badge. Only motion: one entrance, and a gentle
 * pointer tilt (a few degrees) that is off for reduced-motion users.
 * Screen type is sized in container units so it scales with the laptop.
 */
export function LaptopVisual() {
  const reduce = useReducedMotion();
  const rotY = useSpring(useTransform(pointerX, (v) => tilt(v, typeof window === "undefined" ? 1 : window.innerWidth, 6)), { damping: 30, stiffness: 70 });
  const rotX = useSpring(useTransform(pointerY, (v) => -tilt(v, typeof window === "undefined" ? 1 : window.innerHeight, 3)), { damping: 30, stiffness: 70 });

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[38rem] px-[4%]"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
    >
      {/* Soft room light and ground shadow */}
      <div aria-hidden="true" className="absolute inset-x-[6%] top-[4%] h-[70%] rounded-full bg-[radial-gradient(ellipse,rgba(78,140,163,0.12),transparent_68%)] blur-3xl" />
      <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-5 h-12 rounded-[100%] bg-black/55 blur-2xl" />

      <div style={{ perspective: 1800 }} className="relative">
        <motion.div
          style={reduce ? undefined : { rotateY: rotY, rotateX: rotX }}
          role="img"
          aria-label="An open laptop showing the UNFLECT logo and name"
        >
          {/* Lid */}
          <div className="relative rounded-t-[1.15rem] border border-white/[0.13] bg-gradient-to-b from-[#2b2d30] to-[#17181a] px-[2.4%] pb-[5.4%] pt-[2.4%] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {/* Camera */}
            <span aria-hidden="true" className="absolute left-1/2 top-[1%] h-[0.3rem] w-[0.3rem] -translate-x-1/2 rounded-full bg-[#0a0a0b] ring-1 ring-white/10" />

            {/* Screen */}
            <div className="@container relative aspect-[16/10] overflow-hidden rounded-[0.45rem] bg-[#06080a] ring-1 ring-black">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(78,140,163,0.2),transparent_60%),linear-gradient(180deg,#0b1216,#06080a)]" />
              <div aria-hidden="true" className="absolute inset-0 bg-grid-fine opacity-[0.22] [mask-image:radial-gradient(ellipse_at_50%_55%,black,transparent_72%)]" />

              {/* Site nav */}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.1 }}
                className="absolute inset-x-[5cqw] top-[3.4cqw] flex items-center justify-between"
              >
                <span className="flex items-center gap-[1.1cqw] [&>svg]:h-[3.1cqw] [&>svg]:w-[3.1cqw]">
                  <Logo size={14} />
                  <span className="text-[2cqw] font-semibold tracking-[0.16em] text-bone">UNFLECT</span>
                </span>
                <span className="flex items-center gap-[2.6cqw] text-[1.7cqw] text-muted">
                  <span>Services</span>
                  <span>Work</span>
                  <span>Process</span>
                  <span className="rounded-full bg-bone px-[1.8cqw] py-[0.8cqw] font-medium text-[#0A0A0A]">Start a project</span>
                </span>
              </motion.div>

              {/* Centrepiece: mark + name */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-[3cqw]">
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
                  className="block [&>svg]:h-[13cqw] [&>svg]:w-[13cqw] [&>svg]:drop-shadow-[0_0_18px_rgba(78,140,163,0.28)]"
                >
                  <Logo size={64} />
                </motion.span>
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
                  className="mt-[2.4cqw] pl-[0.2em] font-display text-[7.2cqw] font-medium leading-none tracking-[0.2em] text-bone"
                >
                  UNFLECT
                </motion.p>
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.25 }}
                  className="mt-[2cqw] text-[1.9cqw] text-muted-strong"
                >
                  Software for the way your business actually works.
                </motion.p>
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.4 }}
                  className="mt-[3.2cqw] flex items-center gap-[1.8cqw] text-[1.5cqw] text-muted"
                >
                  <span>Web</span>
                  <span aria-hidden="true" className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-muted/60" />
                  <span>Systems</span>
                  <span aria-hidden="true" className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-muted/60" />
                  <span>Integrations</span>
                </motion.p>
              </div>

              {/* Glass reflection */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.055),transparent_34%)]" />
            </div>

            {/* Chin badge */}
            <span className="absolute bottom-[1.5%] left-1/2 flex -translate-x-1/2 items-center gap-[0.4rem] opacity-60">
              <Logo size={10} />
              <span className="text-[0.5rem] font-medium tracking-[0.3em] text-bone">UNFLECT</span>
            </span>
          </div>

          {/* Base */}
          <div className="-mx-[6%]">
            <svg viewBox="0 0 1000 34" className="block h-auto w-full" aria-hidden="true">
              <defs>
                <linearGradient id="unflect-base" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3b3d40" />
                  <stop offset="1" stopColor="#1a1b1d" />
                </linearGradient>
              </defs>
              <path d="M0 0H1000L989 27Q987 34 979 34H21Q13 34 11 27Z" fill="url(#unflect-base)" />
              <path d="M392 0H608Q602 9 586 9H414Q398 9 392 0Z" fill="#0f1012" />
              <path d="M0 .5H1000" stroke="rgba(255,255,255,0.14)" />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
