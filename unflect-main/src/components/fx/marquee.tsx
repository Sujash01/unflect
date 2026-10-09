import type { ReactNode } from "react";

/** Infinite horizontal ticker. Content is duplicated once for a seamless loop. */
export function Marquee({ children, duration = 38, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div
      className={"marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] " + (className ?? "")}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
