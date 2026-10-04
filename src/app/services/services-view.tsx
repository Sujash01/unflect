"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/content/services";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function ServicesView() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <EditorialPageHeader
        section="Services"
        title="Software for the way your business actually works."
        lede="Three connected disciplines. One goal: remove the gap between the problem your business has and the software it needs."
      />

      <section className="border-b border-white/10 bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="border-t border-white/10">
            {services.map((service, index) => {
              const isActive = active === service.slug;
              const dimmed = active !== null && !isActive;
              return (
                <article
                  key={service.slug}
                  className={cn(
                    "group border-b border-white/10 py-10 transition-opacity duration-500 sm:grid sm:grid-cols-[4rem_1fr] sm:gap-8",
                    dimmed ? "opacity-40" : "opacity-100",
                  )}
                  onMouseEnter={() => setActive(service.slug)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span className="font-mono text-[11px] tracking-[0.03em] text-[#4E8CA3]">0{index + 1}</span>
                  <div>
                    <Link
                      href={`/services/${service.slug}`}
                      onFocus={() => setActive(service.slug)}
                      onBlur={() => setActive(null)}
                      className="relative block"
                    >
                      <h2 className="font-display text-4xl  tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 sm:text-5xl">
                        {service.name}
                      </h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-strong">{service.summary}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{service.intro}</p>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-full w-px origin-top bg-indigo transition-transform duration-500 ease-out scale-y-0 group-hover:scale-y-100"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm text-muted">The distinction</p>
              <h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">
                We sell outcomes, not a pile of features.
              </h2>
            </div>
            <div className="border-y border-white/10">
              <div className="grid gap-8 py-7 sm:grid-cols-3">
                <div><p className="text-sm font-medium">Web</p><p className="mt-2 text-sm leading-6 text-muted">The customer or user-facing experience.</p></div>
                <div><p className="text-sm font-medium">Systems</p><p className="mt-2 text-sm leading-6 text-muted">The operating layer behind the business.</p></div>
                <div><p className="text-sm font-medium">Integrations</p><p className="mt-2 text-sm leading-6 text-muted">The connections that keep everything in sync.</p></div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
