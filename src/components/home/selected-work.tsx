"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/case-studies";
import { Container } from "@/components/ui/primitives";
import { Spotlight } from "@/components/fx/spotlight";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.9, delay, ease: EASE },
        };
}

export function SectionHead({
  title,
  count,
  href,
  kicker,
}: {
  title: string;
  count?: number;
  href?: string;
  kicker: string;
}) {
  const r = useReveal();
  return (
    <motion.div {...r()} className="flex items-end justify-between gap-6">
      <div>
        <p className="label-mono flex items-center gap-3 text-indigo">
          <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
          {kicker}
        </p>
        <h2 className="mt-5 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.98] tracking-[-0.025em] text-bone">
          {title}
          {count !== undefined ? (
            <sup className="ml-3 align-super font-mono text-sm tracking-normal text-muted">
              ({count})
            </sup>
          ) : null}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          prefetch={false}
          className="group inline-flex items-center gap-2 pb-2 text-sm text-muted-strong transition-colors hover:text-bone"
        >
          <span className="u-link">See all</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </motion.div>
  );
}

export function SelectedWork() {
  const r = useReveal();
  const activeWork = caseStudies.filter((s) => s.status !== "coming_soon");

  return (
    <section className="content-auto py-24 sm:py-32">
      <Container>
        <SectionHead
          kicker="Selected work"
          title="Work"
          count={activeWork.length}
          href="/work"
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {activeWork.map((study, i) => (
            <motion.div
              key={study.slug}
              {...r(i * 0.08)}
              className={i % 2 === 1 ? "lg:mt-20" : undefined}
            >
              <Spotlight className="group rounded-3xl">
                <Link
                  href={`/work/${study.slug}`}
                  prefetch={false}
                  data-cursor="View"
                  className="block overflow-hidden rounded-3xl border border-line bg-module/60 p-3 transition-colors duration-500 hover:border-line-strong"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-navy/80 p-6 flex flex-col justify-between">
                    {study.image ? (
                      <>
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-precision)] group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40"
                        />
                      </>
                    ) : null}

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="rounded-full border border-line bg-black/60 px-3 py-1.5 font-mono text-[11px] tracking-[0.03em] text-muted-strong backdrop-blur-md">
                        0{i + 1} · {study.service}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur-md ${
                          study.status === "early_access"
                            ? "border-indigo/40 bg-indigo/20 text-indigo-bright"
                            : "border-line bg-black/50 text-muted-strong"
                        }`}
                      >
                        {study.statusLabel}
                      </span>
                    </div>

                    {!study.image ? (
                      <div className="relative z-10 rounded-xl border border-dashed border-line/60 bg-black/30 p-4 text-center">
                        <p className="font-mono text-xs text-bone">Preview screenshot pending</p>
                        <p className="mt-1 text-[11px] text-muted">{study.imagePlaceholderLabel}</p>
                      </div>
                    ) : (
                      <div className="relative z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[11px] text-bone backdrop-blur-md">
                          View case study
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-between text-xs text-muted-strong">
                      <span className="rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md">{study.sector}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bone text-[#0A0A0A] transition-transform duration-300 group-hover:scale-105">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <div className="px-3 pb-4 pt-6">
                    <h3 className="font-display text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.08] tracking-[-0.015em] text-bone">
                      {study.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-6 text-muted-strong">
                      {study.summary}
                    </p>
                  </div>
                </Link>
              </Spotlight>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
