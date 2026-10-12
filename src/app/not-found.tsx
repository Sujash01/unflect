import { Logo, Wordmark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";

/**
 * Custom 404 — a premium, on-brand "page not found" surface.
 *
 * Rendered by Next.js for any unmatched route. It returns a real 404 status
 * (no redirect to the homepage) and reuses the site's design tokens, type scale
 * and primitives so it reads as part of UNFLECT rather than a template.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden text-bone">
      {/* Backdrop: the site's grid texture, softly masked. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-70"
      />
      {/* Indigo bloom — the recurring accent light, drifting gently. */}
      <div
        aria-hidden="true"
        className="notfound-bloom pointer-events-none absolute left-1/2 top-1/3 h-[42rem] w-[42rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(78,140,163,0.16),transparent_66%)] blur-3xl"
      />

      <Container>
        <div className="flex min-h-[calc(100svh-4.75rem)] flex-col sm:min-h-[calc(100svh-5rem)]">
          {/* Brand */}
          <div className="flex items-center justify-between py-6">
            <Wordmark />
          </div>

          {/* Hero */}
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <Eyebrow>Error 404</Eyebrow>

            {/* The numeral is the visual anchor; the eyebrow above carries the
                accessible label, so the number itself is decorative. */}
            <div aria-hidden="true" className="mt-2 select-none">
              <span className="block bg-[linear-gradient(180deg,var(--color-bone)_0%,var(--color-indigo)_100%)] bg-clip-text font-display text-[clamp(6.5rem,26vw,19rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-transparent">
                404
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl font-display text-display text-bone text-balance">
              This page doesn&rsquo;t exist.
            </h1>
            <p className="mt-6 max-w-xl text-lead text-muted-strong">
              The page you&rsquo;re looking for may have moved, or the link might be incorrect.
            </p>

            <nav aria-label="404 recovery" className="mt-11 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/"
                location="not_found"
                size="lg"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/70"
              >
                Back to Home
              </ButtonLink>
              <ButtonLink
                href="/contact"
                location="not_found"
                variant="outline"
                size="lg"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/70"
              >
                Contact Us
              </ButtonLink>
            </nav>
          </div>

          {/* Quiet brand footer */}
          <div className="flex items-center justify-center gap-3 pb-8">
            <Logo size={16} />
            <p className="label-mono text-muted">UNFLECT — We build software that solves real business problems.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
