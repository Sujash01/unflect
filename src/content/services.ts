/**
 * The three primary service categories.
 *
 * Presented as one coherent software offering, not three separate agencies.
 * Each entry renders both a summary (cards, homepage) and a full detail page.
 */

export type ServiceSlug = "web" | "systems" | "integrations";

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
  /** Bullet list of deliverables / what gets built. */
  capabilities: readonly string[];
  /** Typical business problems this service addresses. */
  problems: readonly string[];
  /** What a business ends up able to do. */
  outcomes: readonly string[];
  /** Representative engagement shapes. Not a technology list. */
  examples: readonly { title: string; detail: string }[];
  /** Cross-links to the other services. */
  related: readonly { label: string; href: string }[];
  seo: { title: string; description: string };
};

export const services = [
  {
    slug: "web",
    index: "01",
    name: "Web",
    summary: "Software experiences delivered through the web.",
    promise:
      "A web product that does a specific job for your customers, and does it well.",
    intro:
      "Most businesses need a web presence that does more than describe them. It needs to sell, to serve, to manage, or to operate. We design and build web software around one of those jobs \u2014 rather than around a template or a feature list.",
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
    related: [
      { label: "Systems", href: "/services/systems" },
      { label: "Integrations", href: "/services/integrations" },
    ],
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
    summary: "Software that helps businesses operate.",
    promise:
      "Internal software that removes the manual work your business has outgrown.",
    intro:
      "Most operational friction is not a people problem. It is a tooling problem \u2014 work split across spreadsheets, inboxes and systems that were never designed to talk to each other. We build the internal software that replaces that friction.",
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
    related: [
      { label: "Web", href: "/services/web" },
      { label: "Integrations", href: "/services/integrations" },
    ],
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
    summary: "Connecting the systems your business already depends on.",
    promise:
      "Your systems talking to each other, reliably, without anyone copying data by hand.",
    intro:
      "You already run on software that works. The problem is that those systems do not talk to each other \u2014 so people do. Integration work removes the manual bridge between the tools you rely on, and makes each one more useful.",
    capabilities: [
      "APIs and webhooks between your systems and ours",
      "Payment system integration \u2014 checkout, subscriptions, reconciliation",
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
    related: [
      { label: "Web", href: "/services/web" },
      { label: "Systems", href: "/services/systems" },
    ],
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
