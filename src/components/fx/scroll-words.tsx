"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({ word, range, progress, accent }: { word: string; range: [number, number]; progress: MotionValue<number>; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="mr-[0.26em] inline-block">
      <motion.span style={{ opacity }} className={accent ? "text-indigo-bright" : undefined}>
        {word}
      </motion.span>
    </span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className, accent = [] }: { text: string; className?: string; accent?: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1.6 / words.length;
        return (
          <Word
            key={i}
            word={word}
            range={[start, Math.min(1, end)]}
            progress={scrollYProgress}
            accent={accent.includes(word.replace(/[.,]/g, "").toLowerCase())}
          />
        );
      })}
    </p>
  );
}
