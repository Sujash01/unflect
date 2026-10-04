/**
 * Site-wide configuration: brand, navigation, CTAs, contact details, SEO defaults.
 *
 * Single source of truth. Update values here rather than in components.
 */

export const site = {
  name: "UNFLECT",
  legalName: "UNFLECT",
  domain: "unflect.in",
  url: "https://unflect.in",
  tagline: "We build software that solves real business problems.",
  positioning:
    "A premium software company helping businesses turn real problems into working software.",
  description:
    "UNFLECT designs, builds and supports custom software for businesses — web platforms, internal systems and integrations. Discover, define, build, deploy, evolve.",
  locale: "en_GB",
  /**
   * Primary contact address. Set to null to hide rather than ship a placeholder
   * mailbox. Placeholder values are intentionally NOT used.
   */
  email: null as string | null,
  phone: null as string | null,
  location: "Remote-first — working with businesses worldwide",
  founded: null as string | null,
  /**
   * Analytics is wired up but intentionally ships disabled. See src/lib/analytics.ts.
   * Set to true once a provider (e.g. GA4, Plausible, Fathom) is configured.
   */
  analytics: {
    enabled: false as boolean,
    provider: null as string | null,
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
} as const;

/**
 * Primary navigation. Kept intentionally short — five destinations plus the
 * conversion action. Future additions (Resources, Careers) slot in here.
 */
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
} as const;

export const brandStatements = {
  positioning: "We build software that solves real business problems.",
  hero: "We build software that solves real business problems.",
  offering: "Web + Systems + Integrations",
  process: "Discover \u2192 Define \u2192 Build \u2192 Deploy \u2192 Evolve",
  philosophy: "Solve the problem first.",
  ai: "AI assists; people answer.",
  detail: "UNFLECT understands the problem before it builds the solution.",
} as const;
