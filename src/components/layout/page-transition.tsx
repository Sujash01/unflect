"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsNavigating(true);
  }

  return (
    <div key={pathname} className={isNavigating ? "page-enter" : undefined}>
      {children}
    </div>
  );
}
