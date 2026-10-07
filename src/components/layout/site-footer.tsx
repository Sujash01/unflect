"use client";

import Link from "next/link";
import { ArrowUp, ExternalLink, Github, Linkedin } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { SplitText } from "@/components/fx/split-text";
import { GiantWordmark } from "@/components/fx/giant-wordmark";
import { footerNavigation, site, siteConfig } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy text-bone">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(78,140,163,0.08),transparent_65%)] blur-2xl"
      />

      <div className="container-page relative pb-8 pt-20 sm:pt-28">
        <h2 className="max-w-4xl font-display text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[1] tracking-[-0.025em]">
          <SplitText text="Let's build something that works." accent={["works"]} />
        </h2>

        <div className="mt-16 grid gap-12 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="inline-flex w-fit rounded-[14px] p-1"
            >
              <Wordmark size={26} />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-strong">
              {site.positioning}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-2.5 text-sm transition-colors hover:border-bone/50 hover:bg-bone/[0.04]"
              >
                <span className="u-link">Open to new projects</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-strong">
              <a
                href={siteConfig.founder.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-bone"
              >
                <Github className="h-3.5 w-3.5 text-indigo-bright" />
                GitHub
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
              <a
                href={siteConfig.founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-bone"
              >
                <Linkedin className="h-3.5 w-3.5 text-indigo-bright" />
                LinkedIn
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
            </div>
          </div>

          <nav aria-label="Company links">
            <p className="label-mono text-muted">Company</p>
            <div className="mt-5 flex flex-col gap-3">
              {footerNavigation.company.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group w-fit text-sm text-muted-strong transition-colors hover:text-bone"
                >
                  <span className="u-link">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Service links">
            <p className="label-mono text-muted">Services</p>
            <div className="mt-5 flex flex-col gap-3">
              {footerNavigation.services.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group w-fit text-sm text-muted-strong transition-colors hover:text-bone"
                >
                  <span className="u-link">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Legal links">
            <p className="label-mono text-muted">Legal</p>
            <div className="mt-5 flex flex-col gap-3">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group w-fit text-sm text-muted-strong transition-colors hover:text-bone"
                >
                  <span className="u-link">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Studio Facts Strip */}
        <div className="mt-16 rounded-2xl border border-line bg-navy-inset/40 p-6 sm:p-8">
          <p className="label-mono text-indigo">Studio facts</p>
          <div className="mt-4 grid gap-5 text-xs leading-relaxed text-muted-strong sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-l border-line pl-3.5">
              <span className="block font-medium text-bone">Remote-first</span>
              <span>Zero agency overhead; direct asynchronous and scheduled collaboration globally.</span>
            </div>
            <div className="border-l border-line pl-3.5">
              <span className="block font-medium text-bone">Founder-led</span>
              <span>The engineer you speak with scopes, architects, and builds the software.</span>
            </div>
            <div className="border-l border-line pl-3.5">
              <span className="block font-medium text-bone">Full code ownership</span>
              <span>Repositories, infrastructure accounts, and runbooks transfer at handover.</span>
            </div>
            <div className="border-l border-line pl-3.5">
              <span className="block font-medium text-bone">Human accountability</span>
              <span>No automated sales sequences; direct engineering assessment on every enquiry.</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <GiantWordmark />
        </div>

        <div className="relative mt-4 flex flex-col gap-4 border-t border-line pb-24 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:pb-28">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {year} {site.name}</span>
            <span aria-hidden="true" className="text-line-strong">·</span>
            <span>Remote-first custom software studio</span>
            <span aria-hidden="true" className="text-line-strong">·</span>
            <span>Zero third-party trackers</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.founder.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              GitHub
            </a>
            <a
              href={siteConfig.founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex w-fit items-center gap-2 text-muted-strong transition-colors hover:text-bone"
            >
              <span className="u-link">Back to top</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:-translate-y-1 group-hover:border-bone/60">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
