import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   UNFLECT — MODULE SYSTEM
   ---------------------------------------------------------------------------
   The single card primitive. Every panel on the site — service, case study,
   process stage, security level, engagement block — is a Module, so the
   interaction language is identical everywhere by construction.

   A Module is built from four parts:
     1. Surface      dark navy, small controlled radius, hairline violet edge
     2. Edge filament a lit gradient along the top, brightest under the index
     3. Corner ticks L-shaped marks that read as a viewport or a bracket
     4. Illumination  a violet wash from above, on hover only

   There are deliberately no drop shadows on content, no scaling, and no glass.
   The module lifts by changing colour, not by growing.
   ========================================================================== */

type ModuleProps = {
  children: ReactNode;
  className?: string;
  /** Adds hover response. Off for panels that are not themselves targets. */
  interactive?: boolean;
  as?: ElementType;
  /** Corner ticks. On for standalone modules, off when nested in a tight grid. */
  ticks?: boolean;
  /** Top edge filament. Off for modules nested inside another module. */
  edge?: boolean;
  /** Denser background texture for modules holding dense content. */
  texture?: "none" | "fine" | "nodes";
  id?: string;
};

export function Module({
  children,
  className,
  interactive = true,
  as: Tag = "div",
  ticks = true,
  edge = true,
  texture = "none",
  id,
}: ModuleProps) {
  const textureClass =
    texture === "fine"
      ? "bg-grid-fine"
      : texture === "nodes"
        ? "bg-node-field"
        : "";

  return (
    <Tag
      id={id}
      className={cn(
        "group/module relative isolate overflow-hidden rounded-sm border border-edge bg-module",
        textureClass,
        interactive &&
          "transition-[border-color,background-color] duration-400 ease-[var(--ease-precision)] hover:border-edge-strong hover:bg-module-raised",
        className,
      )}
    >
      {/* Illumination: a violet wash from above. Sits under the content and
          above the surface, so text contrast is unaffected. */}
      {interactive ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(177,140,255,0.10),transparent_62%)] opacity-0 transition-opacity duration-500 ease-[var(--ease-precision)] group-hover/module:opacity-100"
        />
      ) : null}

      {/* Edge filament. */}
      {edge ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(61,70,232,0.55)_18%,rgba(177,140,255,0.7)_50%,transparent)] opacity-70 transition-opacity duration-400 group-hover/module:opacity-100"
        />
      ) : null}

      {/* Corner ticks — the recurring signature. */}
      {ticks ? (
        <>
          <Tick position="left-top" />
          <Tick position="right-top" />
          <Tick position="left-bottom" />
          <Tick position="right-bottom" />
        </>
      ) : null}

      <div className="relative z-1 flex h-full flex-col">{children}</div>
    </Tag>
  );
}

type TickPosition = "left-top" | "right-top" | "left-bottom" | "right-bottom";

const tickPosition: Record<TickPosition, string> = {
  "left-top": "left-2 top-2 border-l border-t",
  "right-top": "right-2 top-2 border-r border-t",
  "left-bottom": "bottom-2 left-2 border-b border-l",
  "right-bottom": "bottom-2 right-2 border-b border-r",
};

function Tick({ position }: { position: TickPosition }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute h-2 w-2 border-edge opacity-45 transition-opacity duration-400 group-hover/module:opacity-100",
        tickPosition[position],
      )}
    />
  );
}

/* ==========================================================================
   INDICES, NODES AND METADATA
   ========================================================================== */

/** Index numeral with a tick — the structural signature of the site. */
export function IndexMark({
  children,
  className,
  tone = "violet",
}: {
  children: ReactNode;
  className?: string;
  tone?: "violet" | "indigo" | "muted";
}) {
  const toneClass =
    tone === "indigo" ? "text-indigo-bright" : tone === "muted" ? "text-muted" : "text-indigo";
  const ruleClass =
    tone === "indigo" ? "bg-indigo-bright/60" : tone === "muted" ? "bg-line-strong" : "bg-indigo/60";

  return (
    <span className={cn("label-mono inline-flex items-center gap-2", toneClass, className)}>
      <span aria-hidden="true" className={cn("h-px w-4", ruleClass)} />
      {children}
    </span>
  );
}

/**
 * A connection point. Small by design — these are diagram elements, not icons.
 * `live` adds a slow halo and is reserved for the single active element in a
 * group.
 */
export function NodeDot({
  tone = "idle",
  live = false,
  className,
}: {
  tone?: "idle" | "indigo" | "violet" | "pink";
  live?: boolean;
  className?: string;
}) {
  const toneClass = {
    idle: "border-edge-strong bg-transparent",
    indigo: "border-indigo bg-indigo",
    violet: "border-indigo bg-indigo",
    pink: "border-indigo bg-indigo",
  }[tone];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        toneClass,
        live && "node-live",
        className,
      )}
    />
  );
}

/** Monospace metadata row. Used for category, state and technical detail. */
export function ModuleMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("meta-mono text-muted", className)}>{children}</p>;
}

/** Hairline label that opens a module's content. */
export function ModuleLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("label-mono text-muted", className)}>{children}</p>;
}

/** Full-spectrum rule. Progression only — never behind text. */
export function EdgeRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px w-full bg-spectrum-gradient opacity-70", className)}
    />
  );
}

/* ==========================================================================
   INSET PANEL
   A quieter well for grouped content inside a module. No hover, no ticks.
   ========================================================================== */

export function Panel({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-sm border border-line-soft bg-navy-inset",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ==========================================================================
   LISTS
   Markers are nodes, not bullets — never colour alone.
   ========================================================================== */

export function MarkerList({
  items,
  className,
  tone = "violet",
}: {
  items: readonly string[];
  className?: string;
  tone?: "violet" | "indigo" | "muted";
}) {
  const markerClass = {
    violet: "bg-indigo/70",
    indigo: "bg-indigo",
    muted: "bg-line-strong",
  }[tone];

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-strong"
        >
          <span aria-hidden="true" className={cn("mt-[0.6rem] h-1 w-1 shrink-0", markerClass)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered step list for "how it works" sequences. */
export function StepList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ol className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => (
        <li key={item} className="flex gap-5 py-5">
          <span className="label-mono shrink-0 pt-1 text-indigo">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[0.9375rem] leading-relaxed text-muted-strong">{item}</span>
        </li>
      ))}
    </ol>
  );
}

/* ==========================================================================
   LINK
   The underlined-with-rule treatment used for every in-content navigation.
   ========================================================================== */

export function RuleLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group/rl inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="h-px w-0 bg-indigo transition-all duration-300 ease-[var(--ease-precision)] group-hover/rl:w-3.5"
      />
      {children}
    </span>
  );
}
