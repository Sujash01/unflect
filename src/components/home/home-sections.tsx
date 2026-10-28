import Link from "next/link";
import { ChevronDown, Layers } from "lucide-react";
import { services } from "@/content/services";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { ScrollWords } from "@/components/fx/scroll-words";
import { SelectedWork, SectionHead } from "@/components/home/selected-work";
import { ServicesList } from "@/components/home/services-list";
import { ProcessRail } from "@/components/home/process-rail";
import { ClosingCta } from "@/components/home/closing-cta";

export function HomeSections() {
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
      <section className="content-auto relative py-32 sm:py-44">
        <Container>
          <p className="label-mono mb-10 flex items-center gap-3 text-indigo">
            <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
            Philosophy
          </p>
          <ScrollWords
            text="Good automation doesn't ask businesses to change themselves. We connect systems around the way work actually happens."
            accent={["actually"]}
            className="max-w-5xl font-display text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.06] tracking-[-0.02em] text-bone"
          />
        </Container>
      </section>

      {/* WORK */}
      <SelectedWork />

      {/* SERVICES */}
      <section className="content-auto relative overflow-hidden border-y border-line bg-navy-inset/70 py-24 sm:py-32">
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
      <section className="content-auto border-b border-line py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="label-mono flex items-center gap-3 text-indigo">
              <span aria-hidden="true" className="h-px w-8 bg-indigo/60" />
              Engineering
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.02em] text-bone sm:text-4xl">
              Stack we integrate with.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-strong">
              Tools, APIs, and frameworks actually used across our production systems — no inflated technology lists.
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
      <section className="content-auto py-24 sm:py-32">
        <Container>
          <SectionHead kicker="How we work" title="Process" href="/process" />
          <ProcessRail />
        </Container>
      </section>

      {/* TYPICAL ENGAGEMENTS */}
      <section className="content-auto border-y border-line bg-navy-inset/70 py-24 sm:py-32">
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
              We structure projects by milestone and scale rather than ambiguous time-and-materials. Commercial specifics are agreed with each client.
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
                    prefetch={false}
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
      <section className="content-auto py-24 sm:py-32">
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
      <ClosingCta />
    </div>
  );
}
