"use client";

import { AmbientLight, usePointerSystem } from "@/lib/pointer";

export function SiteEffects() {
  usePointerSystem();
  return <AmbientLight />;
}
