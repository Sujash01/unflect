"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { analytics, track } from "@/lib/analytics";

/**
 * Case-study links emit `case_study_click` so engagement can be measured
 * without making the surrounding card a client component.
 */
export function TrackedCaseStudyLink({
  slug,
  location,
  href,
  className,
  children,
}: {
  slug: string;
  location: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      data-focus-managed
      onClick={() => analytics.caseStudyClick(slug, location)}
    >
      {children}
    </Link>
  );
}

/**
 * Emits `case_study_view` once when a case-study detail page mounts.
 * Renders nothing.
 */
export function CaseStudyViewTracker({
  slug,
  status,
  service,
}: {
  slug: string;
  status: string;
  service: string;
}) {
  useEffect(() => {
    track({ name: "case_study_view", slug, status, service });
  }, [slug, status, service]);

  return null;
}
