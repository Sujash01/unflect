import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { ServiceBlock } from "@/components/services/service-block";
import { Container } from "@/components/ui/primitives";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Module, NodeDot } from "@/components/ui/module";
import { getService, services, type ServiceSlug } from "@/content/services";
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
            <ButtonLink href="/contact" location={`service_${service.slug}_header`} size="lg">
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

      {/* Sibling services \u2014 keeps the offering coherent, not siloed. */}
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

      <CtaSection
        eyebrow={`Discuss ${service.name.toLowerCase()}`}
        title={`Tell us what ${service.name.toLowerCase()} needs to do for your business.`}
        body="A short description of the problem is enough to start. We will ask the rest."
        location={`service_${service.slug}_footer_cta`}
        secondaryHref="/process"
        secondaryLabel="See our process"
      />
    </>
  );
}
