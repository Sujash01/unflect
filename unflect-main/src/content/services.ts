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
      "We design and build custom web software around a clear commercial and operational purpose.",
    whoItsFor: [
      "Businesses needing customer-facing platforms with functional utility beyond a brochure.",
      "Teams launching SaaS products, member platforms, or digital client tools.",
      "Companies whose users need self-service account changes without calling or emailing.",
    ],
    whenToChoose:
      "When your customers or public users need a fast, reliable web interface to interact with your business.",
    capabilities: [
      "Customer portals and web applications with authenticated self-service access",
      "E-commerce platforms with tailored checkout and catalogue workflows",
      "SaaS products and subscription platforms built for recurring operational use",
      "Responsive, accessible frontends with maintainable content models",
    ],
    problems: [
      "Current website cannot support how the business actually sells",
      "Customers phone or email for tasks software should handle directly",
      "Platform was built as a static brochure rather than a functional application",
      "Poor mobile performance and accessibility block real customer usage",
    ],
    outcomes: [
      "Customers complete account and transactional tasks directly online",
      "Teams update content, pricing, and structure without developer intervention",
      "Fast, accessible codebase that remains maintainable after handover",
    ],
    examples: [
      {
        title: "E-commerce platform",
        detail:
          "Catalogue, checkout, and order management tailored to your operational reality.",
      },
      {
        title: "Customer portal",
        detail:
          "Self-service account management, document exchange, and request tracking in one place.",
      },
      {
        title: "Business web application",
        detail:
          "Custom web software replacing spreadsheet-and-email workflows that no longer scale.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "Map user journeys, commercial objectives, and technical constraints before design begins.",
      },
      {
        stage: "02 Define",
        summary:
          "Specify page architecture, authentication models, checkout states, and acceptance criteria.",
      },
      {
        stage: "03 Build",
        summary:
          "Develop accessible, responsive components in demonstrable increments with regular reviews.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Launch to your cloud infrastructure with verified DNS, SSL, and performance checks.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Tune performance, apply security patches, and iterate based on real usage.",
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
      "We build custom internal tools and management platforms that replace fragmented, spreadsheet-driven operations.",
    whoItsFor: [
      "Operations teams running core workflows across fragile, unversioned spreadsheets.",
      "Businesses re-entering the same operational records across disconnected tools.",
      "Leadership teams lacking live visibility because reporting requires manual compilation.",
    ],
    whenToChoose:
      "When internal operations are constrained by spreadsheets, duplicate entry, or lack of role permissions.",
    capabilities: [
      "Internal tools and dashboards connected directly to live operational data",
      "Workflow systems for approvals, scheduling, inventory, and status tracking",
      "Role-based access control (RBAC) with detailed audit logging",
      "Data migration pipelines from legacy spreadsheets and databases",
    ],
    problems: [
      "Core operations depend on spreadsheets nobody fully trusts",
      "Staff duplicate manual data entry across multiple disconnected tools",
      "Management decisions rely on reports that are days out of date",
      "Lack of role-based permissions creates operational and compliance risk",
    ],
    outcomes: [
      "Manual friction removed from your highest-cost operational workflows",
      "A single source of truth for all operational records",
      "Decisions based on real-time data instead of stale spreadsheets",
      "Clear role permissions and audit history across all sensitive records",
    ],
    examples: [
      {
        title: "Operations dashboard",
        detail:
          "Live visibility across core operational metrics assembled from existing systems.",
      },
      {
        title: "Management system",
        detail:
          "Approvals, allocation, and tracking replacing email-and-spreadsheet handoffs.",
      },
      {
        title: "Admin platform",
        detail:
          "A secure back office to manage users, records, and system configuration.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "Shadow team workflows to pinpoint bottlenecks, data leakage, and shadow spreadsheets.",
      },
      {
        stage: "02 Define",
        summary:
          "Specify database schemas, role permissions, approval flows, and migration rules.",
      },
      {
        stage: "03 Build",
        summary:
          "Construct high-speed internal tools with strict data validation and automated tests.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Execute data migrations, verify staging backups, and conduct operational handover.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Tune database queries and adapt workflows as transaction volume grows.",
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
      "We connect your existing business tools so data synchronises automatically without manual copy-paste.",
    whoItsFor: [
      "Businesses paying for good tools that cannot talk to each other.",
      "Teams spending hours weekly manually exporting and re-importing CSV files.",
      "Companies whose billing, inventory, or customer status records fall out of sync.",
    ],
    whenToChoose:
      "When your existing software works well, but requires manual effort to keep records consistent.",
    capabilities: [
      "Custom REST APIs and webhook connectors between your systems",
      "Automated CRM and ERP data synchronisation with conflict resolution",
      "Payment gateway and billing integrations with automated reconciliation",
      "Resilient data pipelines with retry logic, alerting, and error monitoring",
    ],
    problems: [
      "Teams re-enter the same customer or order information in multiple places",
      "Payment, billing, and inventory records drift out of sync between platforms",
      "Silent API failures break background processes without alerting anyone",
      "Staff waste hours each week exporting, cleaning, and re-uploading spreadsheets",
    ],
    outcomes: [
      "Data entered once and automatically synchronised across all platforms",
      "Elimination of transcription errors and manual reconciliation tasks",
      "Failures surface immediately through active monitoring rather than silent breaks",
    ],
    examples: [
      {
        title: "Payment integration",
        detail:
          "Checkout and subscription handling wired directly into your operational systems.",
      },
      {
        title: "CRM synchronisation",
        detail:
          "Customer and deal data kept automatically consistent across sales and operations.",
      },
      {
        title: "Data pipelines",
        detail:
          "Automated event-driven sync between core systems with clear conflict rules.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "Audit vendor APIs, payload formats, authentication methods, and data drift points.",
      },
      {
        stage: "02 Define",
        summary:
          "Define schema mappings, source-of-truth priority, and retry error handling.",
      },
      {
        stage: "03 Build",
        summary:
          "Develop idempotent webhook handlers, secure background workers, and monitoring services.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Test in sandboxes, execute controlled cutovers, and activate real-time alerting.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Manage API version updates and maintain uninterrupted cross-platform data flow.",
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
      "When customers or public users need a fast, direct interface to interact with your business.",
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
      "When internal operations are constrained by spreadsheets, duplicate entry, or lack of role permissions.",
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
      "When existing software tools work well individually, but cannot share data automatically.",
    typicalDeliverables: [
      "Automated CRM & ERP synchronisation",
      "Payment gateway & billing connections",
      "Custom REST APIs & webhook listeners",
      "Reliable retry & error monitoring pipelines",
    ],
    contactHref: "/contact?type=integrations",
  },
] as const;
