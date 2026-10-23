"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { processStages } from "@/content/process";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ProcessRail() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  });

  return (
    <ol ref={ref} className="relative mt-16">
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-[0.45rem] top-0 w-px bg-line sm:left-[0.45rem]"
      />
      <motion.span
        aria-hidden="true"
        style={reduce ? { scaleY: 1 } : { scaleY: fill }}
        className="absolute bottom-0 left-[0.45rem] top-0 w-px origin-top bg-gradient-to-b from-indigo via-indigo-bright to-indigo"
      />
      {processStages.map((stage) => (
        <motion.li
          key={stage.id}
          initial={reduce ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="group relative grid gap-3 py-8 pl-10 sm:grid-cols-[5rem_minmax(0,16rem)_1fr] sm:items-baseline sm:gap-8 sm:pl-12"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.45rem] flex h-[0.95rem] w-[0.95rem] items-center justify-center rounded-full border border-line-strong bg-navy"
          >
            <span className="h-1 w-1 rounded-full bg-muted" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.03em] text-indigo">
            {stage.index}
          </span>
          <h3 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-none tracking-[-0.015em] text-bone transition-transform duration-500 ease-[var(--ease-precision)] group-hover:translate-x-2">
            {stage.name}
          </h3>
          <p className="max-w-xl text-sm leading-6 text-muted-strong transition-colors">
            {stage.summary}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
