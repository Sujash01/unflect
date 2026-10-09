/**
 * The three primary service categories.
 *
 * Presented as one coherent software offering, not three separate agencies.
 * Each entry renders both a summary (cards, homepage) and a full detail page.
 */

export type ServiceSlug = "web" | "systems" | "integrations";

export type ServiceProcessStage = {
  readonly stage: string;
  readonly summary: string;
};

export type Service = {
  slug: ServiceSlug;
  index: string;
  name: string;
  /** One-line definition. Answers "what is this?" in under ten words. */
  summary: string;
  /** The business-level promise. No jargon. */
  promise: string;
  /** Longer positioning paragraph for detail pages. */
  intro: string;
  /** Who this service is specifically designed for. */
  whoItsFor: readonly string[];
  /** When to choose this discipline over the others. */
  whenToChoose: string;
  /** Bullet list of deliverables / what gets built. */
  capabilities: readonly string[];
  /** Typical business problems this service addresses. */
  problems: readonly string[];
  /** What a business ends up able to do. */
  outcomes: readonly string[];
  /** Representative engagement shapes (clearly labeled as examples, not past clients). */
  examples: readonly { title: string; detail: string }[];
  /** How this discipline maps to the 5-stage delivery model. */
  processStages: readonly ServiceProcessStage[];
  /** Cross-links to the other services. */
  related: readonly { label: string; href: string }[];
  contactQueryType: string;
  seo: { title: string; description: string };
};

