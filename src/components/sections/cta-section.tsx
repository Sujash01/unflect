import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  eyebrow?: string;
  title: string;
  body: string;
  /** Where the primary CTA points. Defaults to the enquiry form. */
  primaryHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Analytics context. */
  location?: string;
  /** Compact variant for interior pages where the footer already carries a CTA. */
  compact?: boolean;
};

/**
 * The single conversion band. One component, consistent wording, consistent
 * behaviour — the CTA never changes shape between pages.
 *
 * Treated as a bordered frame rather than a filled band: a panel that says
 * "act here" should look like an object, not like another page section. The
 * spectrum filament across the top is the site's transition marker.
 */
export function CtaSection({
  eyebrow = "Start a project",
  title,
  body,
  primaryHref = "/contact",
  secondaryHref = "/work",
  secondaryLabel = "See our work",
  location = "cta_band",
  compact = false,
}: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-navy-inset/70">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-bloom-indigo opacity-60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-y opacity-40"
      />

      <Container>
        <div className={compact ? "py-14 lg:py-18" : "py-18 lg:py-24"}>
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-line bg-module/70 px-6 py-10 sm:px-9 sm:py-12 lg:px-12",
              compact ? "lg:py-14" : "lg:py-16",
            )}
          >
            {/* Transition marker: the full spectrum, dimmed. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-spectrum-gradient opacity-60"
            />
            {/* Grid, so the frame sits on the same surface language. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40"
            />

            <div className="relative flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
              <Reveal className="max-w-2xl">
                <p className="label-mono flex items-center gap-2.5 text-indigo">
                  <span aria-hidden="true" className="h-1 w-1 bg-indigo" />
                  <span aria-hidden="true" className="h-px w-5 bg-indigo/60" />
                  {eyebrow}
                </p>
                <h2 className="mt-6 text-display">{title}</h2>
                <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted-strong sm:text-lead">
                  {body}
                </p>
              </Reveal>

              <Reveal delay={90} className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <ButtonLink href={primaryHref} location={location} size="lg">
                  Start a project
                </ButtonLink>
                {secondaryHref ? (
                  <ButtonLink
                    href={secondaryHref}
                    location={location}
                    variant="outline"
                    size="lg"
                  >
                    {secondaryLabel}
                  </ButtonLink>
                ) : null}
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
