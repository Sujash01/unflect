"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Fires once the element enters the viewport (default) or on mount. */
  mode?: "viewport" | "mount";
};

/**
 * Purposeful scroll reveal: a short rise and fade, once, then left alone.
 *
 * Accessibility contract:
 *  - Content renders visible in the HTML. `data-hidden` is only ever added
 *    from JS, and only alongside the observer that removes it. No-JS users and
 *    crawlers are never left with invisible content.
 *  - `prefers-reduced-motion` bypasses the effect entirely.
 *  - State is applied directly to the DOM node rather than through React state,
 *    so a reveal costs zero re-renders.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  mode = "viewport",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || mode === "mount" || typeof IntersectionObserver === "undefined") {
      node.dataset.shown = "true";
      return;
    }

    node.dataset.hidden = "true";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          delete node.dataset.hidden;
          node.dataset.shown = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