export const services = [
  {
    slug: "web",
    index: "01",
    name: "Web",
    summary:
      "Custom web applications, customer portals and commerce platforms built for a clear operational purpose.",
    promise:
      "A web product that does a specific job for your customers, and does it well.",
    intro:
      "Most businesses need a web presence that does more than describe them. It needs to sell, to serve, to manage, or to operate. We design and build web software around one of those jobs — rather than around a template or a feature list.",
    whoItsFor: [
      "Businesses needing customer-facing software with real functional utility — not a static brochure.",
      "Founders and operational teams launching SaaS products, digital client tools, or member platforms.",
      "Companies whose customers currently have to phone or email for basic account changes and updates.",
      "Commercial brands whose sales model has outgrown standard off-the-shelf templates and plug-ins.",
    ],
    whenToChoose:
      "Choose Web when the primary challenge is user-facing: your customers or public users need a fast, reliable web application, portal, or commerce interface to interact with your business.",
    capabilities: [
      "Business websites built to a clear commercial purpose",
      "E-commerce platforms with the checkout and catalogue behaviour your customers expect",
      "Customer portals with authenticated, self-service access",
      "Web applications for operational and team workflows",
      "SaaS products and subscription platforms",
      "Responsive layouts designed for mobile first, not shrunk from desktop",
      "Content models your team can actually maintain",
    ],
    problems: [
      "The website looks credible but does not convert or cannot be edited",
      "The current platform cannot support how the business actually sells",
      "Customers have to phone or email for things the product should handle",
      "The site has to become an application, but it was built as a brochure",
      "Performance and accessibility are blocking real usage on mobile",
    ],
    outcomes: [
      "A web presence that works as a business tool, not a decoration",
      "Customers and users can complete their task without calling you",
      "Your team can update content, pricing and structure without a developer",
      "A codebase that is fast, accessible and maintainable after handover",
    ],
    examples: [
      {
        title: "E-commerce platform",
        detail:
          "Catalogue, search, checkout, payments and order management built around your products and your operational reality.",
      },
      {
        title: "Customer portal",
        detail:
          "Authenticated access where customers view their account, documents, requests and history in one place.",
      },
      {
        title: "Business web application",
        detail:
          "A web application replacing a spreadsheet-and-email process that no longer scales with the team.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We map user journeys, commercial requirements, performance targets, and mobile constraints before designing any interface.",
      },
      {
        stage: "02 Define",
        summary:
          "We specify page architecture, authentication models, checkout states, and acceptance criteria.",
      },
      {
        stage: "03 Build",
        summary:
          "We develop responsive, accessible components in demonstrable increments with regular client review.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Production launch to client cloud infrastructure with full DNS, SSL, and performance verification.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Performance tuning, security patch updates, and feature iteration based on real user interactions.",
      },
    ],
    related: [
      { label: "Systems", href: "/services/systems" },
      { label: "Integrations", href: "/services/integrations" },
    ],
    contactQueryType: "web",
    seo: {
      title: "Web Software",
      description:
        "Custom web software built around a business purpose: e-commerce platforms, customer portals, web applications and SaaS products. Designed, built, deployed and supported.",
    },
  },
  {
    slug: "systems",
    index: "02",
    name: "Systems",
    summary:
      "Internal dashboards, operations management systems and admin platforms that replace fragile spreadsheets.",
    promise:
      "Internal software that removes the manual work your business has outgrown.",
    intro:
      "Most operational friction is not a people problem. It is a tooling problem — work split across spreadsheets, inboxes and systems that were never designed to talk to each other. We build the internal software that replaces that friction.",
    whoItsFor: [
      "Operations teams running core workflows across fragile, unversioned spreadsheets.",
      "Businesses where staff re-enter the same operational data across multiple disconnected tools.",
      "Leadership teams lacking live visibility because reporting requires hours of manual aggregation.",
      "Companies handling sensitive client or operational records without clear audit trails or role permissions.",
    ],
    whenToChoose:
      "Choose Systems when the primary challenge is internal: your team's day-to-day operations are slowed down by manual workarounds, spreadsheets, or off-the-shelf software that doesn't fit your workflow.",
    capabilities: [
      "Internal business tools for recurring operational work",
      "Dashboards that report from real data, not manual entry",
      "Admin platforms for managing users, content and configuration",
      "Management systems for workflows, approvals, stock, scheduling or case handling",
      "Role-based access control and audit trails",
      "Data migration from existing spreadsheets and legacy tools",
      "Documentation and handover so your team owns what we build",
    ],
    problems: [
      "Core operations run on spreadsheets nobody fully trusts",
      "Staff repeat the same manual data entry across multiple systems",
      "Managers make decisions from information that is days out of date",
      "Existing software was bought for a different business and does not fit",
      "Permissions and visibility are unclear, which creates risk",
    ],
    outcomes: [
      "Manual steps removed from the processes that cost you the most time",
      "One place where operational data lives, with a clear owner",
      "Decisions made on current information rather than remembered information",
      "Access control and audit history appropriate to the sensitivity of the data",
    ],
    examples: [
      {
        title: "Operations dashboard",
        detail:
          "Live visibility across the metrics that drive the business, assembled from the systems you already run.",
      },
      {
        title: "Management system",
        detail:
          "Approvals, allocation, status tracking and reporting for a workflow currently handled over email.",
      },
      {
        title: "Admin platform",
        detail:
          "A controlled back office for the users, records and configuration behind your customer-facing product.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We shadow the operational workflow to uncover true bottlenecks, shadow spreadsheets, and failure points.",
      },
      {
        stage: "02 Define",
        summary:
          "We specify relational data schemas, role permissions (RBAC), approval states, and migration rules.",
      },
      {
        stage: "03 Build",
        summary:
          "We construct internal tools and dashboards prioritising speed, validation, and zero data loss.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Production data migration, backup verification, staging checks, and operational handover.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Query tuning, workflow adjustments as transaction volume grows, and scheduled operational upkeep.",
      },
    ],
    related: [
      { label: "Web", href: "/services/web" },
      { label: "Integrations", href: "/services/integrations" },
    ],
    contactQueryType: "systems",
    seo: {
      title: "Business Systems Software",
      description:
        "Internal software that helps businesses operate: operational tools, dashboards, admin platforms and custom management systems. Built around your actual workflows.",
    },
  },
  {
    slug: "integrations",
    index: "03",
    name: "Integrations",
    summary:
      "APIs, CRM/ERP synchronisation, payment connections and automated data pipelines.",
    promise:
      "Your systems talking to each other, reliably, without anyone copying data by hand.",
    intro:
      "You already run on software that works. The problem is that those systems do not talk to each other — so people do. Integration work removes the manual bridge between the tools you rely on, and makes each one more useful.",
    whoItsFor: [
      "Businesses that already pay for good software (CRMs, ERPs, accounting tools) that cannot talk to each other.",
      "Teams spending hours weekly manually exporting and re-importing CSV files between systems.",
      "Companies whose billing, inventory, or customer status records frequently drift out of sync.",
      "Organizations with mission-critical webhooks or APIs that fail silently without alerting.",
    ],
    whenToChoose:
      "Choose Integrations when you already have software that works, but your tools are isolated and require manual human effort to keep data consistent.",
    capabilities: [
      "APIs and webhooks between your systems and ours",
      "Payment system integration — checkout, subscriptions, reconciliation",
      "CRM integration so sales and operations work from the same record",
      "Third-party service connectivity for the tools you already pay for",
      "Data synchronisation with clear rules for what wins on conflict",
      "Migration of data between systems",
      "Error handling, retry behaviour and monitoring for every connection",
    ],
    problems: [
      "The same information is entered in more than one place",
      "Payments, stock or customer records drift out of step between systems",
      "The team exports data manually to make two tools talk",
      "A vendor API changed and the internal process quietly stopped working",
      "Nobody trusts the numbers because the sources disagree",
    ],
    outcomes: [
      "Data entered once and used everywhere it is needed",
      "Fewer transcription errors and fewer reconciliation arguments",
      "Each system becomes more useful because it no longer works in isolation",
      "Connection failures surface visibly instead of failing silently",
    ],
    examples: [
      {
        title: "Payment integration",
        detail:
          "Checkout and subscription handling wired into your own systems, with clear records of every transaction.",
      },
      {
        title: "CRM synchronisation",
        detail:
          "Customer and order data kept consistent between your CRM and your operational software.",
      },
      {
        title: "Data synchronisation",
        detail:
          "Scheduled and event-driven movement of data between systems, with documented rules and error handling.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We catalog vendor APIs, rate limits, payload formats, authentication mechanisms, and data drift points.",
      },
      {
        stage: "02 Define",
        summary:
          "We define schema mappings, conflict resolution rules (source-of-truth priority), and failure retry behaviors.",
      },
      {
        stage: "03 Build",
        summary:
          "We build secure integration services, idempotent webhook listeners, queue workers, and error monitoring.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Sandbox testing, controlled production cutover, reconciliation validation, and logging activation.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Vendor API version updates, payload migration handling, and continuous connectivity health monitoring.",
      },
    ],
    related: [
      { label: "Web", href: "/services/web" },
      { label: "Systems", href: "/services/systems" },
    ],
    contactQueryType: "integrations",
    seo: {
      title: "Systems Integration",
      description:
        "Connect the software your business already depends on: APIs, payments, CRM and third-party integrations, plus data synchronisation with proper error handling.",
    },
  },
] as const satisfies readonly Service[];

