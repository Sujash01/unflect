"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * A soft trailing ring that swells over interactive elements.
 * The native cursor is left untouched. Fine pointers only.
 * Elements can opt in to a label with data-cursor="View".
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });
  const [state, setState] = useState<"idle" | "link" | "label">("idle");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor], a, button, summary, [role='button']") as HTMLElement | null;
      if (!el) return setState("idle");
      const text = el.getAttribute("data-cursor");
      if (text) {
        setLabel(text);
        setState("label");
      } else setState("link");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduce, x, y]);

  const size = state === "label" ? 84 : state === "link" ? 46 : 14;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden transition-opacity duration-300 sm:block"
    >
      <div
        ref={ring}
        style={{ width: size, height: size }}
        className={
          "uf-cursor-ring -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border " +
          (state === "label"
            ? "border-indigo-bright/60 bg-indigo/90 text-[#0A0A0A]"
            : state === "link"
              ? "border-indigo-bright/70 bg-indigo/10"
              : "border-bone/60 bg-bone/10")
        }
      >
        {state === "label" ? <span className="label-mono text-[11px] text-[#0A0A0A]">{label}</span> : null}
      </div>
    </motion.div>
  );
}
