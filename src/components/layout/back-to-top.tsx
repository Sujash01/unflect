"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex w-fit items-center gap-2 text-muted-strong transition-colors hover:text-bone cursor-pointer"
      aria-label="Scroll back to top"
    >
      <span className="u-link">Back to top</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:-translate-y-1 group-hover:border-bone/60">
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
