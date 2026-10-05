/**
 * Case study data model.
 *
 * IMPORTANT \u2014 READ BEFORE EDITING
 * ---------------------------------
 * The repository contained no project data or client assets at build time, so
 * every entry below is a PLACEHOLDER describing a problem archetype. Per the
 * project rules, no clients, testimonials, metrics, results or endorsements
 * have been invented.
 *
 * Each record carries `status`:
 *   - "placeholder" \u2014 illustrative structure only. Rendered with a visible
 *     "Illustrative example" label and no outcome claims. MUST be replaced
 *     before launch.
 *   - "published"    \u2014 real, approved project data with verifiable outcomes.
 *
 * To publish a real case study:
 *   1. Set `status: "published"`.
 *   2. Replace `client` with the approved client name (or keep null for
 *      anonymised work) and `summary` with the real one-line description.
 *   3. Fill `challenge`, `solution`, `howItWorks`, `stackNotes` and `outcome`
 *      from the project's Definition of Done \u2014 not from memory.
 *   4. Put only figures the client has approved for publication in `metrics`.
 *   5. Drop approved imagery into /public/work/<slug>/ and reference it in
 *      `image`.
 */

export type CaseStudyStatus = "placeholder" | "published";

export type CaseStudy = {
  slug: string;
  status: CaseStudyStatus;
  /** Approved client name, or null for anonymised work. */
  client: string | null;
  /** Short anonymised descriptor, e.g. "Manufacturing \u00b7 Operations". */
  sector: string;
  /** Which of the three service categories this project sits under. */
  service: "web" | "systems" | "integrations";
  title: string;
  /** One line. What was built and why. */
  summary: string;
  /** The business problem, in the client's terms. */
  problem: string;
  /** Why the obvious answer was not available or sufficient. */
  challenge: string;
  /** What UNFLECT built. */
  solution: string;
  /** How it works, explained without jargon. */
  howItWorks: readonly string[];
  /** Notable technical decisions. Never a technology list. */
  approachNotes: readonly string[];
  /** Verified outcome. Placeholder records state the shape, not the result. */
  outcome: string;
  /**
   * Verified, client-approved figures only. Empty for placeholders \u2014 no
   * invented statistics.
   */
  metrics: readonly { label: string; value: string }[];
  /** Optional image path under /public. */
  image: string | null;
  /** Suggested internal tags for filtering later. */
  tags: readonly string[];
  /** ISO date the project reached production. Null when unknown. */
  completedAt: string | null;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "operational-consolidation",
    status: "placeholder",
    client: null,
    sector: "Operations \u00b7 PLACEHOLDER",
    service: "systems",
    title: "Placeholder \u2014 Consolidating operations across scattered systems",
    summary:
      "Structure for a case study about replacing spreadsheet-driven operations with a single internal system.",
    problem:
      "Operational work is spread across spreadsheets, inboxes and legacy tools. The same information is entered more than once, nobody trusts the numbers, and reporting is a manual exercise every month.",
    challenge:
      "Off-the-shelf tools were built for a different business model. Migrating wholesale would have meant changing how the team works during the busiest period of the year \u2014 so the replacement needed to meet the existing process where it worked, and change it only where the process was the problem.",
    solution:
      "A single internal system of record for the affected workflows, with role-based access, a reporting dashboard built on live data, and a staged migration path so nothing went live before it was ready.",
    howItWorks: [
      "Staff work from one application instead of several spreadsheets and email threads.",
      "Each record has a single owner and a visible status, so nothing is duplicated or lost.",
      "Reporting reads from operational data directly instead of being compiled by hand.",
      "Access is granted by role and reviewed, rather than being shared accounts.",
      "Migration ran in stages so the business kept operating throughout.",
    ],
    approachNotes: [
      "Existing data was migrated rather than re-entered.",
      "Access model was designed around actual job roles before implementation.",
      "Reporting was built on the same data as the operational workflows to prevent divergence.",
    ],
    outcome:
      "PLACEHOLDER \u2014 Replace with the verified outcome recorded at project handover, agreed with the client. Do not publish figures that cannot be evidenced.",
    metrics: [],
    image: null,
    tags: ["placeholder", "internal-tools", "operations", "systems"],
    completedAt: null,
  },
  {
    slug: "commerce-platform",
    status: "placeholder",
    client: null,
    sector: "Commerce \u00b7 PLACEHOLDER",
    service: "web",
    title: "Placeholder \u2014 Replacing a limited commerce platform with a purpose-built storefront",
    summary:
      "Structure for a case study about rebuilding e-commerce around a product range the existing platform could not support.",
    problem:
      "The current storefront cannot represent how products are actually priced, bundled or sold. Customers cannot complete their order without contacting the team, and staff absorb the gap manually.",
    challenge:
      "The constraint was commercial as much as technical: the business needed to keep selling through the transition, and payment behaviour, tax and fulfilment rules could not be left to assumption.",
    solution:
      "A storefront designed around the real catalogue and buying journey, with checkout and payment handling, plus a small back office so the team can manage products, stock and orders without engineering help.",
    howItWorks: [
      "The catalogue reflects how products are genuinely configured, not a flattened list.",
      "Customers complete purchase without contacting the team.",
      "Payments, orders and stock stay synchronised with the systems that fulfil them.",
      "The team manages products and orders through a controlled interface.",
    ],
    approachNotes: [
      "Buying journey was defined from real customer behaviour, not a generic template.",
      "Payment and order handling were treated as part of the scope, not an afterthought.",
      "Launch was staged behind a domain cutover so the previous store stayed available until the new one was verified.",
    ],
    outcome:
      "PLACEHOLDER \u2014 Replace with the verified commercial and operational outcome recorded at handover, agreed with the client.",
    metrics: [],
    image: null,
    tags: ["placeholder", "e-commerce", "web-application", "web"],
    completedAt: null,
  },
  {
    slug: "systems-integration",
    status: "placeholder",
    client: null,
    sector: "Cross-platform \u00b7 PLACEHOLDER",
    service: "integrations",
    title: "Placeholder \u2014 Removing manual data entry between systems",
    summary:
      "Structure for a case study about connecting existing software so information stops being rekeyed by hand.",
    problem:
      "Customer, order and payment data lives in separate systems that do not communicate. The same records are copied between them by hand, so they drift apart and reconciliation becomes an argument.",
    challenge:
      "The integrations had to be reliable rather than merely working. A failure that happened silently was worse than the manual process it replaced, so error handling and visibility mattered as much as the connection itself.",
    solution:
      "Documented APIs and scheduled synchronisation between the existing systems, with explicit rules for what wins on conflict, and monitoring so failed transfers surface instead of disappearing.",
    howItWorks: [
      "Information is entered once and flows to every system that needs it.",
      "Synchronisation rules are documented, including how conflicts are resolved.",
      "Failed transfers are logged and surfaced rather than silently skipped.",
      "Reconciliation effort reduces because both systems start from the same data.",
    ],
    approachNotes: [
      "Conflict resolution was defined before writing the integration, since it is a business decision, not a technical one.",
      "Every connection was given explicit failure and retry behaviour.",
      "Third-party services were selected against the actual business requirement, not the reverse.",
    ],
    outcome:
      "PLACEHOLDER \u2014 Replace with the verified reduction in manual work and error rate, agreed with the client.",
    metrics: [],
    image: null,
    tags: ["placeholder", "api", "data-sync", "integrations"],
    completedAt: null,
  },
];

/** Only records safe to present as completed client work. */
export const publishedCaseStudies: readonly CaseStudy[] = caseStudies.filter(
  (study) => study.status === "published",
);

export const hasPublishedWork = publishedCaseStudies.length > 0;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/**
 * Shown prominently on /work while all records are placeholders, so the site
 * never implies a track record it does not have.
 */
export const workPlaceholderNotice =
  "Placeholder content. The structure below shows how we document a project. These are not client engagements, and no results are claimed. Selected real work will be published here with client-approved detail.";

/**
 * Builds a Google Event / GA4-shaped payload so the site can be wired to a
 * provider later without changing component code. See src/lib/analytics.ts.
 */
export function toAnalyticsItem(study: CaseStudy) {
  return {
    service: study.service,
    status: study.status,
    sector: study.sector,
  };
}
