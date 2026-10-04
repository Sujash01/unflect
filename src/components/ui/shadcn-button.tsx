"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]",
  {
    variants: {
      variant: {
        default: "bg-indigo text-[#0A0A0A] shadow-[0_12px_30px_-16px_rgba(78,140,163,0.6)] hover:bg-indigo-bright",
        destructive: "bg-red-500 text-white hover:bg-red-400",
        outline: "border border-white/20 bg-transparent text-bone hover:border-white/40 hover:bg-white/[0.06]",
        secondary: "bg-white/[0.06] text-bone hover:bg-white/10",
        ghost: "text-bone/70 hover:bg-white/[0.06] hover:text-bone",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ShadcnButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ShadcnButton = React.forwardRef<HTMLButtonElement, ShadcnButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
ShadcnButton.displayName = "ShadcnButton";

export { ShadcnButton, buttonVariants };
