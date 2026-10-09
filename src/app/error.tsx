"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to server/monitoring without exposing traces to visitors
    console.error("[app-error-boundary]", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className="relative overflow-hidden py-32 sm:py-40 lg:py-48 text-bone">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-60"
      />
      <Container>
        <div className="max-w-2xl">
          <p className="label-mono flex items-center gap-2.5 text-indigo">
            <span aria-hidden="true" className="h-px w-5 bg-indigo/60" />
            Temporary error
          </p>
          <h1 className="mt-7 font-display text-display text-bone">
            Something went wrong loading this page.
          </h1>
          <p className="mt-6 text-lead text-muted-strong">
            The system encountered an unexpected condition. No data was lost. You can try reloading the section or return to the main site.
          </p>

          {error.digest ? (
            <p className="mt-6 font-mono text-xs text-muted">
              Reference code: <span className="text-bone">{error.digest}</span>
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => reset()}
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-6 py-2.5 text-sm font-medium text-bone transition-colors hover:border-bone/50 hover:bg-bone/[0.04]"
            >
              Return home
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center px-4 py-2.5 text-sm text-muted-strong transition-colors hover:text-bone"
            >
              Report an issue
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
