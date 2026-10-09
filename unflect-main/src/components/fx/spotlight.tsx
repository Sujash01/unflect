"use client";

import type { ElementType, ReactNode, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Wraps content in a surface whose light and edge follow the pointer. */
export function Spotlight({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: ElementType }) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag onPointerMove={onMove} className={cn("spotlight", className)}>
      {children}
    </Tag>
  );
}
