import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, Calendar, ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { contactGuidance, contactIntro } from "@/content/company-extra";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start a Project",
  description:
    "Tell UNFLECT what you are trying to build and what problem is in the way.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="text-bone">
      {/* Form Section - Positioned at top for immediate above-the-fold access */}
      <section className="relative overflow-hidden border-b border-line pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="aurora-blob aurora-a -right-[10%] -top-[30%] h-[36rem] w-[36rem] opacity-70" />
          <div className="aurora-blob aurora-b -left-[16%] top-[20%] h-[32rem] w-[32rem] opacity-60" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.2] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <Container>
          <div className="relative mb-8 sm:mb-10">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.03em] text-muted">
              <span className="flex items-center gap-2 text-indigo">
                Contact
              </span>
              <span className="text-line-strong">/</span>
              <span>Start a project</span>
            </div>
            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98] tracking-[-0.03em] text-bone">
                  Start a Project
                </h1>
                <p className="mt-2.5 max-w-xl text-base leading-relaxed text-muted-strong sm:text-lg">
                  Tell UNFLECT what you are trying to build. We review every brief and reply with honest feedback.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
                {!siteConfig.email.includes("[CONFIRM") ? (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-module/70 px-3.5 py-1.5 text-bone transition-colors hover:border-line-strong hover:text-indigo-bright"
                  >
                    <Mail className="h-3.5 w-3.5 text-indigo-bright" />
                    <span>{siteConfig.email}</span>
                  </a>
                ) : null}
                {siteConfig.bookingLink ? (
                  <a
                    href={siteConfig.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-module/70 px-3.5 py-1.5 text-indigo-bright transition-colors hover:border-line-strong hover:underline"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book intro call</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
            <div id="form">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl border border-line bg-navy-raised" />
                }
              >
                <EnquiryForm />
              </Suspense>
            </div>

            <div className="space-y-8 lg:sticky lg:top-28">
              {/* Alternative Direct Channels */}
              <div className="rounded-2xl border border-line bg-module/60 p-6 sm:p-7">
                <p className="label-mono text-indigo">Direct channels</p>
                <h2 className="mt-3 font-display text-xl text-bone">
                  Prefer direct communication?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                  If you prefer to bypass the form, write directly to our mailbox with your project context.
                </p>

                <div className="mt-5 space-y-3 border-t border-line pt-4">
                  {!siteConfig.email.includes("[CONFIRM") ? (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 shrink-0 text-indigo-bright" />
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="font-mono text-xs text-bone hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 shrink-0 text-indigo-bright" />
                      <span className="text-xs text-muted">
                        Direct contact via project enquiry form
                      </span>
                    </div>
                  )}

                  {siteConfig.bookingLink ? (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 shrink-0 text-indigo-bright" />
                      <a
                        href={siteConfig.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-indigo-bright hover:underline"
                      >
                        Book an intro call
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* What happens next */}
              <div>
                <p className="text-xs tracking-[0.03em] text-muted">
                  What happens next
                </p>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {contactIntro.expectations.map((item, index) => (
                    <li
                      key={item}
                      className="grid gap-3 py-4 sm:grid-cols-[2rem_1fr]"
                    >
                      <span className="font-mono text-xs text-indigo">
                        0{index + 1}
                      </span>
                      <span className="text-sm leading-6 text-muted-strong">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Info Section - Shifted below the form section */}
      <section className="border-b border-line bg-navy-inset/70 py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
                {contactIntro.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.96] tracking-[-0.025em] text-bone">
                {contactIntro.heading}
              </h2>
            </div>
            <div className="max-w-md lg:pb-2">
              <p className="text-base leading-7 text-muted-strong sm:text-lg">
                {contactIntro.body}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.03em] text-muted">
              Make the enquiry useful
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.02em] text-bone sm:text-6xl">
              The clearer the problem, the faster we can be useful.
            </h2>
          </div>
          <div className="mt-12 grid border-t border-line md:grid-cols-4">
            {contactGuidance.map((item, index) => (
              <div
                key={item.id}
                className="border-b border-line py-7 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"
              >
                <span className="font-mono text-[11px] text-indigo">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-base font-medium text-bone">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-strong">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-inset/70 py-24 sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(circle_at_50%_60%,black,transparent_75%)]"
        />
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="font-mono text-[11px] tracking-[0.03em] text-indigo">
              Start here
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.96] tracking-[-0.02em] text-bone">
              One honest brief. Then a considered reply.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-strong">
              You&apos;ll get an immediate transactional receipt, followed by a considered reply from a person within{" "}
              {siteConfig.responseWindow.includes("[CONFIRM")
                ? "2 working days"
                : siteConfig.responseWindow}{" "}
              — no automated sales sequences.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
