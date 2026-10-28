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
        title="Automate repetitive work. Connect your software."
        lede="Four connected automation disciplines plus secondary software development services. One goal: eliminate manual operational friction."
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

          {/* Secondary Services Callout */}
          <div className="mt-12 rounded-3xl border border-line bg-module/30 p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <span className="label-mono text-indigo">Secondary services</span>
              <h3 className="mt-2 font-display text-2xl text-bone sm:text-3xl">
                Other Development Services
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-strong">
                Need website development, custom web applications, or business dashboards? We group our secondary development offerings under a dedicated page.
              </p>
            </div>
            <div className="mt-6 sm:mt-0 shrink-0">
              <ButtonLink
                href="/services/other-services"
                location="services_overview_other_services"
                variant="outline"
                size="lg"
              >
                View other services →
              </ButtonLink>
            </div>
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
              We separate work by where the friction lives — in routine manual tasks, customer conversational channels, disconnected tools, or unstructured documents.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicesComparison.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col justify-between rounded-3xl border border-line bg-module/40 p-6 sm:p-7 transition-colors hover:border-line-strong"
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
              <div className="grid gap-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-bone">Business Automation</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The operational workflow layer removing repetitive tasks.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">WhatsApp</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The conversational channel for triage and bookings.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">Integrations</p>
                  <p className="mt-2 text-sm leading-6 text-muted">The connections keeping tools and databases in sync.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">AI Workflows</p>
                  <p className="mt-2 text-sm leading-6 text-muted">Focused intelligence for document parsing and routing.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
