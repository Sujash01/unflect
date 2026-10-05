import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Shared button styling. Pure and server-safe so non-interactive surfaces can
 * reuse the exact same visual language (e.g. as a reference swatch).
 *
 * Design rules, applied everywhere:
 *  · Small controlled radius. A button is a control, not a pill.
 *  · Primary is solid indigo and lands on violet. The arrow sits on the violet
 *    end, so the affordance points where the eye already is.
 *  · Secondary is transparent with a violet/indigo edge, never a fill.
 *  · Nothing scales on hover except a 1% press, which is a physical response,
 *    not decoration.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.005em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-precision)] whitespace-nowrap select-none active:scale-[0.99] motion-reduce:active:scale-100";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-[0.8125rem]",
    md: "h-11 px-5 text-[0.875rem]",
    lg: "h-12 px-6 text-[0.9375rem]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "border border-indigo bg-indigo text-[#0A0A0A] hover:border-indigo-bright hover:bg-indigo-bright",
    outline:
      "border border-line-strong bg-transparent text-bone hover:border-bone/40 hover:bg-bone/[0.05]",
    ghost:
      "border border-transparent bg-transparent text-muted-strong hover:border-line hover:text-bone",
    quiet:
      "border border-line bg-navy-inset/60 text-muted-strong hover:border-line-strong hover:bg-navy-inset/70 hover:text-bone",
  };

  return [base, sizes[size], variants[variant], className]
    .filter(Boolean)
    .join(" ");
}

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentPropsWithoutRef<"button">;

/** Native button. Primarily used inside the enquiry form (client component). */
export function Button({ children, variant, size, className, ...rest }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...rest}>
      <span className="relative z-1 inline-flex items-center gap-2.5">{children}</span>
    </button>
  );
}
