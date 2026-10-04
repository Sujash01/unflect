import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { contactGuidance, contactIntro } from "@/content/company-extra";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { MagneticCta } from "@/components/ui/magnetic-cta";

export const metadata: Metadata = pageMetadata({ title: "Start a Project", description: "Tell UNFLECT what you are trying to build and what problem is in the way.", path: "/contact" });

export default function ContactPage() {
  return (
    <div className="text-bone">
      <EditorialPageHeader section="Contact" title={contactIntro.heading} lede={contactIntro.body} />

      <section className="border-b border-white/10 bg-navy-inset/70 py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.03em] text-bone/55">What happens next</p>
              <ul className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {contactIntro.expectations.map((item, index) => <li key={item} className="grid gap-4 py-5 sm:grid-cols-[2.5rem_1fr]"><span className="text-xs text-bone/50">0{index + 1}</span><span className="text-sm leading-6 text-bone/55">{item}</span></li>)}
              </ul>
            </div>
            <div id="form"><EnquiryForm /></div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl"><p className="font-mono text-[11px] tracking-[0.03em] text-muted">Make the enquiry useful</p><h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">The clearer the problem, the faster we can be useful.</h2></div>
          <div className="mt-12 grid border-t border-white/10 md:grid-cols-4">
            {contactGuidance.map((item, index) => <div key={item.id} className="border-b border-white/10 py-7 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"><span className="font-mono text-[11px] text-muted">0{index + 1}</span><h3 className="mt-8 text-base font-medium">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p></div>)}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-inset/70 py-24 sm:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(circle_at_50%_60%,black,transparent_75%)]" />
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="font-mono text-[11px] tracking-[0.03em] text-muted">Start here</p>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.5rem)]  leading-[0.96] tracking-[-0.02em]">
              One honest brief. Then a considered reply.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              No autoresponders, no sales sequences. A person reads every enquiry and answers it properly.
            </p>
            <div className="mt-10">
              <MagneticCta href="#form" label="Back to the form" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
