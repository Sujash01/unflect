import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Module, NodeDot } from "@/components/ui/module";
import { caseStudies } from "@/content/case-studies";
import { handoverDeliverables, clientOwnedInfrastructure } from "@/content/company";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Other Software Development Services | UNFLECT",
  description:
    "UNFLECT's secondary software development services: bespoke web applications, commercial websites, interactive business dashboards, and custom software engineering.",
  path: "/services/other-services",
});

const otherOfferings = [
  {
    id: "web-dev",
    index: "01",
    name: "Website Development",
    summary:
      "Commercial websites built for clear business utility, conversion, and straightforward content management.",
    detail:
      "Fast, responsive business websites engineered without bloated templates or plugins. Designed mobile-first with high performance, accessibility, and clear commercial purpose.",
    deliverables: [
      "Custom business websites built for conversion",
      "Clean, maintainable content structures",
      "Mobile-first, accessible frontend engineering",
      "Fast loading speeds with zero plugin bloat",
    ],
  },
  {
    id: "web-apps",
    index: "02",
    name: "Custom Web Applications",
    summary:
      "Client portals, SaaS platforms, and specialized operational tools tailored to your exact business model.",
    detail:
      "When off-the-shelf software cannot fit your operational processes, we build authenticated web applications with granular permissions, role-based access, and robust data protection.",
    deliverables: [
      "Authenticated customer and client self-service portals",
      "SaaS product MVPs and scalable platforms",
      "Role-based access control (RBAC) and audit trails",
      "Custom business logic and database architecture",
    ],
  },
  {
    id: "dashboards",
    index: "03",
    name: "Business Dashboards & Analytics",
    summary:
      "Interactive executive dashboards, churn tracking, and reporting models built on real operational data.",
    detail:
      "Replace fragile, disconnected spreadsheets with centralized business intelligence dashboards that give decision-makers live visibility into performance metrics.",
    deliverables: [
      "Interactive business intelligence dashboards",
      "Customer retention and churn analytics models",
      "Automated operational reporting views",
      "Multi-source data aggregation and clean summaries",
    ],
  },
  {
    id: "custom-software",
    index: "04",
    name: "Custom Software Engineering",
    summary:
      "Tailored full-stack development, database architecture, and legacy software replacements.",
    detail:
      "End-to-end engineering for specialized software requirements that fall outside standard automation or off-the-shelf tools, engineered for long-term maintainability.",
    deliverables: [
      "Custom relational database design and migration",
      "Full-stack software engineering and API development",
      "Legacy system migration and modernisation",
      "Comprehensive documentation, source code handover, and runbooks",
    ],
  },
] as const;

