"use client";

/**
 * Analytics event layer.
 *
 * INTENTIONALLY SHIPPES DISABLED. See site.analytics in src/content/site.ts.
 *
 * The site has no third-party analytics script and sets no cookies, so nothing
 * is tracked out of the box. What exists here is the measurement *structure*:
 * every meaningful interaction emits a typed event through one function. When a
 * provider is chosen, enable it in content/site.ts and point `deliver` at it.
 * No component code needs to change.
 *
 * Business metrics this is designed to support:
 *   Primary   \u2014 qualified project enquiries, form conversion rate,
 *               project conversion rate.
 *   Secondary \u2014 service engagement, case-study engagement, CTA CTR,
 *               returning visitors, page performance.
 */

import { site } from "@/content/site";

export type AnalyticsEvent =
  | { name: "page_view"; path: string; title: string; referrer: string }
  | { name: "cta_click"; location: string; label: string; href: string }
  | { name: "nav_click"; label: string; href: string }
  | { name: "service_interest"; slug: string; serviceName: string; location: string }
  | { name: "case_study_view"; slug: string; status: string; service: string }
  | { name: "case_study_click"; slug: string; location: string }
  | { name: "form_start"; field: string }
  | { name: "form_submit_attempt" }
  | {
      name: "form_submit_success";
      reference: string;
      projectType: string;
      timeline: string;
      budget: string;
    }
  | {
      name: "form_submit_error";
      fields: string[];
      reason: "validation" | "network" | "server";
    }
  | { name: "process_stage_view"; stage: string; index: string }
  | { name: "security_level_expand"; level: string }
  | { name: "outbound_click"; href: string; location: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

/**
 * Sends the event to any configured sink.
 * Plausible, Umami, dataLayer, and custom unflect:analytics event.
 */
function deliver(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // Plausible custom event hook (cookie-free, privacy-preserving)
  if (typeof window.plausible === "function") {
    window.plausible(event.name, { props: event as unknown as Record<string, unknown> });
  }

  // Umami custom event hook (cookie-free, privacy-preserving)
  if (typeof window.umami?.track === "function") {
    window.umami.track(event.name, event as unknown as Record<string, unknown>);
  }

  // Standard GTM/GA4 dataLayer convention if present
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(event);
  }

  // Allows non-provider listeners to observe events without vendor coupling
  window.dispatchEvent(
    new CustomEvent<AnalyticsEvent>("unflect:analytics", { detail: event }),
  );
}

export function track(event: AnalyticsEvent): void {
  if (!site.analytics.enabled) {
    // Disabled by default. Uncomment to observe events locally during
    // development without wiring a provider.
    // if (process.env.NODE_ENV === "development") {
    //   console.debug("[analytics]", event);
    // }
    return;
  }
  deliver(event);
}

/* ------------------------------------------------------------------ */
/* Typed helpers \u2014 use these rather than calling track() directly.    */
/* ------------------------------------------------------------------ */

export const analytics = {
  ctaClick(location: string, label: string, href: string) {
    track({ name: "cta_click", location, label, href });
  },
  navClick(label: string, href: string) {
    track({ name: "nav_click", label, href });
  },
  serviceInterest(slug: string, serviceName: string, location: string) {
    track({ name: "service_interest", slug, serviceName, location });
  },
  caseStudyClick(slug: string, location: string) {
    track({ name: "case_study_click", slug, location });
  },
  formStart(field: string) {
    track({ name: "form_start", field });
  },
  formSubmitAttempt() {
    track({ name: "form_submit_attempt" });
  },
  formSubmitSuccess(input: {
    reference: string;
    projectType: string;
    timeline: string;
    budget: string;
  }) {
    track({ name: "form_submit_success", ...input });
  },
  formSubmitError(fields: string[], reason: "validation" | "network" | "server") {
    track({ name: "form_submit_error", fields, reason });
  },
  processStageView(stage: string, index: string) {
    track({ name: "process_stage_view", stage, index });
  },
  securityLevelExpand(level: string) {
    track({ name: "security_level_expand", level });
  },
  outboundClick(href: string, location: string) {
    track({ name: "outbound_click", href, location });
  },
};
