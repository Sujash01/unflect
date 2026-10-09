import type { ReactNode } from "react";

/** Label that rolls up and is replaced by a copy on hover. Parent must be `group`. */
export function RollText({ children }: { children: string | ReactNode }) {
  return (
    <span className="relative block overflow-hidden leading-[1.25]">
      <span className="block transition-transform duration-500 ease-[var(--ease-precision)] group-hover:-translate-y-full">{children}</span>
      <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-precision)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}
