"use client";

import Link from "next/link";
import { useState } from "react";
import { processStages, processPrinciples } from "@/content/process";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function ProcessView() {
  const [active, setActive] = useState<string | null>(null);
  const current = processStages.find((s) => s.id === active) ?? processStages[0];

  return (
    <div>
      <EditorialPageHeader
        section="Process"
        title="Discover. Define. Build. Deploy. Evolve."
        lede="A clear sequence from business problem to working software. The stages stay fixed; the decisions inside them are made with you."
        aside={
          <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 font-medium text-bone">
            Start a project
          </Link>
        }
      />

      <section className="border-b border-white/10 bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <ol className="border-t border-white/10">
              {processStages.map((stage) => {
                const isActive = (active ?? processStages[0].id) === stage.id;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => setActive(stage.id)}
                      onFocus={() => setActive(stage.id)}
                      onMouseEnter={() => setActive(stage.id)}
                      onMouseLeave={() => setActive(null)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group flex w-full items-baseline gap-5 border-b border-white/10 py-6 text-left transition-all duration-500",
                        isActive ? "opacity-100" : "opacity-40 hover:opacity-80",
                      )}
                    >
                      <span className={cn("font-mono text-[11px] tracking-[0.03em]", isActive ? "text-indigo" : "text-muted")}>{stage.index}</span>
                      <span className="font-display text-3xl  tracking-[-0.035em]">{stage.name}</span>
                      <span className={cn("ml-auto h-1.5 w-1.5 rounded-full transition-all", isActive ? "bg-indigo shadow-[0_0_10px_rgba(78,140,163,0.8)]" : "bg-white/15")} />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div key={current.id} className="border-t border-white/10 pt-8">
                <h2 className="font-display text-4xl  tracking-[-0.02em]">{current.name}</h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-muted-strong">{current.detail}</p>
                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-sm text-muted">Output</p>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-bone">{current.output}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm text-muted">Working rules</p>
              <h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">
                A process only matters if it changes something.
              </h2>
            </div>
            <div className="border-t border-white/10">
              {processPrinciples.map((item, index) => (
                <article key={item.id} className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[4rem_1fr]">
                  <span className="font-mono text-[11px] text-muted">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl  tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
