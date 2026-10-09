"use client";

import { useState } from "react";
import {
  processStages,
  processPrinciples,
  clientExpectations,
  scopeChangePolicy,
} from "@/content/process";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, DollarSign, Handshake, ShieldCheck } from "lucide-react";

export function ProcessView() {
  const [active, setActive] = useState<string | null>(null);
  const current = processStages.find((s) => s.id === active) ?? processStages[0];

  return (
    <div className="text-bone">
      <EditorialPageHeader
        section="Process"
        title="Discover. Define. Build. Deploy. Evolve."
        lede="A disciplined sequence from business problem to working software. The stages stay fixed; the decisions inside them are made with you."
        aside={
          <ButtonLink href="/contact" location="process_header" size="lg">
            Start a project
          </ButtonLink>
        }
      />

      {/* Interactive Stages Section */}
      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Stage Selector */}
            <ol className="border-t border-line">
              {processStages.map((stage) => {
                const isActive = (active ?? processStages[0].id) === stage.id;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => setActive(stage.id)}
                      onFocus={() => setActive(stage.id)}
                      onMouseEnter={() => setActive(stage.id)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group flex w-full items-baseline gap-5 border-b border-line py-6 text-left transition-all duration-300",
                        isActive ? "opacity-100" : "opacity-40 hover:opacity-80",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] tracking-[0.03em]",
                          isActive ? "text-indigo" : "text-muted",
                        )}
                      >
                        {stage.index}
                      </span>
                      <span className="font-display text-3xl tracking-[-0.035em]">
                        {stage.name}
                      </span>
                      <span
                        className={cn(
                          "ml-auto h-2 w-2 rounded-full transition-all",
                          isActive
                            ? "bg-indigo shadow-[0_0_10px_rgba(78,140,163,0.8)]"
                            : "bg-bone/15",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Stage Detail Inspector */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div key={current.id} className="rounded-3xl border border-line bg-module/50 p-7 sm:p-9">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-mono text-xs text-indigo">
                    Stage {current.index} of 05
                  </span>
                  <span className="rounded-full border border-line px-3 py-0.5 font-mono text-[11px] text-muted-strong">
                    {current.name}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-3xl tracking-[-0.02em] sm:text-4xl text-bone">
                  {current.name}
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-strong">
                  {current.detail}
                </p>

                {/* 1. What happens */}
                <div className="mt-7 border-t border-line pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-bone">
                    What happens
                  </p>
                  <ul className="mt-3 space-y-2">
                    {current.whatHappens.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-strong">
                        <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. What the client does */}
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-bone">
                    What you do
                  </p>
                  <ul className="mt-3 space-y-2">
                    {current.whatClientDoes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-bone/30" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. What you receive */}
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-bone">
                    What you receive
                  </p>
                  <ul className="mt-3 space-y-2">
                    {current.whatYouReceive.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-bone">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Payment point */}
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-bone flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-indigo" />
                    Applicable payment point
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-strong">
                    {current.paymentPoint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What we need from you */}
      <section
        aria-labelledby="client-needs-heading"
        className="border-b border-line py-20 sm:py-28"
      >
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo flex items-center gap-2">
              <Handshake className="h-3.5 w-3.5" />
              Collaboration requirements
            </p>
            <h2
              id="client-needs-heading"
              className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.02em] sm:text-5xl text-bone"
            >
              What we need from you.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-strong">
              Software projects succeed when collaboration is direct, candid, and prompt.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clientExpectations.map((item, index) => (
              <div
                key={item.id}
                className="rounded-3xl border border-line bg-module/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-indigo">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-strong">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What happens if scope changes */}
      <section
        aria-labelledby="scope-changes-heading"
        className="border-b border-line bg-navy-inset/70 py-20 sm:py-28"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.03em] text-indigo flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Scope is a promise
              </p>
              <h2
                id="scope-changes-heading"
                className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.02em] sm:text-5xl text-bone"
              >
                {scopeChangePolicy.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-strong">
                {scopeChangePolicy.intro}
              </p>
            </div>

            <div className="space-y-6">
              {scopeChangePolicy.steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-line bg-module/50 p-6 sm:p-7"
                >
                  <h3 className="text-base font-medium text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Working rules */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm text-muted">Working rules</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl text-bone">
                A process only matters if it changes something.
              </h2>
            </div>
            <div className="border-t border-line">
              {processPrinciples.map((item, index) => (
                <article
                  key={item.id}
                  className="grid gap-5 border-b border-line py-7 sm:grid-cols-[4rem_1fr]"
                >
                  <span className="font-mono text-[11px] text-muted">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-bone">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                      {item.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line bg-navy-inset/80 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Next step
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl tracking-[-0.02em] text-bone">
              Have a project ready for discovery?
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-strong">
              Start with a concise brief describing the current problem. We will evaluate fit and propose the right initial step.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <ButtonLink href="/contact" location="process_closing_cta" size="lg">
                Start a project
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
