/**
 * Site-wide configuration bridge.
 * Reads directly from central configuration in src/config/site.ts.
 */

import { siteConfig } from "@/config/site";

export { siteConfig };

export const site = {
  name: siteConfig.name,
  legalName: siteConfig.legalEntityName,
  domain: siteConfig.domain,
  url: siteConfig.url,
  tagline: siteConfig.tagline,
  positioning: siteConfig.positioning,
  description: siteConfig.description,
  locale: siteConfig.locale,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location.includes("[CONFIRM") ? "Remote-first studio" : siteConfig.location,
  founded: null as string | null,
  analytics: {
    enabled: Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"),
    provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || null) as string | null,
  },
} as const;

export const cta = {
  primary: {
    label: "Start a project",
    href: "/contact",
  },
  secondary: {
    label: "See our work",
    href: "/work",
  },
  process: {
    label: "See how we work",
    href: "/process",
  },
} as const;

export const navigation = [
  { label: "Services", href: "/services", shortLabel: "Services" },
  { label: "Work", href: "/work", shortLabel: "Work" },
  { label: "Process", href: "/process", shortLabel: "Process" },
  { label: "About", href: "/about", shortLabel: "About" },
  { label: "Contact", href: "/contact", shortLabel: "Contact" },
] as const;

export const footerNavigation = {
  company: [
    { label: "About", href: "/about" },
    { label: "Process", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Web", href: "/services/web" },
    { label: "Systems", href: "/services/systems" },
    { label: "Integrations", href: "/services/integrations" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export const brandStatements = {
  positioning: siteConfig.positioning,
  hero: "Software for the way your business actually works.",
  offering: "Web + Systems + Integrations",
  process: "Discover → Define → Build → Deploy → Evolve",
  philosophy: "Solve the problem first.",
  ai: "AI assists; people answer.",
  detail: "UNFLECT understands the problem before it builds the solution.",
} as const;
