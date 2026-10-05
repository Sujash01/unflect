"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Reveal on mount (hero) or when scrolled into view. */
  mode?: "mount" | "view";
  /** Words rendered in the accent shimmer. */
  accent?: readonly string[];
};

/** Word-by-word masked rise. Text stays fully readable without JS or with reduced motion. */
export function SplitText({ text, className, delay = 0, stagger = 0.055, mode = "view", accent = [] }: SplitTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      {...(mode === "mount" ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, amount: 0.4 } })}
      transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
    >
      {words.map((word, i) => {
        const isAccent = accent.some((a) => word.replace(/[.,]/g, "").toLowerCase() === a.toLowerCase());
        return (
          <span key={i} className="split-word" aria-hidden="true">
            <motion.span
              className={isAccent ? "text-indigo-bright" : undefined}
              variants={{ hidden: reduce ? { y: 0 } : { y: "110%" }, shown: { y: 0 } }}
              transition={{ duration: reduce ? 0 : 0.95, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
