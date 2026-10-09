import { siteConfig } from "@/config/site";

export interface CoFounder {
  name: string;
  initials: string;
  role: string;
  bio: string;
}

export const founders: readonly CoFounder[] = [
  {
    name: "Zorawar Singh",
    initials: "ZS",
    role: "Co-Founder",
    bio: "Leads engineering and product delivery directly with clients from design to deployment.",
  },
  {
    name: "Sujash Mittal",
    initials: "SM",
    role: "Co-Founder",
    bio: "Drives technical execution and architecture, building and scaling resilient production systems.",
  },
  {
    name: "Rishit Verma",
    initials: "RV",
    role: "Co-Founder",
    bio: "Directs systems engineering and technical infrastructure without agency layers or middlemen.",
  },
] as const;

export const founder = siteConfig.founder;
export const team = siteConfig.team;
export const studioLocation = {
  location: siteConfig.location,
  statement:
    "The person you speak with designs and builds your software — no account managers or outsourced handoffs.",
};

export const aboutIntro = {
  heading: "UNFLECT exists to solve business problems through thoughtfully built software.",
  body: [
    "Most software problems stem from operational processes outgrowing generic tools. We build custom software to solve those gaps honestly and maintainably.",
  ],
} as const;

/**
 * Operating principles. These are commitments, not adjectives.
 */
export const principles = [
  {
    id: "solve-first",
    title: "Solve the problem first",
    detail:
      "Technology is a consequence of the problem; we advise process changes when software is unnecessary.",
  },
  {
    id: "scope-promise",
    title: "Scope is a promise",
    detail:
      "Agreed scope is built; new requirements are handled transparently as formal change requests.",
  },
  {
    id: "clarity",
    title: "Clarity beats cleverness",
    detail:
      "We build clean, maintainable systems that your team can readily understand and operate.",
  },
  {
    id: "security-early",
    title: "Security starts before code",
    detail:
      "Risk is assessed during definition, embedding proportional security controls before building.",
  },
  {
    id: "ai-assists",
    title: "AI assists; people answer",
    detail:
      "Engineers use AI for leverage while remaining personally accountable for all shipped code.",
  },
  {
    id: "no-guarantees",
    title: "We don't make impossible guarantees",
    detail:
      "No software is unbreakable; we offer direct technical reality rather than vague assurances.",
  },
  {
    id: "ship-support",
    title: "Ship, then support honestly",
    detail:
      "We provide thorough handovers, keeping routine maintenance and new feature development strictly distinct.",
  },
  {
    id: "evolve",
    title: "Evolve deliberately",
    detail:
      "System improvements are planned decisions with clear costs, moving at your business's pace.",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  detail: string;
}[];

/**
 * How we engage. Commercial detail is summarised for the website;
 * contractual specifics belong in the commercial documents.
 */
export const engagementModel = [
  {
    id: "small",
    name: "Small projects",
    structure: "50% upfront · 50% before go-live",
    detail: "Single-phase delivery with balance due before go-live or handover.",
  },
  {
    id: "medium",
    name: "Medium projects",
    structure: "30–40% upfront · milestone payments",
    detail: "Milestone-based delivery paid as agreed deliverables are accepted.",
  },
  {
    id: "large",
    name: "Large projects",
    structure: "Paid discovery phase · project-phase payments",
    detail: "Paid discovery phase to agree architecture and scope before build commitments.",
  },
  {
    id: "recurring",
    name: "Recurring work",
    structure: "Monthly, in advance",
    detail: "Monthly agreements for ongoing maintenance, updates, and continuous development.",
  },
] as const satisfies readonly {
  id: string;
  name: string;
  structure: string;
  detail: string;
}[];

export const engagementNote =
  "Exact terms, including IP, liability and warranties, are set out in the commercial documents for each project — not here.";

/**
 * Working definitions. Not displayed prominently on the marketing site;
 * the model exists here so future client-facing systems inherit consistent
 * language.
 */
export const operatingModel = {
  reviewWindowDays: 5,
  reviewWindowNote:
    "Client feedback on delivered increments is expected within 5 business days. Feedback shape is developed around that window.",
  definitions: [
    {
      id: "included-work",
      term: "Included work",
      definition:
        "Work delivered inside the scope, requirements and acceptance criteria agreed for the project.",
    },
    {
      id: "change-request",
      term: "Change request",
      definition:
        "New functionality, or a change to agreed requirements, requested after scope is set. Considered for impact on cost, timeline, scope and milestones before it is approved.",
    },
    {
      id: "warranty",
      term: "Warranty",
      definition:
        "Correction of agreed functionality that does not work as specified. Distinct from new development.",
    },
    {
      id: "maintenance",
      term: "Maintenance",
      definition:
        "Ongoing technical upkeep: hosting, monitoring, security updates, dependency management, backups and fixes to existing behaviour.",
    },
    {
      id: "new-development",
      term: "New development",
      definition:
        "New functionality or major changes beyond maintenance, scoped and priced separately.",
    },
  ],
} as const;

/** What the client receives at handover. */
export const handoverDeliverables = [
  {
    id: "production",
    label: "Production application",
    detail: "The live application running in your environment.",
  },
  {
    id: "repository",
    label: "Source repository",
    detail: "Clean, version-controlled repository owned by you.",
  },
  {
    id: "credentials",
    label: "Access and credentials",
    detail: "Documented credentials for all operational infrastructure.",
  },
  {
    id: "setup-docs",
    label: "Setup documentation",
    detail: "Step-by-step guides for running and deploying the system.",
  },
  {
    id: "architecture",
    label: "Architecture information",
    detail: "System diagrams and structural design documentation.",
  },
  {
    id: "runbook",
    label: "Runbook",
    detail: "Procedures for routine maintenance and incident response.",
  },
  {
    id: "dependencies",
    label: "Dependency information",
    detail: "Documented third-party services, APIs, and version requirements.",
  },
  {
    id: "changelog",
    label: "Changelog",
    detail: "Clear record of delivered changes and release notes.",
  },
  {
    id: "technical-docs",
    label: "Technical documentation",
    detail: "Complete developer references for future system development.",
  },
] as const;

/**
 * Client-owned infrastructure. Important accounts stay with the client where
 * practical, so nothing critical is held hostage by a single vendor.
 */
export const clientOwnedInfrastructure = [
  {
    id: "payments",
    label: "Payment accounts",
    detail: "Merchant accounts and payment keys opened directly in your name.",
  },
  {
    id: "business-accounts",
    label: "Business accounts",
    detail: "Domain registration and cloud hosting remain under your direct control.",
  },
  {
    id: "customer-accounts",
    label: "Customer-facing accounts",
    detail: "Marketplace, social, and communication accounts remain client-owned.",
  },
  {
    id: "critical-third-party",
    label: "Critical third-party services",
    detail: "Essential third-party tooling is registered and billed to your business.",
  },
] as const;
