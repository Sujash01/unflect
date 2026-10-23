"use client";

import * as React from "react";
import {
  motion,
  motionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* Single pointer system. One document-level listener total; everything else
   reads from these motion values. Never put pointer values in React state. */

export const pointerX = motionValue(-1000);
export const pointerY = motionValue(-1000);
export const pointerActive = motionValue(0);

export const finePointerQuery = "(pointer: fine)";

/** Call once at the root. Owns the only pointermove listener. */
export function usePointerSystem() {
  React.useEffect(() => {
    if (!window.matchMedia(finePointerQuery).matches) return;

    let active = false;
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      if (!active) {
        active = true;
        pointerActive.set(1);
      }
    };
    const onLeave = () => pointerActive.set(0);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}

function subscribeFinePointer(notify: () => void) {
  const mql = window.matchMedia(finePointerQuery);
  mql.addEventListener("change", notify);
  return () => mql.removeEventListener("change", notify);
}
function getFinePointerSnapshot() {
  return window.matchMedia(finePointerQuery).matches;
}
function getFinePointerServerSnapshot() {
  return false;
}

function subscribePreferences(notify: () => void) {
  window.addEventListener("unflect:preferences", notify);
  return () => window.removeEventListener("unflect:preferences", notify);
}
function getPreferencesSnapshot() {
  return document.documentElement.dataset.cursorEffects !== "false";
}
function getPreferencesServerSnapshot() {
  return true;
}

/** Ambient blue light that lags the cursor. Very low opacity by design. */
export function AmbientLight() {
  const reduceMotion = useReducedMotion();
  const isFine = React.useSyncExternalStore(subscribeFinePointer, getFinePointerSnapshot, getFinePointerServerSnapshot);
  const enabled = React.useSyncExternalStore(subscribePreferences, getPreferencesSnapshot, getPreferencesServerSnapshot);
  const sx = useSpring(pointerX, { damping: 30, stiffness: 60, mass: 1.4 });
  const sy = useSpring(pointerY, { damping: 30, stiffness: 60, mass: 1.4 });
  const x = useTransform(sx, (v) => v - 320);
  const y = useTransform(sy, (v) => v - 320);

  if (reduceMotion || !enabled || !isFine) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(78,140,163,0.075),transparent_62%)] sm:block"
      style={{ x, y }}
    />
  );
}

/** Feeds --mx/--my on a glass surface. Attach to the element's onPointerMove. */
export function glassPointer(event: React.PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}
