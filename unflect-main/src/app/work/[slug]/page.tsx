import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container, Rule, Section, Tag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { MarkerList, Module, NodeDot, StepList } from "@/components/ui/module";
import { CaseStudyViewTracker } from "@/components/work/tracked-case-study-link";
import { CaseStudyGallery } from "@/components/work/case-study-gallery";
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
    robots: { index: true, follow: true },
  });
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const toneClasses =
    status === "early_access"
      ? "border-indigo/40 bg-indigo/10 text-indigo-bright"
      : status === "sample_project"
        ? "border-line-strong bg-bone/[0.04] text-muted-strong"
        : "border-line bg-navy text-muted";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.03em] ${toneClasses}`}
    >
      <span className="sr-only">Project status: </span>
      {label}
    </span>
  );
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
              <h2 id={`${id}-heading`} className="mt-4 font-display text-[1.25rem] text-bone">
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
          <dd className="mt-5 font-display text-[1.75rem] text-indigo">
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    author: { "@type": "Organization", name: "UNFLECT" },
    about: service.name,
  };

  const cleanParagraph = (text: string, fallback: string) =>
    text.includes("[CONFIRM") ? fallback : text;

  const cleanList = (items: readonly string[]) =>
    items.filter((item) => !item.includes("[CONFIRM"));

  const howItWorks = cleanList(study.howItWorks);
  const approachNotes = cleanList(study.approachNotes);
  const whereItStands = cleanList(study.whereItStands);
  const whatWedDoDifferently = cleanList(study.whatWedDoDifferently);

  return (
    <>
      <CaseStudyViewTracker
        slug={study.slug}
        status={study.status}
        service={study.service}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <Tag tone="signal">{service.name}</Tag>
            <StatusBadge status={study.status} label={study.statusLabel} />
            {study.completedAt ? (
              <Tag>{new Date(study.completedAt).getFullYear()}</Tag>
            ) : null}
          </div>

          <h1 className="mt-8 max-w-4xl font-display text-display text-bone">{study.title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-muted-strong">{study.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-[0.9375rem] text-muted">
            {study.client ? (
              <p>
                Client: <span className="text-bone">{study.client}</span>
              </p>
            ) : null}

            {study.liveUrl ? (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-indigo-bright hover:text-bone"
              >
                Visit live project ({study.liveUrl.replace("https://", "")})
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-mono text-xs text-muted">
                Public URL: Not published yet
              </span>
            )}
          </div>
        </Container>
      </header>

      {/* Screenshot / visual slot */}
      <Section spacing="tight">
        <Container>
          <Reveal>
            <CaseStudyGallery
              image={study.image}
              imagePlaceholderLabel={study.imagePlaceholderLabel}
              screenshots={study.screenshots}
              title={study.title}
              liveUrl={study.liveUrl}
            />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="normal">
        <Container>
          <div className="space-y-14">
            <DetailBlock id="problem" index="01" label="The business problem">
              <p>{cleanParagraph(study.problem, "Specific problem statement will be published upon release.")}</p>
            </DetailBlock>

            <DetailBlock id="challenge" index="02" label="The challenge">
              <p>{cleanParagraph(study.challenge, "Operational and technical constraints currently being addressed.")}</p>
            </DetailBlock>

            <DetailBlock id="solution" index="03" label="What we built">
              <p>{cleanParagraph(study.solution, "System architecture and features currently in active development.")}</p>
            </DetailBlock>

            <DetailBlock id="how-it-works" index="04" label="How it works">
              {howItWorks.length > 0 ? (
                <StepList items={howItWorks} />
              ) : (
                <p className="text-muted">Workflow specifications will be published upon release.</p>
              )}
            </DetailBlock>

            <DetailBlock id="approach" index="05" label="Notable decisions">
              {approachNotes.length > 0 ? (
                <MarkerList items={approachNotes} />
              ) : (
                <p className="text-muted">Architectural notes will be published upon release.</p>
              )}
            </DetailBlock>

            <DetailBlock id="where-it-stands" index="06" label="Where it stands">
              {whereItStands.length > 0 ? (
                <MarkerList items={whereItStands} />
              ) : (
                <p className="text-muted">Deployment status updates will be published upon release.</p>
              )}
            </DetailBlock>

            <DetailBlock id="what-wed-do-differently" index="07" label="What we'd do differently / next">
              {whatWedDoDifferently.length > 0 ? (
                <MarkerList items={whatWedDoDifferently} />
              ) : (
                <p className="text-muted">Retrospective notes will be recorded following full release.</p>
              )}
            </DetailBlock>

            <DetailBlock id="outcome" index="08" label="Outcome">
              <p>{cleanParagraph(study.outcome, "Outcomes will be measured and published following release.")}</p>
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
              <h2 className="mt-4 font-display text-title text-bone">
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
            <p className="label-mono text-muted">More projects</p>
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
                      {(item.title.split("—")[0] ?? item.title).trim()} ({item.statusLabel})
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
