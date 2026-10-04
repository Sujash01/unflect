import type { Metadata } from "next";
import Link from "next/link";
import { aboutIntro, principles, engagementModel, handoverDeliverables } from "@/content/company";
import { aiPhilosophyNote } from "@/content/company-extra";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "About", description: "Why UNFLECT exists and how we work.", path: "/about" });

export default function AboutPage() {
  return (
    <div className="text-bone">
      <EditorialPageHeader
        section="About"
        title="Solve the problem first."
        lede="UNFLECT exists to solve business problems through thoughtfully built software — not to ship software for its own sake."
      />

      <section className="border-b border-white/10 bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.55fr)]">
            <div className="space-y-7">
              {aboutIntro.body.map((paragraph) => <p key={paragraph.slice(0, 34)} className="max-w-3xl text-base leading-8 text-bone/60 sm:text-lg">{paragraph}</p>)}
            </div>
            <div className="self-start border-t border-white/15 pt-6 lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.03em] text-bone/55">The point</p>
              <p className="mt-5 font-display text-3xl  leading-[1.02] tracking-[-0.02em]">We are interested in useful software that keeps working after we leave.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.03em] text-bone/55">How we operate</p>
              <h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-7xl">Eight commitments, not eight adjectives.</h2>
            </div>
          </div>
          <div className="mt-10 grid border-t border-white/10 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article key={principle.id} className="border-b border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.025] sm:min-h-56 sm:[&:nth-child(odd)]:border-r">
                <div className="flex items-center justify-between text-[11px] tracking-[0.03em] text-bone/50"><span>0{index + 1}</span><span>Principle</span></div>
                <h3 className="mt-12 max-w-md font-display text-2xl  tracking-[-0.035em]">{principle.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-bone/65">{principle.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.03em] text-bone/55">On AI</p>
              <h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">AI assists. People answer.</h2>
            </div>
            <p className="max-w-3xl text-base leading-8 text-bone/55 sm:text-lg">{aiPhilosophyNote}</p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs tracking-[0.03em] text-bone/55">Engagement</p><h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">Commercially clear. Technically clear.</h2></div>
            <div className="border-y border-white/10">
              {engagementModel.map((item) => (
                <div key={item.id} className="grid gap-4 border-b border-white/10 py-6 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-10">
                  <div><p className="font-display text-xl  tracking-[-0.02em]">{item.name}</p><p className="mt-2 text-xs tracking-[0.03em] text-bone/50">{item.structure}</p></div>
                  <p className="text-sm leading-6 text-bone/65">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs tracking-[0.03em] text-bone/55">Handover</p><h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">You should be able to own what we build.</h2></div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {handoverDeliverables.map((item) => <div key={item.id} className="border-t border-white/10 pt-5"><p className="text-sm font-medium">{item.label}</p><p className="mt-2 text-sm leading-6 text-bone/60">{item.detail}</p></div>)}
            </div>
          </div>
          <Link href="/contact" className="group mt-12 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-bone/70 hover:text-bone">Talk to us</Link>
        </Container>
      </section>
    </div>
  );
}
