"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { useReveal } from "@/components/home/selected-work";

export function ServicesList() {
  const [active, setActive] = useState<string | null>(null);
  const r = useReveal();

  return (
    <div className="mt-16 border-t border-line">
      {services.map((service, index) => {
        const dimmed = active !== null && active !== service.slug;
        return (
          <motion.div key={service.slug} {...r(index * 0.08)}>
            <Link
              href={`/services/${service.slug}`}
              prefetch={false}
              onMouseEnter={() => setActive(service.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(service.slug)}
              onBlur={() => setActive(null)}
              className={[
                "group relative grid items-center gap-4 border-b border-line py-10 transition-all duration-500 sm:grid-cols-[5rem_1fr_auto] sm:py-12",
                dimmed ? "opacity-30" : "opacity-100",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-indigo/[0.05] to-transparent transition-all duration-700 ease-[var(--ease-precision)] group-hover:w-full"
              />
              <span className="relative font-mono text-[11px] tracking-[0.03em] text-indigo">
                0{index + 1}
              </span>
              <div className="relative">
                <h3 className="font-display text-[clamp(2.6rem,5.6vw,4.8rem)] leading-none tracking-[-0.02em] text-bone transition-all duration-500 ease-[var(--ease-precision)] group-hover:translate-x-3">
                  {service.name}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-strong transition-colors duration-300">
                  {service.summary}
                </p>
              </div>
              <span className="relative hidden h-14 w-14 items-center justify-center rounded-full border border-line-strong transition-all duration-500 ease-[var(--ease-precision)] group-hover:border-bone/60 sm:flex">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
