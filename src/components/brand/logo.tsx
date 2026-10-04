import { cn } from "@/lib/utils";

/** The single UNFLECT mark. The same geometry is used by the site header, footer and favicon. */
export function Logo({ className, size = 26 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect x="1.6" y="1.6" width="24.8" height="24.8" rx="5" stroke="#EAE8E3" strokeWidth="1.4" opacity="0.28" />
      <path d="M8 19.2 14 8.6l6 10.6" stroke="#EAE8E3" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.4 19.2h5.2" stroke="#4E8CA3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className, size = 26, showText = true }: { className?: string; size?: number; showText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo size={size} />
      {showText ? <span className="font-sans text-[0.9375rem] font-semibold tracking-[0.03em] text-bone">UNFLECT</span> : null}
    </span>
  );
}