export const servicesBySlug: Record<ServiceSlug, Service> = {
  web: services[0],
  systems: services[1],
  integrations: services[2],
};

export function getService(slug: string): Service | undefined {
  return servicesBySlug[slug as ServiceSlug];
}

export const servicesComparison = [
  {
    slug: "web" as const,
    index: "01",
    name: "Web",
    summary: "Customer-facing web applications, portals, and commerce platforms.",
    bestFor: "Customer interaction, transactions, client self-service, SaaS products.",
    whenToChoose:
      "When the user is external (customer, client, or member) and needs a fast, direct interface to interact with your business.",
    typicalDeliverables: [
      "Custom web applications & SaaS",
      "Customer self-service portals",
      "Bespoke e-commerce & checkouts",
      "Accessible, mobile-first frontends",
    ],
    contactHref: "/contact?type=web",
  },
  {
    slug: "systems" as const,
    index: "02",
    name: "Systems",
    summary: "Internal dashboards, operations systems, and admin platforms.",
    bestFor: "Operational back-office, team workflows, replacing manual spreadsheets.",
    whenToChoose:
      "When internal operations are constrained by spreadsheets, duplicate manual entry, or lack of role-based permissions.",
    typicalDeliverables: [
      "Live operational dashboards",
      "Workflow & approval management tools",
      "Role-based admin portals (RBAC)",
      "Automated spreadsheet migrations",
    ],
    contactHref: "/contact?type=systems",
  },
  {
    slug: "integrations" as const,
    index: "03",
    name: "Integrations",
    summary: "APIs, CRM/ERP synchronisation, payment connections, and data pipelines.",
    bestFor: "Connecting distinct software tools so data syncs without human copying.",
    whenToChoose:
      "When your existing software tools work well individually, but cannot communicate or stay in sync automatically.",
    typicalDeliverables: [
      "Automated CRM & ERP synchronisation",
      "Payment gateway & billing connections",
      "Custom REST APIs & webhook listeners",
      "Reliable retry & error monitoring pipelines",
    ],
    contactHref: "/contact?type=integrations",
  },
] as const;
