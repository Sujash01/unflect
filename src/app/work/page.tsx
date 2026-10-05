import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, workPlaceholderNotice } from "@/content/case-studies";
import { EditorialPageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

const principles = [
  { title: "Start with the business problem", detail: "Not the preferred technology, not the feature list. The problem is the specification." },
  { title: "Define what good looks like", detail: "Before committing to build scope, so the work can be judged honestly." },
  { title: "Build the smallest useful system", detail: "The one that actually changes the workflow — then earn the right to more." },
  { title: "Deploy with ownership considered", detail: "Handover, access and operational detail are part of the product, not cleanup work." },
  { title: "Make reliability visible", detail: "Access, failure behaviour and failure warnings are designed in, not patched in." },
  { title: "Leave a system the team can run", detail: "Understandable, operable, improvable — by the people who use it." },
];


export const metadata = pageMetadata({ title: "Work", description: "How UNFLECT approaches and documents software projects.", path: "/work" });

export default function WorkPage() {
  return (
    <div className="text-bone">
      <EditorialPageHeader section="Work" title="The problem first. The software second." lede="We document work around the business problem, the decisions and the outcome — not vanity screenshots." />

      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="border-y border-line p-7 sm:p-9">
            <p className="text-sm font-medium">Selected work is being published</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-bone/65">{workPlaceholderNotice}</p>
          </div>

          <div className="mt-12 border-t border-line">
            {caseStudies.map((study) => (
              <Link key={study.slug} href={`/work/${study.slug}`} className="group grid gap-6 border-b border-line py-8 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-start sm:gap-10">
                <div><p className="text-[11px] tracking-[0.03em] text-bone/50">{study.service}</p><h2 className="mt-3 font-display text-2xl  tracking-[-0.035em] transition-transform duration-500 ease-[var(--ease-precision)] group-hover:translate-x-2 sm:text-3xl">{study.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-bone/65">{study.summary}</p></div>
                <span className="inline-flex items-center gap-3 text-sm text-bone/65 transition-colors group-hover:text-bone sm:justify-self-end">Read<span className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong transition-all duration-500 ease-[var(--ease-precision)] group-hover:border-bone/60"><ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" /></span></span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-muted">Operating principles</p>
            <h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">Clear decisions. Useful software. No theatre.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted">The rules every engagement follows. These are principles, not testimonials — we will publish real client references only when they have been approved for publication.</p>
          </div>
          <div className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <article key={principle.title} className="border-b border-line p-7 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(odd)]:border-r">
                <span className="font-mono text-[11px] tracking-[0.03em] text-indigo">0{index + 1}</span>
                <h3 className="mt-8 max-w-xs font-display text-xl  tracking-[-0.02em]">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{principle.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="text-xs tracking-[0.03em] text-bone/55">Have a real project?</p><h2 className="mt-4 font-display text-5xl  leading-[0.95] tracking-[-0.02em] sm:text-6xl">Let’s document the right story.</h2></div>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black">Start the conversation</Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
