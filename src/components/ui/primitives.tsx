import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

/** Consistent horizontal rhythm and maximum measure across every page. */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("container-page", className)}>{children}</Tag>;
}

/* ==========================================================================
   SECTION
   Every section opens with the same identifier bar: a mono section code, then
   a lit filament running to the right edge. It is the site's spine — the
   thing that makes a stack of sections read as one designed surface rather
   than a list of blocks.
   ========================================================================== */

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Vertical scale. `tight` for paired sections, `loose` for major beats. */
  spacing?: "tight" | "normal" | "loose";
  as?: ElementType;
  labelledBy?: string;
  background?: "default" | "raised" | "inset" | "deep";
  /** Section code, e.g. "03". Rendered in the identifier bar. */
  code?: string;
  /** Accessible name for the identifier bar when `code` alone is ambiguous. */
  codeLabel?: string;
};

const spacingMap = {
  tight: "py-16 sm:py-20",
  normal: "py-20 sm:py-28 lg:py-32",
  loose: "py-24 sm:py-36 lg:py-44",
} as const;

const backgroundMap = {
  default: "",
  raised: "bg-navy-raised",
  inset: "bg-navy-inset/70",
  deep: "bg-navy",
} as const;

export function Section({
  children,
  className,
  id,
  spacing = "normal",
  as: Tag = "section",
  labelledBy,
  background = "default",
  code,
  codeLabel,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-24 lg:scroll-mt-28",
        spacingMap[spacing],
        backgroundMap[background],
        className,
      )}
    >
      {code ? (
        <Container>
          <SectionDivider code={code} label={codeLabel} />
        </Container>
      ) : null}
      {children}
    </Tag>
  );
}

/**
 * The identifier bar. A mono code, then a gradient filament that fades out —
 * the site's recurring structural motif and its substitute for heavy section
 * borders.
 */
export function SectionDivider({ code, label }: { code: string; label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="mb-12 flex items-center gap-5 sm:mb-16 lg:mb-20"
    >
      <span className="label-mono flex shrink-0 items-center gap-2.5 text-indigo">
        <span className="h-1 w-1 bg-indigo" />
        {code}
      </span>
      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(78,140,163,0.45),rgba(78,140,163,0.18)_38%,transparent)]" />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}

type RuleProps = {
  className?: string;
  /** `fade` softens toward the right; `solid` is a constant hairline. */
  tone?: "fade" | "solid";
};

export function Rule({ className, tone = "fade" }: RuleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-px w-full",
        tone === "fade" ? "rule-fade" : "bg-line",
        className,
      )}
    />
  );
}

/** Small mono label used to open a section. */
export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <p className={cn("label-mono flex items-center gap-2.5 text-indigo", className)}>
      {dot ? <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-indigo" /> : null}
      <span>{children}</span>
    </p>
  );
}

/**
 * Interior page header. Interior pages get the palette as light, not the
 * shader — the shader is reserved for the homepage hero and conversion beats.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-fine mask-fade-radial opacity-60"
      />
      {/* Indigo bloom, top-left. Palette as light rather than as a shader. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-64 -left-40 h-[34rem] w-[52rem] max-w-[140vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(78,140,163,0.14),transparent_66%)] blur-3xl"
      />
      <Container>
        <div className="max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-7 text-display">{title}</h1>
          {lede ? (
            <p className="mt-7 max-w-2xl text-lead text-muted-strong">{lede}</p>
          ) : null}
          {children ? <div className="mt-10 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </Container>
    </header>
  );
}

/** Data list with hairline separators — used for handover, controls, etc. */
export function DefinitionList({
  items,
  className,
}: {
  items: readonly { label: string; detail: string; meta?: string }[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-2 py-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-8"
        >
          <dt className="text-[0.9375rem] font-medium text-bone">{item.label}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-muted-strong">
            {item.detail}
            {item.meta ? (
              <span className="label-mono mt-2 block text-muted">{item.meta}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Small inline tag. Not colour-only: always carries a text label. */
export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "signal";
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded-sm border px-2.5 py-1.5",
        tone === "signal"
          ? "border-indigo/35 bg-indigo-wash text-indigo-bright"
          : "border-line text-muted",
      )}
    >
      {children}
    </span>
  );
}
