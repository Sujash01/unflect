"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { glassPointer } from "@/lib/pointer";
import { RollText } from "@/components/fx/roll-text";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { AccountHeaderButton } from "@/components/account/account-header-button";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // Tuck away while reading down, return the moment the reader turns back.
      setHidden((current) => (y > 360 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : current));
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const section = pathname === "/" ? "Home" : pathname.split("/")[1];

  return (
    <motion.header
      animate={{ y: hidden ? "-120%" : 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div
        onPointerMove={glassPointer}
        className={cn(
          "mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between gap-6 rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-700 sm:h-[68px] sm:px-6",
          scrolled ? "glass border-line" : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="inline-flex items-center rounded-full px-1.5 py-1.5 transition-opacity hover:opacity-80"
        >
          <Wordmark size={24} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 pr-2 font-mono text-[11px] tracking-[0.03em] text-muted md:flex">
            <motion.span key={section} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {section}
            </motion.span>
          </span>
          <AccountHeaderButton />
          <AnimatedThemeToggler className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bone/[0.04] text-bone transition-colors hover:bg-bone/[0.09]" />
          <Link
            href="/contact"
            className="group relative inline-flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full bg-indigo px-5 text-[13px] font-semibold text-[#0A0A0A] transition-colors duration-300 hover:bg-indigo-bright sm:px-6"
          >
            <span className="relative"><RollText>Start a project</RollText></span>
            <ArrowUpRight className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
