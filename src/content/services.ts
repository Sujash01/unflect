/**
 * The core business automation and systems integration service categories.
 *
 * Presented as one coherent engineering offering:
 * 1. Business Automation
 * 2. WhatsApp Automation
 * 3. Systems Integration
 * 4. AI-Powered Workflows
 *
 * Secondary software development services (websites, portals, dashboards)
 * are grouped under Other Services (/services/other-services).
 */

export type ServiceSlug =
  | "business-automation"
  | "whatsapp-automation"
  | "systems-integration"
  | "ai-workflows";

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
    slug: "business-automation",
    index: "01",
    name: "Business Automation",
    summary:
      "Automated operations, lead workflows, notifications, approvals and scheduled reporting.",
    promise:
      "Remove repetitive manual tasks from operations so your team can focus on growth.",
    intro:
      "Most operational friction comes from routine, repetitive tasks that consume hours every week: re-entering lead data, routing approvals through inboxes, sending status notifications, and compiling reports by hand. We design and build business automations that execute these workflows reliably in the background.",
    whoItsFor: [
      "Operations teams bogged down by repetitive manual data entry, status updates, and copy-paste routines.",
      "Growing businesses needing reliable lead management, enquiry routing, and notification workflows.",
      "Teams spending hours weekly compiling recurring operational reports from spreadsheets and separate platforms.",
      "Organizations where approval workflows stall because requests sit in personal email inboxes.",
    ],
    whenToChoose:
      "Choose Business Automation when routine operational tasks, manual lead handling, or repetitive administrative processes are slowing down your team and creating operational bottlenecks.",
    capabilities: [
      "Automated lead intake, validation, and CRM distribution",
      "Multi-step approval pipelines and escalation notifications",
      "Automated operational data entry and record creation",
      "Scheduled reporting, document generation, and email summaries",
      "Trigger-based alerts for exceptions, deadlines, and status changes",
      "Error handling, retry logic, and monitoring for every workflow",
      "Full documentation and handover so your team owns the system",
    ],
    problems: [
      "Staff spend hours daily on repetitive, manual copy-pasting across tools",
      "Leads and customer inquiries sit unaddressed because routing is manual",
      "Operational approvals stall when people miss emails or forget to follow up",
      "Reporting requires manual data compilation that is days out of date",
      "Human error and missed steps create compliance or operational risk",
    ],
    outcomes: [
      "Hours of manual effort saved every week across the operations team",
      "Consistent, fast response times for new inquiries and internal requests",
      "Transparent, auditable workflows where nothing falls through the cracks",
      "Automations that run 24/7 without requiring manual human oversight",
    ],
    examples: [
      {
        title: "Lead management automation",
        detail:
          "Capture, qualify, validate, and route inbound customer enquiries directly into your CRM with instant team notifications.",
      },
      {
        title: "Approval & notification pipeline",
        detail:
          "Structured multi-stage approval workflow replacing email chains with automatic status tracking and escalation alerts.",
      },
      {
        title: "Operational data entry automation",
        detail:
          "Automated extraction and sync of operational records across databases, spreadsheets, and accounting tools.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We audit your repetitive operational tasks, manual handoffs, and data flows to identify highest-impact automation points.",
      },
      {
        stage: "02 Define",
        summary:
          "We map out logic rules, trigger conditions, fallback procedures, exception alerts, and system boundaries.",
      },
      {
        stage: "03 Build",
        summary:
          "We build and test resilient workflow automations with automated retry policies, validation, and audit logging.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Controlled staging rollout, live data verification, security checks, and operational team handover.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Monitoring execution metrics, error rates, and expanding automation scope as business volume increases.",
      },
    ],
    related: [
      { label: "WhatsApp Automation", href: "/services/whatsapp-automation" },
      { label: "Systems Integration", href: "/services/systems-integration" },
      { label: "AI-Powered Workflows", href: "/services/ai-workflows" },
      { label: "Other Services", href: "/services/other-services" },
    ],
    contactQueryType: "automation",
    seo: {
      title: "Business Automation Services & Workflow Automation",
      description:
        "Business automation services by UNFLECT: streamline repetitive operations, lead management, approval pipelines, data entry, and scheduled reporting.",
    },
  },
  {
    slug: "whatsapp-automation",
    index: "02",
    name: "WhatsApp Automation",
    summary:
      "Customer enquiry triage, appointment booking workflows, confirmations and reminders on WhatsApp.",
    promise:
      "Reliable conversational workflows that handle routine enquiries and bookings without manual coordination.",
    intro:
      "WhatsApp is where your customers already communicate. We build structured WhatsApp business automations that handle inbound customer enquiries, qualification, appointment booking, rescheduling, and reminder sequences — connected directly to your existing CRM, calendars, and backend software. WhatsApp is implemented as one powerful communication channel within your broader systems architecture.",
    whoItsFor: [
      "Service businesses and consultancies receiving high volumes of repetitive inquiries over WhatsApp.",
      "Teams losing bookings or revenue due to delayed responses to inbound customer messages.",
      "Companies needing automated appointment scheduling, instant confirmations, and timely reminder sequences.",
      "Businesses wanting to connect WhatsApp interactions directly to their existing CRM or scheduling calendar.",
    ],
    whenToChoose:
      "Choose WhatsApp Automation when customer communication, appointment booking, or enquiry triage is a primary touchpoint and manual messaging is creating delays, missed opportunities, or customer drop-off.",
    capabilities: [
      "Automated customer enquiry triage, FAQs, and service information",
      "End-to-end appointment scheduling, rescheduling, and cancellations",
      "Automated appointment reminders and confirmation sequences",
      "Two-way integration with Google Calendar, Calendly, CRMs, and databases",
      "Intelligent escalation to human team members when specialized assistance is needed",
      "Official WhatsApp Business API setup and compliant template messaging",
      "Event tracking for delivery, read rates, and completion conversions",
    ],
    problems: [
      "Customers wait hours for a reply to basic questions about services, hours, or availability",
      "Manual back-and-forth messaging to find an open calendar slot frustrates clients",
      "No-shows and late cancellations impact revenue because reminders are sent manually or forgotten",
      "Inquiry details discussed on WhatsApp never make it into the company's central CRM",
      "Staff spend half their workday answering the same ten repetitive customer questions",
    ],
    outcomes: [
      "Instant response to customer enquiries 24 hours a day, 7 days a week",
      "Frictionless self-service booking that updates calendars and CRM records automatically",
      "Significantly reduced appointment no-shows via automated reminder sequences",
      "Team focuses only on high-value conversations while routine queries are automated",
    ],
    examples: [
      {
        title: "Automated appointment booking",
        detail:
          "Interactive calendar selection, slot verification, booking confirmation, and calendar sync entirely within WhatsApp.",
      },
      {
        title: "Customer enquiry triage",
        detail:
          "Automated routing of incoming enquiries based on service interest, collecting key details before handing off to team.",
      },
      {
        title: "Automated reminder sequence",
        detail:
          "Timely WhatsApp reminders with one-tap confirmation or rescheduling links to protect booked revenue.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We review customer messaging journeys, common enquiry patterns, calendar workflows, and integration requirements.",
      },
      {
        stage: "02 Define",
        summary:
          "We map conversational flows, fallback routes, human escalation triggers, and approved message templates.",
      },
      {
        stage: "03 Build",
        summary:
          "We configure the WhatsApp Business API, build webhook handlers, and connect your CRM and calendar systems.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Sandbox testing, template approvals, compliance checks, and live cutover with active monitoring.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Message response optimization, flow refinements based on user interactions, and expanded workflow capabilities.",
      },
    ],
    related: [
      { label: "Business Automation", href: "/services/business-automation" },
      { label: "Systems Integration", href: "/services/systems-integration" },
      { label: "AI-Powered Workflows", href: "/services/ai-workflows" },
      { label: "Other Services", href: "/services/other-services" },
    ],
    contactQueryType: "whatsapp",
    seo: {
      title: "WhatsApp Business Automation & Appointment Booking Workflows",
      description:
        "WhatsApp business automation services by UNFLECT: automated customer enquiry routing, appointment scheduling workflows, reminder sequences, and CRM integrations.",
    },
  },
  {
    slug: "systems-integration",
    index: "03",
    name: "Systems Integration",
    summary:
      "APIs, CRM/ERP synchronisation, database pipelines and messaging platform connectivity.",
    promise:
      "Your software systems talking to each other reliably without anyone copying data by hand.",
    intro:
      "Most businesses already rely on software that works — CRMs, ERPs, accounting tools, databases, spreadsheets, and messaging platforms. The problem is that these tools operate in isolation, requiring manual copy-pasting and file exports. We build robust systems integrations that connect your software ecosystem into a synchronized operational pipeline.",
    whoItsFor: [
      "Businesses using separate tools (CRMs, ERPs, billing, calendars, databases) that cannot communicate automatically.",
      "Teams wasting hours every week manually exporting CSVs and re-importing data across systems.",
      "Companies struggling with data drift, inconsistent customer records, or mismatched inventory.",
      "Organizations with brittle webhooks or third-party connections that fail silently without alerts.",
    ],
    whenToChoose:
      "Choose Systems Integration when you have existing software systems that function well individually, but disconnected data and manual handoffs are causing delays, errors, and operational friction.",
    capabilities: [
      "Custom REST APIs, webhooks, and secure event-driven architectures",
      "Bidirectional CRM, ERP, and accounting platform synchronisation",
      "Calendar, database, and spreadsheet automation pipelines",
      "Conflict resolution rules and source-of-truth priority definitions",
      "Idempotent processing, automated retry mechanisms, and dead-letter queues",
      "Real-time logging, error tracking, and connection health alerting",
      "Full documentation and credentials handover so you own every integration",
    ],
    problems: [
      "Staff re-type the exact same customer or order information into multiple separate platforms",
      "Payments, client status, or inventory counts drift out of alignment across tools",
      "Manual CSV export/import routines break whenever column headers or formats change",
      "A third-party API update silently broke an internal connection days before anyone noticed",
      "Leadership cannot get reliable reporting because data sources disagree",
    ],
    outcomes: [
      "Operational data entered once and updated everywhere instantly",
      "Complete elimination of repetitive manual CSV exports and transcription errors",
      "Resilient connections that handle network blips and rate limits gracefully with automated retries",
      "Immediate visibility into connection status with automated alerting when attention is required",
    ],
    examples: [
      {
        title: "CRM and ERP synchronization",
        detail:
          "Keep customer profiles, orders, and fulfillment status in sync between front-end channels and central ERP.",
      },
      {
        title: "Automated payment and accounting pipeline",
        detail:
          "Connect payment gateways with bookkeeping and billing platforms for automated transaction reconciliation.",
      },
      {
        title: "Database and spreadsheet bridge",
        detail:
          "Scheduled and event-driven data movement between cloud databases and operational spreadsheets with conflict handling.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We catalog vendor APIs, authentication protocols, rate limits, payload formats, and data drift points.",
      },
      {
        stage: "02 Define",
        summary:
          "We specify schema mappings, source-of-truth priority, conflict resolution rules, and retry policies.",
      },
      {
        stage: "03 Build",
        summary:
          "We construct secure integration microservices, webhook listeners, queues, and continuous health monitors.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Sandbox testing, controlled production cutover, reconciliation validation, and logging activation.",
      },
      {
        stage: "05 Evolve",
        summary:
          "API version migrations, schema updates, payload adjustments, and continuous uptime monitoring.",
      },
    ],
    related: [
      { label: "Business Automation", href: "/services/business-automation" },
      { label: "WhatsApp Automation", href: "/services/whatsapp-automation" },
      { label: "AI-Powered Workflows", href: "/services/ai-workflows" },
      { label: "Other Services", href: "/services/other-services" },
    ],
    contactQueryType: "integrations",
    seo: {
      title: "Systems Integration Services & Software API Connectivity",
      description:
        "Systems integration services by UNFLECT: connect CRMs, ERPs, databases, spreadsheets, and custom APIs for reliable data synchronization and zero manual handoffs.",
    },
  },
  {
    slug: "ai-workflows",
    index: "04",
    name: "AI-Powered Workflows",
    summary:
      "Practical AI for enquiry classification, document data extraction and operational triage.",
    promise:
      "Pragmatic AI applied where it reduces real operational friction — with human verification built in.",
    intro:
      "Not every operational problem requires artificial intelligence. But where unstructured data slows down operations — unclassified emails, scanned invoices, complex inquiry briefs, or document summaries — practical AI workflows can eliminate hours of tedious human triage. We integrate focused AI models into existing business systems with clear boundaries, confidence scoring, and human escalation.",
    whoItsFor: [
      "Businesses handling large volumes of unstructured customer inquiries, support tickets, or emails.",
      "Teams spending hours manually reviewing documents, invoices, or forms to extract specific data fields.",
      "Operations managers who want smart summarization and triage without rewriting their entire tech stack.",
      "Organizations looking for practical, measurable AI utility rather than experimental generative hype.",
    ],
    whenToChoose:
      "Choose AI-Powered Workflows when your team spends excessive time manually reading, categorizing, summarizing, or extracting data from unstructured text, documents, or incoming requests.",
    capabilities: [
      "Automated customer inquiry classification and intent routing",
      "Document information extraction from invoices, receipts, PDFs, and forms",
      "Operational ticket and email summarization with action item extraction",
      "Confidence scoring and automated human-in-the-loop review queues",
      "Integration with existing CRMs, ticketing systems, and databases",
      "Strict data privacy boundaries ensuring client information is not used for model training",
      "Structured JSON output validation to prevent hallucinated or invalid schema updates",
    ],
    problems: [
      "Customer service staff spend hours reading and manually tagging inbound requests",
      "Data from PDF invoices, contracts, or forms is transcribed by hand into internal software",
      "Urgent or high-value customer issues get buried under routine inquiries",
      "Operational summaries require hours of manual reading across disconnected channels",
      "Fear of AI errors or hallucinations prevents teams from adopting useful automation",
    ],
    outcomes: [
      "Instant categorization and priority routing of all inbound messages and tickets",
      "Structured data extracted accurately from documents directly into your database",
      "Human operators review only edge cases or low-confidence predictions",
      "Predictable, controlled automation that respects existing business processes and data security",
    ],
    examples: [
      {
        title: "Enquiry classification and routing",
        detail:
          "Analyze incoming customer briefs, classify urgency and intent, and route to the correct team with pre-drafted context.",
      },
      {
        title: "Document data extraction",
        detail:
          "Parse unstructured PDF forms, invoices, and contracts into structured database records with confidence thresholds.",
      },
      {
        title: "Operations triage assistant",
        detail:
          "Summarize multi-channel customer communications into concise action points for internal operations teams.",
      },
    ],
    processStages: [
      {
        stage: "01 Discover",
        summary:
          "We analyze unstructured data sources, volume patterns, accuracy requirements, and identify low-risk, high-value tasks.",
      },
      {
        stage: "02 Define",
        summary:
          "We define prompt schemas, structured output formats, confidence thresholds, and human review fallback workflows.",
      },
      {
        stage: "03 Build",
        summary:
          "We build secure AI pipeline services, validation layers, database sinks, and human-in-the-loop escalation queues.",
      },
      {
        stage: "04 Deploy",
        summary:
          "Side-by-side verification with human benchmark data, security checks, and gradual production activation.",
      },
      {
        stage: "05 Evolve",
        summary:
          "Prompt refinements, evaluation benchmarking against ongoing edge cases, and workflow capability expansion.",
      },
    ],
    related: [
      { label: "Business Automation", href: "/services/business-automation" },
      { label: "WhatsApp Automation", href: "/services/whatsapp-automation" },
      { label: "Systems Integration", href: "/services/systems-integration" },
      { label: "Other Services", href: "/services/other-services" },
    ],
    contactQueryType: "ai",
    seo: {
      title: "Practical AI Automation Services & Intelligent Workflows",
      description:
        "AI-powered business automation by UNFLECT: practical enquiry classification, document data extraction, summarization, and intelligent workflow routing without unnecessary complexity.",
    },
  },
] as const satisfies readonly Service[];

