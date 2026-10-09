/**
 * Central site configuration for UNFLECT.
 *
 * Single typed source of truth for company facts, founder info, legal details,
 * project registry, contact channels, and SEO defaults.
 *
 * HARD RULE: Never invent facts. Unconfirmed data points use marked placeholders
 * (e.g. "[CONFIRM: ...]") and are reported to the site owner.
 */

export type ProjectStatus =
  | "early_access"
  | "sample_project"
  | "coming_soon"
  | "client_work";

export type ConfigProject = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly url: string | null;
  readonly status: ProjectStatus;
  readonly statusLabel: string;
  readonly summary: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly features?: readonly string[];
  readonly paymentsHandledByPlatform?: boolean | null;
};

export const siteConfig = {
  name: "UNFLECT",
  legalEntityName: "[CONFIRM: Legal entity name]",
  legalEntityType: "[CONFIRM: Type (sole proprietorship/LLP/Pvt Ltd)]",
  registrationNumber: "[CONFIRM: Registration no. (if any)]",
  domain: "unflect.in",
  url: "https://unflect.in",
  remoteFirst: true,
  tagline: "We build software that solves real business problems.",
  positioning:
    "A small software studio that builds custom web products, internal systems and integrations.",
  description:
    "UNFLECT designs, builds and supports custom software for businesses — web platforms, internal systems and integrations. Discover, define, build, deploy, evolve.",
  locale: "en_GB",

  /** Location & address */
  location: "[CONFIRM: City, Country]",
  publicAddress: "Not published (Remote-first studio)",

  /** Contact channels */
  email: "[CONFIRM: Contact email]",
  privacyEmail: "[CONFIRM: Privacy contact email]",
  phone: null as string | null, // "[CONFIRM: Phone/WhatsApp (optional)]"
  bookingLink: null as string | null, // "[CONFIRM: Booking link (Calendly etc., optional)]"
  responseWindow: "[CONFIRM: Response timeframe, e.g. 2 working days]",

  /** Legal dates */
  lastUpdatedLegal: "5 October 2026",

  /** Founder profile */
  founder: {
    name: "Zorawar Singh",
    role: "[CONFIRM: Founder role]",
    bio: "[CONFIRM: 2-3 true sentences bio]",
    photo: null as string | null, // "[CONFIRM: Photo file]"
    linkedin: "https://www.linkedin.com/in/zorawarsingh170406",
    github: "https://github.com/17Zoras",
    portfolio: "https://portfolio-gamma-kohl-71.vercel.app/index.html",
  },

  /** Other team members: "none" confirmed so far */
  team: [] as const,

  /** Technologies actually used across verified projects A-D */
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Supabase Auth & Database",
    "Power BI & DAX",
    "Tailwind CSS",
    "Custom REST APIs",
  ] as const,

  /** Projects registry */
  projects: [
    {
      id: "paperplane",
      slug: "paperplane",
      name: "PaperPlane",
      url: "https://paperplane.buzz",
      status: "early_access",
      statusLabel: "Early access",
      summary:
        "Marketplace connecting YouTube and creator channels with video editors, thumbnail designers, script writers, and motion artists.",
      description:
        "A platform built by UNFLECT providing creator channels and independent creative talent with public freelancer profiles, gig posting, applications, in-platform messaging, saved gigs, reviews, reporting, and legal compliance pages.",
      stack: [
        "HTML/CSS/JS",
        "Supabase Auth & Database",
        "Custom API",
        "[CONFIRM: Additional stack details]",
      ],
      features: [
        "Public freelancer profiles",
        "Gig posting & application management",
        "In-platform messaging",
        "Saved gigs & bookmarking",
        "Reviews and reporting",
        "Privacy, terms, community guidelines & grievance pages",
      ],
      paymentsHandledByPlatform: null, // [CONFIRM: Payments handled by platform YES/NO]
    },
    {
      id: "dataforge",
      slug: "dataforge",
      name: "DataForge",
      url: "https://data-forge-liart.vercel.app/",
      status: "sample_project",
      statusLabel: "Sample project",
      summary:
        "Data analytics and BI consultancy website with interactive Power BI dashboards for churn, sales, and financial analysis.",
      description:
        "Sample analytics consultancy project demonstrating executive reporting, churn analytics, and sales tracking built on sample/public datasets.",
      stack: ["React", "Power BI", "DAX", "Power Query", "SQL Server"],
      features: [
        "Interactive Power BI dashboard previews",
        "Customer churn command centre model",
        "B2B distribution sales performance tracking",
        "Multi-entity financial performance reporting",
      ],
      paymentsHandledByPlatform: false,
    },
    {
      id: "preptwin",
      slug: "preptwin",
      name: "PrepTwin",
      url: null, // No public URL confirmed yet; not linked
      status: "coming_soon",
      statusLabel: "Coming soon",
      summary:
        "Software project in development. Public link and technical documentation coming soon.",
      description:
        "PrepTwin is currently in active development. Detailed scope and stack notes will be published upon public release.",
      stack: ["[CONFIRM: PrepTwin stack]"],
      paymentsHandledByPlatform: null,
    },
  ] as const satisfies readonly ConfigProject[],

  /** Typical engagement shapes (pricing ranges not invented) */
  typicalEngagements: [
    {
      id: "small",
      name: "Small projects",
      structure: "50% upfront · 50% before go-live",
      detail:
        "Single-phase delivery for focused requirements. The balance falls due before go-live or handover.",
      priceRange: null, // [CONFIRM: Price range or contact for scope]
    },
    {
      id: "medium",
      name: "Medium projects",
      structure: "30–40% upfront · milestone payments",
      detail:
        "Phased delivery paid in defined milestones as agreed deliverables are accepted.",
      priceRange: null,
    },
    {
      id: "large",
      name: "Large projects",
      structure: "Paid discovery phase · project-phase payments",
      detail:
        "A paid Discovery and Define phase first, so architecture and scope are agreed before build commitments are made.",
      priceRange: null,
    },
    {
      id: "recurring",
      name: "Recurring support",
      structure: "Monthly, in advance",
      detail:
        "Ongoing maintenance, monitoring, dependency updates, and continuous development under clear service boundaries.",
      priceRange: null,
    },
  ] as const,

  /** Frequently asked questions (accordion on homepage) */
  faqs: [
    {
      question: "Who owns the code?",
      answer:
        "You do. At handover, you receive full ownership of the source repository, documentation, and configuration. Nothing is held hostage.",
    },
    {
      question: "What happens after launch?",
      answer:
        "We hand over properly with setup documentation, runbooks, and credential transfers. We offer ongoing maintenance and support under a separate, honest agreement so maintenance and new development remain clearly distinct.",
    },
    {
      question: "Do you work with small businesses?",
      answer:
        "Yes. We are a small studio built specifically to solve focused, concrete operational problems for growing businesses, without corporate overhead or agency layers.",
    },
    {
      question: "What time zones do you work in?",
      answer:
        "We are remote-first and coordinate work across business time zones with clear async communication, documented decisions, and regular check-ins.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payments are structured by project scale: 50% upfront and 50% before go-live for small projects; 30–40% upfront with agreed milestone payments for medium projects; and a paid Discovery phase followed by phase payments for large systems.",
    },
    {
      question: "What if we're not a fit?",
      answer:
        "We will tell you directly during the initial enquiry review. If software is not the right answer, or if an off-the-shelf tool would solve your problem faster and cheaper, we say so.",
    },
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
