"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { glassPointer } from "@/lib/pointer"

interface MagneticDockProps {
    /** Array of dock items */
    items: DockItemData[]
    /** Size of icons in pixels */
    iconSize?: number
    /** Maximum scale on hover */
    maxScale?: number
    /** Distance of magnetic effect in pixels */
    magneticDistance?: number
    /** Show labels on hover */
    showLabels?: boolean
    /** Dock position */
    position?: "bottom" | "top" | "left" | "right"
    /** Background style */
    variant?: "glass" | "solid" | "transparent"
    /** Custom class name */
    className?: string
}

interface DockItemData {
    /** Unique identifier */
    id: string
    /** Display label */
    label: string
    /** Icon component or image URL */
    icon: React.ReactNode
    /** Click handler */
    onClick?: () => void
    /** Whether item is active */
    isActive?: boolean
    /** Badge count */
    badge?: number
}

interface DockItemProps {
    item: DockItemData
    mouseX: MotionValue<number>
    iconSize: number
    maxScale: number
    magneticDistance: number
    showLabels: boolean
    isVertical: boolean
    reducedMotion: boolean
}

function DockItem({
    item,
    mouseX,
    iconSize,
    maxScale,
    magneticDistance,
    showLabels,
    isVertical,
    reducedMotion,
}: DockItemProps) {
    const ref = React.useRef<HTMLButtonElement>(null)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const showLabel = showLabels && (isHovered || isFocused)

    // Calculate distance from mouse to center of item
    const distance = useTransform(mouseX, (val: number) => {
        if (!ref.current) return magneticDistance + 1
        const rect = ref.current.getBoundingClientRect()
        const center = isVertical
            ? rect.top + rect.height / 2
            : rect.left + rect.width / 2
        return val - center
    })

    // Scale based on distance - closer = larger
    const scale = useTransform(distance, [-magneticDistance, 0, magneticDistance], [1, maxScale, 1])

    // Apply spring physics for smooth animation
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
    const smoothScale = useSpring(scale, springConfig)

    // Calculate the size based on scale
    const size = useTransform(smoothScale, (s) => s * iconSize)

    // Floating effect
    const y = useTransform(smoothScale, (s) => (s - 1) * -10)
    const smoothY = useSpring(y, springConfig)

    return (
        <motion.button
            ref={ref}
            type="button"
            tabIndex={0}
            aria-label={item.label}
            aria-current={item.isActive ? "page" : undefined}
            onClick={item.onClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "relative flex items-center justify-center",
                "rounded-2xl transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo/70",
                item.isActive && "bg-indigo/10 ring-1 ring-inset ring-indigo/30"
            )}
            style={{
                width: reducedMotion ? iconSize : size,
                height: reducedMotion ? iconSize : size,
                y: reducedMotion || isVertical ? 0 : smoothY,
                x: reducedMotion || !isVertical ? 0 : smoothY,
            }}
            whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        >
            {/* Icon Container */}
            <motion.div
                className={cn(
                    "relative w-full h-full rounded-xl overflow-hidden",
                    "bg-navy-raised",
                    "border border-white/10",
                    "shadow-[0_6px_18px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]",
                    "flex items-center justify-center",
                    "transition-colors duration-200"
                )}
                style={{
                    borderColor: isHovered ? "rgba(255,255,255,0.2)" : undefined,
                }}
            >
                {/* Icon */}
                <div aria-hidden="true" className={cn("w-[55%] h-[55%] flex items-center justify-center", item.isActive ? "text-indigo-bright" : "text-muted-strong")}>
                    {item.icon}
                </div>
            </motion.div>

            {/* Badge */}
            <AnimatePresence initial={false}>
                {item.badge !== undefined && item.badge > 0 && (
                    <motion.div
                        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                        className={cn(
                            "absolute -top-1 -right-1",
                            "min-w-[20px] h-5 px-1.5",
                            "rounded-full",
                            "bg-red-500",
                            "text-white text-xs font-semibold",
                            "flex items-center justify-center",
                            "border-2 border-[#EAE8E3]",
                            "shadow-lg"
                        )}
                    >
                        {item.badge > 99 ? "99+" : item.badge}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence initial={false}>
                {showLabel && (
                    <motion.div
                        aria-hidden="true"
                        initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute -top-10 left-1/2 -translate-x-1/2",
                            "px-3 py-1.5 rounded-lg",
                            "bg-navy-raised/95",
                            "backdrop-blur-sm",
                            "text-bone text-xs font-medium whitespace-nowrap",
                            "border border-white/10",
                            "shadow-lg shadow-black/40",
                            "pointer-events-none z-50"
                        )}
                    >
                        {item.label}
                        {/* Tooltip arrow */}
                        <div
                            className={cn(
                                "absolute left-1/2 -translate-x-1/2 -bottom-1",
                                "w-2 h-2 rotate-45",
                                "bg-navy-raised/95",
                                "border-r border-b border-white/10"
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.button>
    )
}

function MagneticDock({
    items,
    iconSize = 56,
    maxScale = 1.5,
    magneticDistance = 150,
    showLabels = true,
    position = "bottom",
    className,
}: MagneticDockProps) {
    const mousePosition = useMotionValue(Infinity)
    const reducedMotion = useReducedMotion() ?? false
    const isVertical = position === "left" || position === "right"

    const handleMouseMove = React.useCallback(
        (e: React.MouseEvent) => {
            if (isVertical) {
                mousePosition.set(e.clientY)
            } else {
                mousePosition.set(e.clientX)
            }
        },
        [mousePosition, isVertical]
    )

    const handleMouseLeave = () => {
        mousePosition.set(Infinity)
    }

    const positionStyles = {
        bottom: "flex-row",
        top: "flex-row",
        left: "flex-col",
        right: "flex-col",
    }

    return (
        <motion.div
            onMouseMove={reducedMotion ? undefined : handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onPointerMove={glassPointer}
            className={cn(
                "glass inline-flex items-end gap-1.5 p-2.5 rounded-[1.4rem]",
                positionStyles[position],
                "shadow-[0_22px_55px_-22px_rgba(0,0,0,0.85)]",
                className
            )}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
            {items.map((item) => (
                <DockItem
                    key={item.id}
                    item={item}
                    mouseX={mousePosition}
                    iconSize={iconSize}
                    maxScale={maxScale}
                    magneticDistance={magneticDistance}
                    showLabels={showLabels}
                    isVertical={isVertical}
                    reducedMotion={reducedMotion}
                />
            ))}
        </motion.div>
    )
}

// Preset icons for common use cases
function DockIconHome({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function DockIconSearch({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}

function DockIconFolder({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    )
}

function DockIconMail({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    )
}

function DockIconMusic({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    )
}

function DockIconSettings({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
}

function DockIconTrash({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    )
}

export {
    MagneticDock,
    DockIconHome,
    DockIconSearch,
    DockIconFolder,
    DockIconMail,
    DockIconMusic,
    DockIconSettings,
    DockIconTrash,
    type MagneticDockProps,
    type DockItemData,
}