export default function OtherServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Other Software Development Services",
        description:
          "Secondary development services offered by UNFLECT: bespoke web applications, commercial websites, interactive business dashboards, and custom software development.",
        provider: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        url: `${site.url}/services/other-services`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${site.url}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Other Services",
            item: `${site.url}/services/other-services`,
          },
        ],
      },
    ],
  };

  const sampleStudies = caseStudies.filter((s) => s.status !== "coming_soon");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="border-b border-line bg-navy/40">
        <Container>
          <ol className="flex flex-wrap items-center gap-x-2 py-3 text-[0.8125rem] text-muted">
            <li>
              <Link href="/" className="inline-flex min-h-8 items-center transition-colors hover:text-bone">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="inline-flex min-h-8 items-center transition-colors hover:text-bone">
                Services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="inline-flex min-h-8 items-center truncate text-muted-strong font-medium">
              Other Services
            </li>
          </ol>
        </Container>
      </nav>

      <EditorialPageHeader
        section="Secondary Services"
        title="Websites, Web Applications & Analytics"
        lede="While business automation and systems integration are our primary focus, we continue to engineer custom web applications, responsive websites, executive dashboards, and tailored software."
        aside={
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              href="/contact?type=web"
              location="other_services_header"
              size="lg"
            >
              Start a project
            </ButtonLink>
            <ButtonLink
              href="/services"
              location="other_services_header"
              variant="outline"
              size="lg"
            >
              Automation services
            </ButtonLink>
          </div>
        }
      />

      {/* Offerings Grid */}
      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Software Disciplines
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl">
              Development capabilities built to support your business.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-strong">
              Whether you need a customer-facing web portal, a commercial marketing platform, or operational dashboards, we apply the same disciplined engineering standards.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {otherOfferings.map((offering) => (
              <div
                key={offering.id}
                className="flex flex-col justify-between rounded-3xl border border-line bg-module/40 p-7 sm:p-8 transition-colors hover:border-line-strong"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-indigo">
                      {offering.index}
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
                      {offering.id}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl text-bone">
                    {offering.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-strong">
                    {offering.summary}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {offering.detail}
                  </p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs font-semibold text-bone">
                      Typical deliverables:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {offering.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-strong"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo/70"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <ButtonLink
                    href={`/contact?type=${offering.id === "web-dev" || offering.id === "web-apps" ? "web" : "internal-system"}`}
                    location={`other_services_${offering.id}`}
                    variant="outline"
                    size="sm"
                  >
                    Discuss {offering.name} →
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Relevant Project Demos / Case Studies */}
      {sampleStudies.length > 0 ? (
        <section
          aria-labelledby="sample-projects-heading"
          className="border-b border-line py-20 sm:py-28"
        >
          <Container>
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
                Demonstrated Work
              </p>
              <h2
                id="sample-projects-heading"
                className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl"
              >
                Relevant builds & sample applications.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-strong">
                Explore real software built by UNFLECT demonstrating our web application and analytics architecture.
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {sampleStudies.map((study) => (
                <div
                  key={study.slug}
                  className="rounded-3xl border border-line bg-module/40 p-6 sm:p-8 transition-colors hover:border-line-strong"
                >
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
                          {study.sector}
                        </span>
                        <span className="rounded-full border border-indigo/40 bg-indigo/10 px-2.5 py-0.5 font-mono text-[11px] text-indigo-bright">
                          {study.statusLabel}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl text-bone sm:text-3xl">
                        <Link href={`/work/${study.slug}`} className="hover:underline">
                          {study.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted-strong">
                        {study.summary}
                      </p>
                      <div className="mt-6">
                        <Link
                          href={`/work/${study.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-bright hover:text-bone"
                        >
                          Explore case study & architecture
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    {study.image ? (
                      <Link
                        href={`/work/${study.slug}`}
                        className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-navy/60 block"
                      >
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Handover & Ownership Deliverables */}
      <section
        aria-labelledby="handover-heading"
        className="border-b border-line bg-navy-inset/60 py-20 sm:py-28"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
                Ownership commitment
              </p>
              <h2
                id="handover-heading"
                className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl"
              >
                What you own at handover.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-strong">
                We build software for clients to run and control. You receive the complete source repository, credentials, and documentation — nothing is held hostage.
              </p>

              <div className="mt-8 rounded-2xl border border-line bg-navy-raised p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-bone">
                  Infrastructure ownership
                </p>
                <ul className="mt-4 space-y-3">
                  {clientOwnedInfrastructure.map((item) => (
                    <li key={item.id} className="text-xs text-muted-strong">
                      <span className="font-medium text-bone">{item.label}:</span>{" "}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {handoverDeliverables.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-line bg-module/40 p-5"
                >
                  <p className="text-sm font-medium text-bone">{item.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Primary Automation Disciplines Navigation */}
      <section
        aria-labelledby="primary-services-heading"
        className="border-b border-line py-16 sm:py-20"
      >
        <Container>
          <div className="max-w-2xl mb-8">
            <p className="label-mono text-indigo">Core focus</p>
            <h2 id="primary-services-heading" className="text-title mt-2">
              Primary automation disciplines
            </h2>
            <p className="mt-3 text-sm text-muted-strong">
              Looking to eliminate manual operational friction? Explore our primary business automation and integration services.
            </p>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <li key={service.slug} className="flex">
                <Link
                  href={`/services/${service.slug}`}
                  className="group/other w-full rounded-sm"
                >
                  <Module className="w-full p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="label-mono text-indigo">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <NodeDot tone={index % 2 === 0 ? "indigo" : "violet"} />
                      </div>
                      <span className="mt-5 block text-[1.0625rem] font-medium text-bone transition-colors duration-200 group-hover/other:text-indigo">
                        {service.name}
                      </span>
                      <span className="mt-2 block text-xs leading-relaxed text-muted-strong">
                        {service.summary}
                      </span>
                    </div>
                    <span className="label-mono mt-6 inline-flex items-center gap-2 text-indigo">
                      Explore
                      <span
                        aria-hidden="true"
                        className="text-[0.875rem] normal-case transition-transform duration-300 ease-[var(--ease-precision)] group-hover/other:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Module>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Closing CTA */}
      <section
        aria-labelledby="other-cta-heading"
        className="bg-navy-inset/80 py-20 sm:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Have a project in mind?
            </p>
            <h2
              id="other-cta-heading"
              className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl"
            >
              Discuss your web or software requirements.
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-sm leading-6 text-muted-strong">
              A concise brief of your project requirements is all we need to start. We will review your scope and provide a direct read on technical approach, timeline, and fit.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href="/contact"
                location="other_services_closing_cta"
                size="lg"
              >
                Discuss your project
              </ButtonLink>
              <ButtonLink
                href="/services"
                location="other_services_closing_cta"
                variant="outline"
                size="lg"
              >
                All services
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
