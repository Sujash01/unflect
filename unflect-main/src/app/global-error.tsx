"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070b12] text-[#f2f4f8] font-sans antialiased flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[#7ea8be]">
            System Error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl text-[#f2f4f8]">
            An unexpected error occurred.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">
            We could not complete your request. No sensitive data was exposed. Please reload to try again.
          </p>

          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-[#64748b]">
              Incident ID: {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-[#f2f4f8] px-6 py-2.5 text-sm font-medium text-[#070b12] transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-[#2b3547] px-6 py-2.5 text-sm font-medium text-[#f2f4f8] transition-colors hover:bg-white/[0.05]"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
