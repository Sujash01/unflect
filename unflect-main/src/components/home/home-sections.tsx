"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown, Layers } from "lucide-react";
import { services } from "@/content/services";
import { processStages } from "@/content/process";
import { caseStudies } from "@/content/case-studies";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { MagneticCta } from "@/components/ui/magnetic-cta";
import { ScrollWords } from "@/components/fx/scroll-words";
import { SplitText } from "@/components/fx/split-text";
import { Spotlight } from "@/components/fx/spotlight";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function useReveal() {
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

function SectionHead({
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
          className="group inline-flex items-center gap-2 pb-2 text-sm text-muted-strong transition-colors hover:text-bone"
        >
          <span className="u-link">See all</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </motion.div>
  );
}

export function HomeSections() {
  const r = useReveal();
  const activeWork = caseStudies.filter((s) => s.status !== "coming_soon");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* MANIFESTO */}
      <section className="relative py-32 sm:py-44">
        <Container>
          <p className="label-mono mb-10 flex items-center gap-3 text-indigo">
            <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
            Philosophy
          </p>
          <ScrollWords
            text="Good software doesn't ask businesses to change themselves. We build around the way work actually happens."
            accent={["actually"]}
            className="max-w-5xl font-display text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.06] tracking-[-0.02em] text-bone"
          />
        </Container>
      </section>

      {/* WORK */}
      <section className="py-24 sm:py-32">
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
                    data-cursor="View"
                    className="block overflow-hidden rounded-3xl border border-line bg-module/60 p-3 transition-colors duration-500 hover:border-line-strong"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-navy/80 p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-line bg-black/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.03em] text-muted-strong backdrop-blur-md">
                          0{i + 1} · {study.service}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                            study.status === "early_access"
                              ? "border-indigo/40 bg-indigo/10 text-indigo-bright"
                              : "border-line bg-bone/[0.05] text-muted-strong"
                          }`}
                        >
                          {study.statusLabel}
                        </span>
                      </div>

                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line/60 bg-black/30">
                        {study.image ? (
                          <img
                            src={study.image}
                            alt={study.title}
                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                            <p className="font-mono text-xs text-bone">
                              Preview screenshot pending
                            </p>
                            <p className="mt-1 text-[11px] text-muted">
                              {study.imagePlaceholderLabel}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{study.sector}</span>
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

      {/* SERVICES */}
      <section className="relative overflow-hidden border-y border-line bg-navy-inset/70 py-24 sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-bloom-indigo opacity-70 blur-3xl"
        />
        <Container className="relative">
          <SectionHead
            kicker="What we do"
            title="Services"
            count={services.length}
            href="/services"
          />
          <ServicesList />
        </Container>
      </section>

      {/* STACK WE WORK WITH */}
      <section className="border-b border-line py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="label-mono flex items-center gap-3 text-indigo">
              <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
              Engineering
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.02em] text-bone sm:text-4xl">
              Stack we work with.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-strong">
              Only tools and frameworks actually used across our working projects — no inflated technology lists.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {siteConfig.stack.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-module/70 px-4 py-2 font-mono text-xs text-muted-strong transition-colors hover:border-line-strong hover:text-bone"
              >
                <Layers className="h-3 w-3 text-indigo" />
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* PROCESS */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHead kicker="How we work" title="Process" href="/process" />
          <ProcessRail />
        </Container>
      </section>

      {/* TYPICAL ENGAGEMENTS */}
      <section className="border-y border-line bg-navy-inset/70 py-24 sm:py-32">
        <Container>
          <div className="max-w-3xl">
            <p className="label-mono flex items-center gap-3 text-indigo">
              <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
              Engagement shapes
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl">
              Typical engagements.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-strong">
              We structure projects by milestone and agreed deliverables rather than open-ended hours.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.typicalEngagements.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-line bg-module/50 p-6"
              >
                <div>
                  <h3 className="font-display text-xl text-bone">{item.name}</h3>
                  <p className="mt-3 font-mono text-xs text-indigo-bright">
                    {item.structure}
                  </p>
                  <p className="mt-4 text-xs leading-6 text-muted-strong">
                    {item.detail}
                  </p>
                </div>
                <div className="mt-6 border-t border-line pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-bone/80 transition-colors hover:text-bone"
                  >
                    Discuss project scope →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="max-w-3xl">
            <p className="label-mono flex items-center gap-3 text-indigo">
              <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
              Common questions
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.02em] text-bone sm:text-5xl">
              Frequently asked questions.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-strong">
              Direct answers about how we operate, who owns what, and how engagements run.
            </p>
          </div>

          <div className="mt-12 divide-y divide-line border-y border-line">
            {siteConfig.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                  <span className="font-display text-xl text-bone transition-colors group-hover:text-indigo-bright sm:text-2xl">
                    <span className="mr-4 font-mono text-xs text-muted">
                      0{index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="h-4 w-4 text-muted-strong" />
                  </span>
                </summary>
                <div className="mt-4 max-w-3xl pl-8 sm:pl-10 text-sm leading-7 text-muted-strong">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden border-t border-line py-32 text-center sm:py-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="aurora-blob aurora-a left-[5%] top-[-30%] h-[38rem] w-[38rem]" />
          <div className="aurora-blob aurora-b right-[0%] bottom-[-35%] h-[40rem] w-[40rem]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_70%)]"
        />
        <Container className="relative">
          <p className="label-mono mb-8 text-indigo">Start a project</p>
          <h2 className="mx-auto max-w-5xl font-display text-[clamp(3rem,7vw,6.4rem)] leading-[0.98] tracking-[-0.025em] text-bone">
            <SplitText
              text="Tell us what is getting in the way."
              accent={["getting"]}
              stagger={0.07}
            />
          </h2>
          <motion.p
            {...r(0.2)}
            className="mx-auto mt-8 max-w-xl text-lg leading-8 text-muted-strong"
          >
            Bring the business problem. We will help turn it into a useful next step.
          </motion.p>
          <motion.div
            {...r(0.3)}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticCta href="/contact" label="Start a project →" />
            <MagneticCta
              href="/process"
              label="See how we work"
              variant="outline"
            />
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

function ServicesList() {
  const [active, setActive] = useState<string | null>(null);
  const r = useReveal();

  return (
    <div className="mt-16 border-t border-line">
      {services.map((service, index) => {
        const dimmed = active !== null && active !== service.slug;
        return (
          <motion.div key={service.slug} {...r(index * 0.08)}>
            <Link
              href={`/services/${service.slug}`}
              onMouseEnter={() => setActive(service.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(service.slug)}
              onBlur={() => setActive(null)}
              className={[
                "group relative grid items-center gap-4 border-b border-line py-10 transition-all duration-500 sm:grid-cols-[5rem_1fr_auto] sm:py-12",
                dimmed ? "opacity-30" : "opacity-100",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-indigo/[0.05] to-transparent transition-all duration-700 ease-[var(--ease-precision)] group-hover:w-full"
              />
              <span className="relative font-mono text-[11px] tracking-[0.03em] text-indigo">
                0{index + 1}
              </span>
              <div className="relative">
                <h3 className="font-display text-[clamp(2.6rem,5.6vw,4.8rem)] leading-none tracking-[-0.02em] text-bone transition-all duration-500 ease-[var(--ease-precision)] group-hover:translate-x-3">
                  {service.name}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-strong transition-colors duration-300">
                  {service.summary}
                </p>
              </div>
              <span className="relative hidden h-14 w-14 items-center justify-center rounded-full border border-line-strong transition-all duration-500 ease-[var(--ease-precision)] group-hover:border-bone/60 sm:flex">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProcessRail() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  });

  return (
    <ol ref={ref} className="relative mt-16">
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-[0.45rem] top-0 w-px bg-line sm:left-[0.45rem]"
      />
      <motion.span
        aria-hidden="true"
        style={reduce ? { scaleY: 1 } : { scaleY: fill }}
        className="absolute bottom-0 left-[0.45rem] top-0 w-px origin-top bg-gradient-to-b from-indigo via-indigo-bright to-indigo"
      />
      {processStages.map((stage) => (
        <motion.li
          key={stage.id}
          initial={reduce ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="group relative grid gap-3 py-8 pl-10 sm:grid-cols-[5rem_minmax(0,16rem)_1fr] sm:items-baseline sm:gap-8 sm:pl-12"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.45rem] flex h-[0.95rem] w-[0.95rem] items-center justify-center rounded-full border border-line-strong bg-navy"
          >
            <span className="h-1 w-1 rounded-full bg-muted" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.03em] text-indigo">
            {stage.index}
          </span>
          <h3 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-none tracking-[-0.015em] text-bone transition-transform duration-500 ease-[var(--ease-precision)] group-hover:translate-x-2">
            {stage.name}
          </h3>
          <p className="max-w-xl text-sm leading-6 text-muted-strong transition-colors">
            {stage.summary}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
