"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { glassPointer } from "@/lib/pointer";

export interface DockItemData {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: number;
}

interface MagneticDockProps {
  items: DockItemData[];
  iconSize?: number;
  maxScale?: number;
  magneticDistance?: number;
  showLabels?: boolean;
  position?: "bottom" | "top" | "left" | "right";
  className?: string;
}

interface DockItemProps {
  item: DockItemData;
  mousePosition: MotionValue<number>;
  iconSize: number;
  maxScale: number;
  magneticDistance: number;
  showLabels: boolean;
  isVertical: boolean;
  reducedMotion: boolean;
}

function DockItem({
  item,
  mousePosition,
  iconSize,
  maxScale,
  magneticDistance,
  showLabels,
  isVertical,
  reducedMotion,
}: DockItemProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const showLabel = showLabels && (hovered || focused);

  const distance = useTransform(mousePosition, (value) => {
    if (!ref.current) return magneticDistance + 1;
    const rect = ref.current.getBoundingClientRect();
    const center = isVertical
      ? rect.top + rect.height / 2
      : rect.left + rect.width / 2;
    return value - center;
  });

  const scale = useTransform(
    distance,
    [-magneticDistance, 0, magneticDistance],
    [1, maxScale, 1],
  );
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothScale = useSpring(scale, springConfig);
  const size = useTransform(smoothScale, (value) => value * iconSize);
  const lift = useTransform(smoothScale, (value) => (value - 1) * -10);
  const smoothLift = useSpring(lift, springConfig);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      aria-label={item.label}
      aria-current={item.isActive ? "page" : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo/70",
        item.isActive && "bg-indigo/10 ring-1 ring-inset ring-indigo/30",
      )}
      style={{
        width: reducedMotion ? iconSize : size,
        height: reducedMotion ? iconSize : size,
        y: reducedMotion || isVertical ? 0 : smoothLift,
        x: reducedMotion || !isVertical ? 0 : smoothLift,
      }}
      whileTap={reducedMotion ? undefined : { scale: 0.9 }}
    >
      <motion.span
        aria-hidden="true"
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl",
          "border border-line bg-navy-raised",
          "shadow-[0_6px_18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]",
        )}
        style={{
          borderColor: hovered ? "var(--color-line-strong)" : undefined,
        }}
      >
        <span
          className={cn(
            "flex h-[55%] w-[55%] items-center justify-center",
            item.isActive ? "text-indigo-bright" : "text-muted-strong",
          )}
        >
          {item.icon}
        </span>
      </motion.span>

      <AnimatePresence initial={false}>
        {item.badge !== undefined && item.badge > 0 ? (
          <motion.span
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-navy bg-[#c95f55] px-1.5 text-xs font-semibold text-bone shadow-lg"
          >
            {item.badge > 99 ? "99+" : item.badge}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showLabel ? (
          <motion.span
            aria-hidden="true"
            initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-navy-raised/95 px-3 py-1.5 text-xs font-medium text-bone shadow-lg shadow-black/40 backdrop-blur-sm"
          >
            {item.label}
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-line bg-navy-raised/95" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.a>
  );
}

export function MagneticDock({
  items,
  iconSize = 56,
  maxScale = 1.5,
  magneticDistance = 150,
  showLabels = true,
  position = "bottom",
  className,
}: MagneticDockProps) {
  const mousePosition = useMotionValue(Infinity);
  const reducedMotion = useReducedMotion() ?? false;
  const isVertical = position === "left" || position === "right";

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      mousePosition.set(isVertical ? event.clientY : event.clientX);
    },
    [isVertical, mousePosition],
  );

  const positionStyles = {
    bottom: "flex-row",
    top: "flex-row",
    left: "flex-col",
    right: "flex-col",
  } as const;

  return (
    <motion.div
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
      onMouseLeave={() => mousePosition.set(Infinity)}
      onPointerMove={glassPointer}
      className={cn(
        "glass inline-flex items-end gap-0.5 sm:gap-1 rounded-[1.2rem] sm:rounded-[1.4rem] p-1.5 sm:p-2.5",
        positionStyles[position],
        "shadow-[0_22px_55px_-22px_rgba(0,0,0,0.85)]",
        className,
      )}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          mousePosition={mousePosition}
          iconSize={iconSize}
          maxScale={maxScale}
          magneticDistance={magneticDistance}
          showLabels={showLabels}
          isVertical={isVertical}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}
