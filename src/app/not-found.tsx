import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { navigation } from "@/content/site";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-60"
      />
      <Container>
        <div className="max-w-2xl py-32 sm:py-40 lg:py-48">
          <p className="label-mono flex items-center gap-2.5 text-indigo">
            <span aria-hidden="true" className="h-px w-5 bg-indigo/60" />
            Error 404
          </p>
          <h1 className="mt-7 text-display">This page does not exist.</h1>
          <p className="mt-7 text-lead text-muted-strong">
            The link may be out of date, or the page may have moved. Here is the way
            back.
          </p>

          <nav aria-label="Suggested pages" className="mt-11">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group/nav inline-flex min-h-11 items-center gap-2 py-2.5 text-[0.9375rem] text-muted-strong transition-colors hover:text-indigo"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-indigo transition-all duration-300 ease-[var(--ease-precision)] group-hover/nav:w-3"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-11 flex flex-wrap gap-3">
            <ButtonLink href="/contact" location="not_found" size="lg">
              Start a project
            </ButtonLink>
            <ButtonLink href="/" location="not_found" variant="outline" size="lg">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
