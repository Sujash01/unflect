import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, Calendar, ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { contactGuidance, contactIntro } from "@/content/company-extra";
import { siteConfig } from "@/config/site";
import { EditorialPageHeader } from "@/components/ui/page-header";
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
      <EditorialPageHeader
        section="Contact"
        title={contactIntro.heading}
        lede={contactIntro.body}
      />

      <section className="border-b border-line bg-navy-inset/70 py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
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

            <div id="form">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl border border-line bg-navy-raised" />
                }
              >
                <EnquiryForm />
              </Suspense>
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
