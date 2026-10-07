"use client";

import Link from "next/link";
import { useState } from "react";
import { services, servicesComparison } from "@/content/services";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function ServicesView() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <EditorialPageHeader
        section="Services"
        title="Software for the way your business actually works."
        lede="Three connected disciplines. One goal: remove the gap between the problem your business has and the software it needs."
      />

      {/* Main List */}
      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="border-t border-line">
            {services.map((service, index) => {
              const isActive = active === service.slug;
              const dimmed = active !== null && !isActive;
              return (
                <article
                  key={service.slug}
                  className={cn(
                    "group border-b border-line py-10 transition-opacity duration-500 sm:grid sm:grid-cols-[4rem_1fr] sm:gap-8",
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
                      <h2 className="font-display text-4xl tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 sm:text-5xl text-bone">
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

      {/* Accessible Services Comparison (What each is, when to choose it) */}
      <section
        aria-labelledby="comparison-heading"
        className="border-b border-line py-20 sm:py-28"
      >
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Decision guide
            </p>
            <h2
              id="comparison-heading"
              className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.02em] sm:text-5xl text-bone"
            >
              Which discipline fits your situation?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-strong">
              We separate work by where the friction lives — in front of your customers, behind your operations, or between your third-party tools.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {servicesComparison.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col justify-between rounded-3xl border border-line bg-module/40 p-7 sm:p-8 transition-colors hover:border-line-strong"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-indigo">
                      {item.index}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
                      {item.slug}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl text-bone">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-strong">
                    {item.summary}
                  </p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs font-semibold text-bone">
                      When to choose it:
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {item.whenToChoose}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs font-semibold text-bone">
                      Typical deliverables:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {item.typicalDeliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-strong"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo/70"
                          />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                  <Link
                    href={`/services/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-bone hover:text-indigo transition-colors"
                  >
                    Explore {item.name}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <ButtonLink
                    href={item.contactHref}
                    location={`services_comparison_${item.slug}`}
                    variant="outline"
                    size="sm"
                  >
                    Start with {item.name}
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The distinction */}
      <section className="bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm text-muted">The distinction</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                We sell outcomes, not a pile of features.
              </h2>
            </div>
            <div className="border-y border-line">
              <div className="grid gap-8 py-7 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-bone">Web</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The customer or user-facing experience.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">Systems</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The operating layer behind the business.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">Integrations</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The connections that keep everything in sync.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
