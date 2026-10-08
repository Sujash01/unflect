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
    bio: "Zorawar leads engineering and product delivery at UNFLECT, working directly with clients to design, build, and support production systems.",
  },
  {
    name: "Sujash Mittal",
    initials: "SM",
    role: "Co-Founder",
    bio: "Sujash drives technical execution and product strategy at UNFLECT, working directly with clients to build and scale production systems.",
  },
  {
    name: "Rishit Verma",
    initials: "RV",
    role: "Co-Founder",
    bio: "Rishit drives systems engineering and technical architecture at UNFLECT, ensuring resilient software delivery without middlemen.",
  },
] as const;

export const founder = siteConfig.founder;
export const team = siteConfig.team;
export const studioLocation = {
  location: siteConfig.location,
  statement:
    "UNFLECT is a small custom software studio. The person you speak with is the person who actually designs and builds your software — no account managers, no layers, and no outsourced handoffs.",
};

export const aboutIntro = {
  heading: "UNFLECT exists to solve business problems through thoughtfully built software.",
  body: [
    "Most software problems are not technology problems. A process has grown past the tools that support it. Two systems hold the same information and neither knows about the other. A platform was bought for a different business and now everybody works around it. Someone has been doing the manual part by hand for so long that it has become invisible.",
    "Off-the-shelf software is genuinely good at the problems it was designed to solve. Where a business is different \u2014 in how it sells, how it operates, how it is regulated, or simply in the detail that matters to it \u2014 the gap has to be closed deliberately. That is the work UNFLECT does.",
    "We are not interested in shipping the most software. We are interested in the software solving the actual problem, being maintainable after we leave, and being honest about what it does and does not do.",
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
      "The technology is a consequence of the problem, not the starting point. If software is not the right answer, we will say so \u2014 including when the right answer is to change a process instead.",
  },
  {
    id: "scope-promise",
    title: "Scope is a promise",
    detail:
      "What is agreed is what gets built. New requirements are handled transparently as change requests, with the effect on cost and timeline made clear before the work starts.",
  },
  {
    id: "clarity",
    title: "Clarity beats cleverness",
    detail:
      "Software should be understandable by the people who depend on it. We favour clear, maintainable systems over impressive ones that only the builder can follow.",
  },
  {
    id: "security-early",
    title: "Security starts before code",
    detail:
      "Risk is assessed during definition, when the cheapest decisions are still available. Controls follow the risk level of the project, not a fixed list applied to everything.",
  },
  {
    id: "ai-assists",
    title: "AI assists; people answer",
    detail:
      "We use AI as a development capability where it genuinely helps. A person remains accountable for reviewing output, testing it, securing it and standing behind what ships.",
  },
  {
    id: "no-guarantees",
    title: "We don't make impossible guarantees",
    detail:
      "No software is unbreakable, no result is certain, and no deadline survives a change in requirements. We are direct about that rather than reassuring and vague.",
  },
  {
    id: "ship-support",
    title: "Ship, then support honestly",
    detail:
      "Delivery is not the end. We hand over properly, then maintain and improve what we built \u2014 keeping maintenance and new development clearly separated.",
  },
  {
    id: "evolve",
    title: "Evolve deliberately",
    detail:
      "Change is treated as a decision with a cost, not an accident. We improve systems on purpose, at a pace the business can absorb.",
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
    structure: "50% upfront \u00b7 50% before go-live",
    detail:
      "Single-phase delivery. The balance falls due before go-live or handover.",
  },
  {
    id: "medium",
    name: "Medium projects",
    structure: "30\u201340% upfront \u00b7 milestone payments",
    detail:
      "Paid in defined milestones as agreed work is delivered and accepted.",
  },
  {
    id: "large",
    name: "Large projects",
    structure: "Paid discovery phase \u00b7 project-phase payments",
    detail:
      "A paid Discovery and Define phase first, so scope is set before build commitments are made.",
  },
  {
    id: "recurring",
    name: "Recurring work",
    structure: "Monthly, in advance",
    detail:
      "For ongoing maintenance and continuous development.",
  },
] as const satisfies readonly {
  id: string;
  name: string;
  structure: string;
  detail: string;
}[];

export const engagementNote =
  "Exact terms, including IP, liability and warranties, are set out in the commercial documents for each project \u2014 not here.";

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
    detail: "The live application running in your own environment.",
  },
  {
    id: "repository",
    label: "Source repository",
    detail: "Version-controlled source, owned by the client.",
  },
  {
    id: "credentials",
    label: "Access and credentials",
    detail: "Documented access to the systems needed to operate it.",
  },
  {
    id: "setup-docs",
    label: "Setup documentation",
    detail: "How to run, deploy and configure the application.",
  },
  {
    id: "architecture",
    label: "Architecture information",
    detail: "How the system is structured and why.",
  },
  {
    id: "runbook",
    label: "Runbook",
    detail: "Operational procedures for routine and incident work.",
  },
  {
    id: "dependencies",
    label: "Dependency information",
    detail: "Third-party services, versions and what they are used for.",
  },
  {
    id: "changelog",
    label: "Changelog",
    detail: "What changed, when, and why.",
  },
  {
    id: "technical-docs",
    label: "Technical documentation",
    detail: "Relevant documentation for future development and handover.",
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
    detail:
      "Merchant accounts and payment credentials are opened and owned by the client.",
  },
  {
    id: "business-accounts",
    label: "Business accounts",
    detail: "Domain registration, hosting and business tooling remain client accounts.",
  },
  {
    id: "customer-accounts",
    label: "Customer-facing accounts",
    detail:
      "Accounts in front of your customers \u2014 marketplaces, social, support and communication tools \u2014 stay under your control.",
  },
  {
    id: "critical-third-party",
    label: "Critical third-party services",
    detail:
      "Where a third-party service is critical, it is identified early and kept in client ownership where practical.",
  },
] as const;
