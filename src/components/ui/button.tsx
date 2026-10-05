"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonStyles, Button, type ButtonSize, type ButtonVariant } from "./button-styles";

export { Button, buttonStyles, type ButtonSize, type ButtonVariant };

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Analytics context, e.g. "hero", "footer", "work_card". */
  location?: string;
  /** Visual affordance for links that leave the site or open in a new tab. */
  external?: boolean;
};

type ButtonLinkProps = BaseProps &
  (
    | { href: string; newTab?: boolean; onClick?: () => void }
    | { href?: undefined; newTab?: never; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" }
  );

/**
 * The single interactive primitive used site-wide for conversion actions.
 * Emits a `cta_click` event with enough context to attribute conversions to
 * the section that produced them.
 */
export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  className,
  location = "unknown",
  href,
  newTab,
  external,
  onClick,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, className });

  if (href) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    const shared = {
      className: cn(classes, "data-focus-managed"),
      onClick: () => {
        analytics.ctaClick(location, textOf(children), href);
        onClick?.();
      },
    };

    if (isInternal) {
      return (
        <Link href={href} {...shared}>
          <span className="relative z-1 inline-flex items-center gap-2.5">
            {children}
          </span>
        </Link>
      );
    }

    return (
      <a href={href} target={newTab ? "_blank" : undefined} rel="noopener noreferrer" {...shared}>
        <span className="relative z-1 inline-flex items-center gap-2.5">
          {children}
          {external ? <ExternalArrow /> : null}
        </span>
      </a>
    );
  }

  return (
    <button
      type={(rest as { type?: "button" | "submit" }).type ?? "button"}
      className={classes}
      onClick={() => {
        analytics.ctaClick(location, textOf(children), "#form");
        onClick?.();
      }}
    >
      <span className="relative z-1 inline-flex items-center gap-2.5">{children}</span>
    </button>
  );
}

/** Quiet right-pointing arrow that advances on hover. */
function ExternalArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-3 w-3 shrink-0 opacity-60"
      fill="none"
    >
      <path
        d="M4.5 1.5H1.5v9h9V7.5M7 1.5h3.5V5M10.5 1.5L6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Flattens children to a plain string for analytics labels. */
function textOf(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).filter(Boolean).join(" ");
  return "";
}