export const servicesBySlug: Record<string, Service> = {
  "business-automation": services[0],
  "whatsapp-automation": services[1],
  "systems-integration": services[2],
  "ai-workflows": services[3],
  // Legacy slug aliases to prevent runtime issues
  systems: services[2],
  integrations: services[2],
};

export function getService(slug: string): Service | undefined {
  return servicesBySlug[slug];
}

export const servicesComparison = [
  {
    slug: "business-automation" as const,
    index: "01",
    name: "Business Automation",
    summary: "Automated operations, lead routing, approvals, and scheduled reporting.",
    bestFor: "Operational back-office, lead workflows, eliminating manual copy-pasting.",
    whenToChoose:
      "When internal operations are constrained by repetitive manual tasks, spreadsheet data entry, or slow manual approval chains.",
    typicalDeliverables: [
      "Automated lead intake & CRM distribution",
      "Multi-stage approval & notification pipelines",
      "Automated data entry & document generation",
      "Scheduled operational reports & summaries",
    ],
    contactHref: "/contact?type=automation",
  },
  {
    slug: "whatsapp-automation" as const,
    index: "02",
    name: "WhatsApp Automation",
    summary: "Customer enquiry triage, appointment booking workflows, and reminders.",
    bestFor: "Customer conversational touchpoints, self-service bookings, timely reminders.",
    whenToChoose:
      "When customer inquiries and appointment scheduling over WhatsApp consume staff time or result in missed bookings and drop-offs.",
    typicalDeliverables: [
      "Automated customer enquiry qualification & FAQs",
      "End-to-end appointment booking & calendar sync",
      "Automated reminder & confirmation sequences",
      "Seamless escalation to live team members",
    ],
    contactHref: "/contact?type=whatsapp",
  },
  {
    slug: "systems-integration" as const,
    index: "03",
    name: "Systems Integration",
    summary: "APIs, CRM/ERP synchronisation, database pipelines, and tool connectivity.",
    bestFor: "Connecting distinct software systems so data syncs without human copying.",
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
  {
    slug: "ai-workflows" as const,
    index: "04",
    name: "AI-Powered Workflows",
    summary: "Practical AI for enquiry classification, document data extraction, and triage.",
    bestFor: "Unstructured text, document parsing, automated triage with human oversight.",
    whenToChoose:
      "When staff spend excessive hours reading, categorizing, summarizing, or extracting data from incoming documents or messages.",
    typicalDeliverables: [
      "Inbound enquiry & ticket intent classification",
      "Document information extraction (PDFs, invoices)",
      "Automated triage & action item summarization",
      "Confidence-scored human-in-the-loop review queues",
    ],
    contactHref: "/contact?type=ai",
  },
] as const;
