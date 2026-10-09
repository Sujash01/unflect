import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { ServiceBlock } from "@/components/services/service-block";
import { Container } from "@/components/ui/primitives";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Module, NodeDot } from "@/components/ui/module";
import { getService, services, type ServiceSlug } from "@/content/services";
import { handoverDeliverables, clientOwnedInfrastructure } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return { title: "Service not found" };
  }

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const others = services.filter((item) => item.slug !== service.slug) as readonly {
    slug: ServiceSlug;
    name: string;
    summary: string;
  }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} — ${service.summary}`,
    description: service.seo.description,
    serviceType: service.name,
    provider: { "@type": "Organization", name: "UNFLECT" },
    url: `/services/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EditorialPageHeader
        section={`Service ${service.index}`}
        title={service.name}
        lede={service.summary}
        aside={
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              href={`/contact?type=${service.contactQueryType}`}
              location={`service_${service.slug}_header`}
              size="lg"
            >
              Start a project
            </ButtonLink>
            <ButtonLink
              href="/services"
              location={`service_${service.slug}_header`}
              variant="outline"
              size="lg"
            >
              All services
            </ButtonLink>
          </div>
        }
      />

      <ServiceBlock service={service} location={`service_${service.slug}`} />

      {/* How it connects to the Discover-Define-Build-Deploy-Evolve process */}
      <section
        aria-labelledby="process-connection-heading"
        className="border-t border-line bg-navy-inset/60 py-20 sm:py-28"
      >
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Delivery model
            </p>
            <h2
              id="process-connection-heading"
              className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl"
            >
              How {service.name} connects to our process.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-strong">
              Every project follows the same five distinct stages. Here is how that sequence applies specifically to {service.name.toLowerCase()} software.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {service.processStages.map((stage) => (
              <Module
                key={stage.stage}
                className="flex flex-col justify-between p-6"
                interactive={false}
              >
                <div>
                  <span className="font-mono text-xs text-indigo">
                    {stage.stage}
                  </span>
                  <p className="mt-4 text-xs leading-relaxed text-muted-strong">
                    {stage.summary}
                  </p>
                </div>
              </Module>
            ))}
          </div>
        </Container>
      </section>

      {/* Handover & Ownership Deliverables */}
      <section
        aria-labelledby="handover-heading"
        className="border-t border-line py-20 sm:py-28"
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
                We build software for clients to run and control. You receive the complete source repository, credentials, and documentation — nothing is locked away.
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

      {/* Closing "Is this your situation?" CTA */}
      <section
        aria-labelledby="situation-cta-heading"
        className="border-t border-line bg-navy-inset/80 py-20 sm:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Is this your situation?
            </p>
            <h2
              id="situation-cta-heading"
              className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl"
            >
              Tell us what {service.name.toLowerCase()} software needs to do for your business.
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-sm leading-6 text-muted-strong">
              A concise summary of the problem today is enough to start. We will review your brief and reply with an honest read on scope, approach, and fit.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href={`/contact?type=${service.contactQueryType}`}
                location={`service_${service.slug}_closing_cta`}
                size="lg"
              >
                Discuss your project
              </ButtonLink>
              <ButtonLink
                href="/process"
                location={`service_${service.slug}_closing_cta`}
                variant="outline"
                size="lg"
              >
                See our process
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Sibling services — keeps the offering coherent, not siloed. */}
      <section
        aria-labelledby="other-services-heading"
        className="border-t border-line py-16 sm:py-20"
      >
        <Container>
          <h2 id="other-services-heading" className="text-title">
            The other two disciplines
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {others.map((other, index) => (
              <li key={other.slug} className="flex">
                <Link
                  href={`/services/${other.slug}`}
                  className="group/other w-full rounded-sm"
                >
                  <Module className="w-full p-7">
                    <div className="flex items-center justify-between gap-4">
                      <span className="label-mono text-indigo">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <NodeDot
                        tone={index === 0 ? "indigo" : "violet"}
                      />
                    </div>
                    <span className="mt-6 block text-[1.0625rem] font-medium text-bone transition-colors duration-200 group-hover/other:text-indigo">
                      {other.name}
                    </span>
                    <span className="mt-3 block text-[0.9375rem] leading-relaxed text-muted-strong">
                      {other.summary}
                    </span>
                    <span className="label-mono mt-7 inline-flex items-center gap-2.5 text-indigo">
                      Explore {other.name}
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
    </>
  );
}
