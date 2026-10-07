import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { caseStudies } from "@/content/case-studies";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

const principles = [
  {
    title: "Start with the business problem",
    detail:
      "Not the preferred technology, not the feature list. The problem is the specification.",
  },
  {
    title: "Define what good looks like",
    detail:
      "Before committing to build scope, so the work can be judged honestly.",
  },
  {
    title: "Build the smallest useful system",
    detail:
      "The one that actually changes the workflow — then earn the right to more.",
  },
  {
    title: "Deploy with ownership considered",
    detail:
      "Handover, access and operational detail are part of the product, not cleanup work.",
  },
  {
    title: "Make reliability visible",
    detail:
      "Access, failure behaviour and failure warnings are designed in, not patched in.",
  },
  {
    title: "Leave a system the team can run",
    detail:
      "Understandable, operable, improvable — by the people who use it.",
  },
];

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Selected software built by UNFLECT: web platforms, internal systems, and integrations labeled with honest statuses.",
  path: "/work",
});

function StatusBadge({ status, label }: { status: string; label: string }) {
  const toneClasses =
    status === "early_access"
      ? "border-indigo/40 bg-indigo/10 text-indigo-bright"
      : status === "sample_project"
        ? "border-line-strong bg-bone/[0.04] text-muted-strong"
        : "border-line bg-navy text-muted";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-[0.03em] ${toneClasses}`}
    >
      <span className="sr-only">Project status: </span>
      {label}
    </span>
  );
}

export default function WorkPage() {
  const publishedStudies = caseStudies.filter((s) => s.status !== "coming_soon");
  const inProgressStudies = caseStudies.filter((s) => s.status === "coming_soon");

  return (
    <div className="text-bone">
      <EditorialPageHeader
        section="Work"
        title="The problem first. The software second."
        lede="We document work around the business problem, the architecture and the status — never invented metrics or vanity claims."
      />

      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="border-y border-line p-7 sm:p-9">
            <p className="text-sm font-medium text-bone">
              Project status & integrity commitment
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-strong">
              Every project below is labeled with an honest status. Where a product is in early access or built on sample data, we say so plainly rather than publishing unverified outcome figures.
            </p>
          </div>

          {/* Active and Sample Projects */}
          <div className="mt-12 space-y-8">
            {publishedStudies.map((study) => (
              <article
                key={study.slug}
                className="group rounded-3xl border border-line bg-module/40 p-6 transition-all duration-300 hover:border-line-strong sm:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(14rem,0.8fr)] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
                        {study.service}
                      </span>
                      <span className="text-muted" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.03em] text-muted-strong">
                        {study.sector}
                      </span>
                      <StatusBadge
                        status={study.status}
                        label={study.statusLabel}
                      />
                    </div>

                    <h2 className="mt-4 font-display text-2xl tracking-[-0.03em] text-bone transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                      <Link
                        href={`/work/${study.slug}`}
                        className="hover:underline focus:outline-none"
                      >
                        {study.title}
                      </Link>
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-strong">
                      {study.summary}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/work/${study.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-bright hover:text-bone"
                      >
                        Read case study
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </Link>

                      {study.liveUrl ? (
                        <a
                          href={study.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-bone"
                        >
                          Visit live site
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Neutral labelled preview slot */}
                  <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-navy/60 p-6 text-center">
                    <span className="font-mono text-xs text-muted-strong">
                      Approved screenshot pending
                    </span>
                    <span className="mt-2 max-w-xs text-[11px] leading-relaxed text-muted">
                      {study.imagePlaceholderLabel}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* In progress / coming soon row */}
          {inProgressStudies.length > 0 ? (
            <div className="mt-16 border-t border-line pt-12">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
                    Pipeline
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-bone">
                    In progress / coming soon
                  </h3>
                </div>
                <p className="text-xs text-muted max-w-md">
                  Active projects currently in engineering. Detailed architecture notes will be published upon release.
                </p>
              </div>

              <div className="space-y-6">
                {inProgressStudies.map((study) => (
                  <article
                    key={study.slug}
                    className="rounded-2xl border border-dashed border-line bg-navy-raised/40 p-6 sm:p-7"
                  >
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
                            {study.service}
                          </span>
                          <span className="text-muted" aria-hidden="true">
                            ·
                          </span>
                          <span className="font-mono text-[11px] tracking-[0.03em] text-muted-strong">
                            {study.sector}
                          </span>
                          <StatusBadge
                            status={study.status}
                            label={study.statusLabel}
                          />
                        </div>

                        <h4 className="mt-3 font-display text-xl text-bone">
                          {study.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-muted-strong">
                          {study.summary}
                        </p>
                      </div>

                      <div className="flex aspect-[21/9] w-full flex-col items-center justify-center rounded-xl border border-line bg-navy/70 p-4 text-center">
                        <span className="font-mono text-xs text-muted">
                          Documentation in progress
                        </span>
                        <span className="mt-1 text-[11px] text-muted-strong">
                          Public release pending
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-b border-line py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-muted">
              Operating principles
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl">
              Clear decisions. Useful software. No theatre.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-strong">
              The rules every engagement follows. These are principles, not testimonials — we publish real references only when client-approved.
            </p>
          </div>
          <div className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="border-b border-line p-7 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(odd)]:border-r"
              >
                <span className="font-mono text-[11px] tracking-[0.03em] text-indigo">
                  0{index + 1}
                </span>
                <h3 className="mt-8 max-w-xs font-display text-xl tracking-[-0.02em] text-bone">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-strong">
                  {principle.detail}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs tracking-[0.03em] text-muted-strong">
                Have a real project?
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                Let’s document the right story.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-bone"
            >
              Start the conversation
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
