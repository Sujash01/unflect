import type { Metadata } from "next";
import Link from "next/link";
import {
  aboutIntro,
  principles,
  engagementModel,
  handoverDeliverables,
  founders,
  team,
  studioLocation,
} from "@/content/company";
import { aiPhilosophyNote } from "@/content/company-extra";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Why UNFLECT exists, who you will work with, and how we build custom software without hype.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="text-bone">
      <EditorialPageHeader
        section="About"
        title="Solve the problem first."
        lede="UNFLECT exists to solve business problems through thoughtfully built software — not to ship software for its own sake."
      />

      {/* Intro */}
      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.55fr)]">
            <div className="space-y-7">
              {aboutIntro.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 34)}
                  className="max-w-3xl text-base leading-8 text-muted-strong sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="self-start border-t border-line-strong pt-6 lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.03em] text-muted">The point</p>
              <p className="mt-5 font-display text-3xl leading-[1.02] tracking-[-0.02em] text-bone">
                We are interested in useful software that keeps working after we leave.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* WHO YOU'LL WORK WITH */}
      <section className="border-b border-line py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.03em] text-muted">
              Studio structure
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
              Who you’ll work with.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-strong">
              The person you talk to scopes, architects, and writes your code — no account managers or middlemen.
            </p>
          </div>

          <div className="mt-14 max-w-4xl space-y-6">
            {founders.map((person) => (
              <div
                key={person.name}
                className="rounded-3xl border border-line bg-module/50 p-7 sm:p-9 transition-all duration-300 hover:border-line-strong"
              >
                <div className="grid gap-6 sm:grid-cols-[7rem_1fr] sm:items-start">
                  {/* Monogram Avatar Slot */}
                  <div
                    className="flex aspect-square w-24 sm:w-28 flex-col items-center justify-center rounded-2xl border border-line bg-navy/90 p-3 text-center shadow-inner"
                    aria-label={`Monogram avatar for ${person.name}`}
                  >
                    <span className="font-mono text-xl sm:text-2xl font-semibold tracking-wider text-indigo-bright">
                      {person.initials}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
                      Co-Founder
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-2xl text-bone">
                        {person.name}
                      </h3>
                      <span className="font-mono text-xs text-indigo-bright">
                        Co-Founder
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-strong">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {team.length > 0 ? (
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-xs text-muted">Additional team:</p>
                {/* Team members rendered if added in config */}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* WHERE WE ARE */}
      <section className="border-b border-line bg-navy-inset/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.03em] text-muted">Where we are</p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.02em] text-bone sm:text-4xl">
                Remote-first. Direct contact.
              </h2>
            </div>
            <div className="border-l border-line pl-6 sm:pl-10">
              <p className="font-mono text-xs text-indigo-bright">
                {studioLocation.location.includes("[CONFIRM")
                  ? "Operating remote-first"
                  : `Location: ${studioLocation.location}`}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-strong">
                {studioLocation.statement}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* PRINCIPLES */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.03em] text-muted">How we operate</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-7xl text-bone">
                Eight commitments, not eight adjectives.
              </h2>
            </div>
          </div>
          <div className="mt-10 grid border-t border-line sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article
                key={principle.id}
                className="border-b border-line p-7 transition-colors duration-500 hover:bg-bone/[0.025] sm:min-h-56 sm:[&:nth-child(odd)]:border-r"
              >
                <div className="flex items-center justify-between text-[11px] tracking-[0.03em] text-muted">
                  <span>0{index + 1}</span>
                  <span>Principle</span>
                </div>
                <h3 className="mt-12 max-w-md font-display text-2xl tracking-[-0.035em] text-bone">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-strong">
                  {principle.detail}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ON AI */}
      <section className="border-y border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.03em] text-muted">On AI</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                AI assists. People answer.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-muted-strong sm:text-lg">
              {aiPhilosophyNote}
            </p>
          </div>
        </Container>
      </section>

      {/* ENGAGEMENT */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs tracking-[0.03em] text-muted">Engagement</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                Commercially clear. Technically clear.
              </h2>
            </div>
            <div className="border-y border-line">
              {engagementModel.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 border-b border-line py-6 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-10"
                >
                  <div>
                    <p className="font-display text-xl tracking-[-0.02em] text-bone">
                      {item.name}
                    </p>
                    <p className="mt-2 text-xs tracking-[0.03em] text-muted">
                      {item.structure}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-muted-strong">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* HANDOVER */}
      <section className="border-t border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs tracking-[0.03em] text-muted">Handover</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                You should be able to own what we build.
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {handoverDeliverables.map((item) => (
                <div key={item.id} className="border-t border-line pt-5">
                  <p className="text-sm font-medium text-bone">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-strong">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/contact"
            className="group mt-12 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-indigo-bright hover:text-bone"
          >
            Talk to us →
          </Link>
        </Container>
      </section>
    </div>
  );
}
