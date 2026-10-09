/**
 * Case study data model & registry.
 *
 * HARD RULE: Never invent metrics, clients, ratings, or results.
 * Every project is honestly labeled with its status:
 *   - "early_access": live product built by UNFLECT currently in early access
 *   - "sample_project": demonstration build on public/sample data
 *   - "coming_soon": product currently in active development
 *   - "published": client-approved project with verified outcomes
 */

export type CaseStudyStatus =
  | "early_access"
  | "sample_project"
  | "coming_soon"
  | "published";

export type CaseStudyScreenshot = {
  readonly src: string;
  readonly title: string;
  readonly caption: string;
};

export type CaseStudy = {
  readonly slug: string;
  readonly status: CaseStudyStatus;
  readonly statusLabel: string;
  /** Approved client name, or null for anonymised or internal work. */
  readonly client: string | null;
  /** Sector descriptor, e.g. "Creator Economy · Marketplace". */
  readonly sector: string;
  /** Primary service category. */
  readonly service: "web" | "systems" | "integrations";
  readonly title: string;
  /** One line summary. */
  readonly summary: string;
  /** Business problem. */
  readonly problem: string;
  /** Constraints and challenges. */
  readonly challenge: string;
  /** What UNFLECT built. */
  readonly solution: string;
  /** How it works. */
  readonly howItWorks: readonly string[];
  /** Notable technical decisions. */
  readonly approachNotes: readonly string[];
  /** Where the project stands today. */
  readonly whereItStands: readonly string[];
  /** What we'd do differently or next. */
  readonly whatWedDoDifferently: readonly string[];
  /** Verified outcome. */
  readonly outcome: string;
  /** Client-approved verified figures only. Empty when unconfirmed. */
  readonly metrics: readonly { readonly label: string; readonly value: string }[];
  /** Optional screenshot path under /public. Null when image pending. */
  readonly image: string | null;
  readonly imagePlaceholderLabel: string;
  readonly screenshots?: readonly CaseStudyScreenshot[];
  readonly tags: readonly string[];
  readonly completedAt: string | null;
  /** Cross-link to live site. */
  readonly liveUrl: string | null;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "paperplane",
    status: "early_access",
    statusLabel: "Early access",
    client: "PaperPlane (Built by UNFLECT)",
    sector: "Creator Economy · Marketplace",
    service: "web",
    title: "PaperPlane — Marketplace connecting creator channels with production talent",
    summary:
      "A web marketplace connecting YouTube and creator channels with video editors, thumbnail designers, scriptwriters, and motion artists.",
    problem:
      "Creator channels operating on strict weekly publishing schedules struggle to find reliable production talent who understand YouTube conventions. Scoping, negotiations, and asset handoffs typically scatter across social DMs without structured agreements, portfolios, or clear expectations.",
    challenge:
      "The platform needed to balance open talent discovery with creator security: providing publicly accessible freelancer profiles and gig listings while keeping application exchanges, private communications, and moderation within a controlled, authenticated environment.",
    solution:
      "UNFLECT built a responsive web marketplace. Creators can publish project gigs and review applications, while freelance editors and designers showcase verified portfolios, manage incoming inquiries, and communicate directly.",
    howItWorks: [
      "Freelancers build public profiles highlighting specific specialties (video editing, thumbnail design, script writing, sound design, motion graphics).",
      "Creators publish structured gigs with deliverables, timeline, and scope.",
      "Freelancers apply directly to open gigs through the platform.",
      "In-platform messaging keeps scoping discussions and negotiations in one place.",
      "Creators and talent can save and bookmark gigs for future cycles.",
      "Includes public reviews, user reporting, and legal compliance pages (terms, privacy, community guidelines, grievance redressal).",
    ],
    approachNotes: [
      "Built with a responsive front end integrated with Supabase Auth and Database.",
      "Implemented Row Level Security (RLS) policies to protect user accounts, private messages, and applications.",
      "Designed for low latency across mobile and desktop workflows without bulky client-side bundles.",
      "[CONFIRM: Exact front-end framework details, e.g. HTML/JS vs React, custom API details].",
    ],
    whereItStands: [
      "Currently in live early access at paperplane.buzz.",
      "Freelancer registration, gig posting, application workflows, and messaging are operational.",
      "[CONFIRM: Payment handling status — whether payments are handled on-platform or agreed directly].",
    ],
    whatWedDoDifferently: [
      "Plan deeper portfolio asset ingestion (direct YouTube video embed verification) as user base expands.",
      "Refine automated talent matching algorithms based on past completed gig categories.",
    ],
    outcome:
      "Early access; no outcome figures published yet. The platform is live and in active evaluation with early creators and freelance talent.",
    metrics: [],
    image: "/work/paperplane/hero.png",
    imagePlaceholderLabel: "PaperPlane web application live interface preview",
    screenshots: [
      {
        src: "/work/paperplane/hero.png",
        title: "Creator Marketplace Homepage",
        caption: "Main landing interface for creators and production talent showcasing live marketplace data.",
      },
      {
        src: "/work/paperplane/how-it-works.png",
        title: "How PaperPlane Works",
        caption: "Three-step workflow detailing brief submission, profile comparison, and project delivery.",
      },
      {
        src: "/work/paperplane/browse-freelancers.png",
        title: "Freelancer Discovery & Filtering",
        caption: "Searchable directory filtered by specialty, rate bands, and talent rating.",
      },
      {
        src: "/work/paperplane/signup-modal.png",
        title: "Account Registration & Onboarding",
        caption: "Role selection modal for creator/brand accounts vs freelance talent.",
      },
      {
        src: "/work/paperplane/about-contact.png",
        title: "About & Platform Guidelines",
        caption: "Platform mission statement, contact details, and compliance notice.",
      },
    ],
    tags: ["early-access", "marketplace", "creator-economy", "supabase", "web-application"],
    completedAt: "2026-03-01",
    liveUrl: "https://paperplane.buzz",
  },
  {
    slug: "dataforge",
    status: "sample_project",
    statusLabel: "Sample project",
    client: "Sample project (Built on public data)",
    sector: "Business Intelligence · Analytics",
    service: "systems",
    title: "DataForge — Data analytics consultancy platform with Power BI dashboards",
    summary:
      "A data analytics consultancy site featuring interactive Power BI dashboards for customer retention, sales performance, and financial reporting.",
    problem:
      "Growing companies frequently run operations across siloed spreadsheets and disconnected platforms. Commercial reviews stall because numbers disagree, and executive teams spend days compiling data rather than acting on it.",
    challenge:
      "Visualizations must serve concrete decisions rather than vanity graphics. The platform needed to demonstrate how raw operational data translates into governed semantic models and clear executive interventions.",
    solution:
      "Developed a modern web platform showcasing consultative analytics workflows and Power BI report models covering customer churn, B2B sales performance, and multi-entity financial consolidation.",
    howItWorks: [
      "Executive overview cards summarize high-level KPIs and risk metrics.",
      "Drill-down views enable deep diagnostic inspection by segment, region, or product.",
      "DAX calculations and Power Query transformations clean and align source data.",
      "Case study walkthroughs demonstrate how analytical findings lead to specific operational interventions.",
    ],
    approachNotes: [
      "Built using React and modern component styling, showcasing embedded Power BI report structures.",
      "Semantic models structured for auditability and consistent calculation definitions.",
      "Demonstrates consultancy methodologies for data preparation, modeling, and presentation.",
    ],
    whereItStands: [
      "Live sample project deployed at data-forge-liart.vercel.app.",
      "Demonstrates analytics capability using sample/public datasets.",
      "Figures on the demo site (e.g. churn account counts, cycle reductions) are illustrative sample data and not claimed as verified client outcomes.",
    ],
    whatWedDoDifferently: [
      "For a production enterprise deployment: integrate direct database connectors with automated scheduled refresh and organizational row-level security.",
    ],
    outcome:
      "Sample project built on public/sample data to demonstrate analytics architecture and dashboard design. Figures shown on demonstration dashboards reflect sample scenario data.",
    metrics: [],
    image: "/work/dataforge/hero.png",
    imagePlaceholderLabel: "DataForge analytics consultancy platform live interface preview",
    screenshots: [
      {
        src: "/work/dataforge/hero.png",
        title: "Featured Case Studies Showcase",
        caption: "Selected analytics engagements taken from raw source data through to executive decision-making.",
      },
      {
        src: "/work/dataforge/projects.png",
        title: "Projects & Sector Directory",
        caption: "Searchable directory filtered by sector (Telecommunications, B2B Distribution, Manufacturing).",
      },
      {
        src: "/work/dataforge/resources.png",
        title: "Resources & Deliverables Library",
        caption: "Executive presentation decks, Power BI dashboards, and analytical report downloads.",
      },
      {
        src: "/work/dataforge/about.png",
        title: "Mission & Engagement Process",
        caption: "Five-stage engagement process spanning Discovery, Data Collection, Analysis, Dashboard Development, and Recommendations.",
      },
      {
        src: "/work/dataforge/contact.png",
        title: "Consultation & Contact Portal",
        caption: "Project scoping form and direct contact interface for data analytics engagements.",
      },
    ],
    tags: ["sample-project", "power-bi", "business-intelligence", "dax", "analytics"],
    completedAt: "2026-02-01",
    liveUrl: "https://data-forge-liart.vercel.app/",
  },
  {
    slug: "preptwin",
    status: "coming_soon",
    statusLabel: "Coming soon",
    client: "UNFLECT (In development)",
    sector: "Software Product · In development",
    service: "web",
    title: "PrepTwin — Software product currently in development",
    summary:
      "Software project currently in development by UNFLECT. Technical documentation and release links will be published upon launch.",
    problem:
      "[CONFIRM: Specific business problem and target audience for PrepTwin].",
    challenge:
      "[CONFIRM: Technical and operational constraints for PrepTwin].",
    solution:
      "[CONFIRM: What UNFLECT is designing and building for PrepTwin].",
    howItWorks: [
      "[CONFIRM: Core workflow step 1]",
      "[CONFIRM: Core workflow step 2]",
      "[CONFIRM: Core workflow step 3]",
    ],
    approachNotes: [
      "[CONFIRM: Technical stack and architectural decisions for PrepTwin].",
    ],
    whereItStands: [
      "In active development.",
      "No public production link published yet.",
    ],
    whatWedDoDifferently: [
      "[CONFIRM: Development lessons or future roadmap upon release].",
    ],
    outcome:
      "In active development; documentation and release details pending public launch.",
    metrics: [],
    image: null,
    imagePlaceholderLabel:
      "PrepTwin preview (to be supplied upon public release)",
    tags: ["coming-soon", "in-development", "product"],
    completedAt: null,
    liveUrl: null,
  },
] as const;

export const publishedCaseStudies: readonly CaseStudy[] = caseStudies.filter(
  (study) => study.status !== "coming_soon",
);

export const hasPublishedWork = publishedCaseStudies.length > 0;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function toAnalyticsItem(study: CaseStudy) {
  return {
    service: study.service,
    status: study.status,
    sector: study.sector,
  };
}
