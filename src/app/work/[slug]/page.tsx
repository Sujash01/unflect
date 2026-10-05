import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Container, Rule, Section, Tag } from "@/components/ui/primitives";

/** Shown instead of a claim when a record is a placeholder. Never hidden. */
function PlaceholderBadge() {
  return (
    <Tag tone="signal">
      <span className="sr-only">Status: </span>Illustrative example
    </Tag>
  );
}
import { Reveal } from "@/components/ui/reveal";
import { MarkerList, Module, NodeDot, StepList } from "@/components/ui/module";
import { CaseStudyViewTracker } from "@/components/work/tracked-case-study-link";
import { caseStudies, getCaseStudy, type CaseStudy } from "@/content/case-studies";
import { servicesBySlug } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return { title: "Case study not found" };

return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
    type: "article",
    // Placeholders must never enter an index as though they were real results.
    robots: study.status === "placeholder" ? { index: false, follow: true } : undefined,
  });
}

function DetailBlock({
  id,
  index,
  label,
  children,
}: {
  id: string;
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 lg:scroll-mt-28">
      <Reveal>
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-mono flex items-center gap-2.5 text-indigo">
                <span aria-hidden="true" className="h-px w-4 bg-indigo/60" />
                {index}
              </p>
              <h2 id={`${id}-heading`} className="mt-4 font-display text-[1.25rem]  text-bone">
                {label}
              </h2>
            </div>
            <NodeDot tone="indigo" className="mt-1.5 hidden lg:block" />
          </div>
          <div className="text-[0.9375rem] leading-relaxed text-muted-strong">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function Metrics({ study }: { study: CaseStudy }) {
  if (study.metrics.length === 0) return null;

  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      {study.metrics.map((metric) => (
        <Module key={metric.label} className="p-6" ticks={false}>
          <NodeDot tone="indigo" />
          <dd className="mt-5 font-display text-[1.75rem]  text-indigo">
            {metric.value}
          </dd>
          <dt className="mt-2 text-[0.875rem] leading-relaxed text-muted-strong">
            {metric.label}
          </dt>
        </Module>
      ))}
    </dl>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const service = servicesBySlug[study.service];
  const isPlaceholder = study.status === "placeholder";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    author: { "@type": "Organization", name: "UNFLECT" },
    about: service.name,
  };

  return (
    <>
      <CaseStudyViewTracker
        slug={study.slug}
        status={study.status}
        service={study.service}
      />
      {isPlaceholder ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-line pt-24 sm:pt-28">
        <Container>
          <ol className="flex flex-wrap items-center gap-x-2 text-[0.8125rem] text-muted">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center transition-colors hover:text-bone">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/work" className="inline-flex min-h-11 items-center transition-colors hover:text-bone">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="inline-flex min-h-11 items-center truncate text-muted-strong">
              {study.sector}
            </li>
          </ol>
        </Container>
      </nav>

      <header className="border-b border-line pb-14 pt-12 sm:pb-16 sm:pt-14">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <Tag tone="signal">
              {service.name}
            </Tag>
            {isPlaceholder ? <PlaceholderBadge /> : null}
            {study.completedAt ? (
              <Tag>{new Date(study.completedAt).getFullYear()}</Tag>
            ) : null}
          </div>

          <h1 className="mt-8 max-w-4xl text-display">{study.title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-muted-strong">{study.summary}</p>

          {study.client ? (
            <p className="mt-6 text-[0.9375rem] text-muted">
              Client: <span className="text-bone">{study.client}</span>
            </p>
          ) : (
            <p className="mt-6 text-[0.9375rem] text-muted">
              Client:{" "}
              <span className="text-muted-strong">
                {isPlaceholder ? "Not applicable \u2014 illustrative example" : "Anonymised"}
              </span>
            </p>
          )}
        </Container>
      </header>

      {isPlaceholder ? (
        <Section spacing="tight">
          <Container>
            <Reveal>
              <Module className="p-6 sm:p-8" ticks={false}>
                <div className="flex items-center gap-3">
                  <NodeDot tone="indigo" />
                  <span className="label-mono text-indigo-bright">Placeholder</span>
                </div>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-strong">
                  <span className="font-medium text-bone">This is a placeholder.</span>{" "}
                  It documents the structure UNFLECT uses for case studies. It is not a
                  client engagement, contains no client information and claims no
                  results. Verified project data will replace it once client-approved.
                </p>
              </Module>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section spacing="normal">
        <Container>
          <div className="space-y-14">
            <DetailBlock id="problem" index="01" label="The business problem">
              <p>{study.problem}</p>
            </DetailBlock>

            <DetailBlock id="challenge" index="02" label="The challenge">
              <p>{study.challenge}</p>
            </DetailBlock>

            <DetailBlock id="solution" index="03" label="What we built">
              <p>{study.solution}</p>
            </DetailBlock>

            <DetailBlock id="how-it-works" index="04" label="How it works">
              <StepList items={study.howItWorks} />
            </DetailBlock>

            <DetailBlock id="approach" index="05" label="Notable decisions">
              <MarkerList items={study.approachNotes} />
            </DetailBlock>

            <DetailBlock id="outcome" index="06" label="Outcome">
              <p>{study.outcome}</p>
              <div className="mt-8">
                <Metrics study={study} />
              </div>
            </DetailBlock>
          </div>
        </Container>
      </Section>

      <Section spacing="tight" background="raised">
        <Container>
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="label-mono text-indigo">Next</p>
              <h2 className="mt-4 text-title">
                Have a problem shaped like this one?
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-strong">
                Describe the situation in the project form. We will tell you what we
                would do about it.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/contact" location="case_study_footer" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink
                href="/work"
                location="case_study_footer"
                variant="outline"
                size="lg"
              >
                All work
              </ButtonLink>
            </div>
          </div>

          <Rule className="mt-14" />

          <nav aria-label="More case studies" className="pt-8">
            <p className="label-mono text-muted">More</p>
            <ul className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {caseStudies
                .filter((item) => item.slug !== study.slug)
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/work/${item.slug}`}
                      className="group/more inline-flex min-h-11 items-center gap-2 py-2.5 text-[0.9375rem] text-muted-strong transition-colors hover:text-indigo"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-0 bg-indigo transition-all duration-300 ease-[var(--ease-precision)] group-hover/more:w-3"
                      />
                      {item.sector}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </Container>
      </Section>
    </>
  );
}
