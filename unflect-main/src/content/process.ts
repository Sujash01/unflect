/**
 * The UNFLECT delivery process: DISCOVER → DEFINE → BUILD → DEPLOY → EVOLVE.
 * Exact wording and sequence are fixed by the operating model.
 */

export type ProcessStage = {
  id: string;
  index: string;
  name: string;
  /** Short explanation used on cards and the homepage rail. */
  summary: string;
  /** Fuller narrative used on the process page. */
  detail: string;
  /** What UNFLECT does during this stage. */
  whatHappens: readonly string[];
  /** What the client does and contributes during this stage. */
  whatClientDoes: readonly string[];
  /** Concrete deliverables the client receives at this stage. */
  whatYouReceive: readonly string[];
  /** The commercial payment point that applies to this stage. */
  paymentPoint: string;
  /** Core activities checklist. */
  activities: readonly string[];
  /** One-line output summary. */
  output: string;
};

export const processStages = [
  {
    id: "discover",
    index: "01",
    name: "Discover",
    summary:
      "We understand the business, the actual problem and constraints before anything is built.",
    detail:
      "We study existing workflows and constraints to confirm software is the right answer before committing to scope.",
    whatHappens: [
      "Interview operators and stakeholders experiencing the workflow firsthand",
      "Map existing processes, shadow spreadsheets, and operational friction points",
      "Audit current software tools, technical dependencies, and data structures",
      "Confirm whether software or a simpler process change is required",
    ],
    whatClientDoes: [
      "Walk us through how work moves through your business today",
      "Share representative workflow examples and sample data",
      "Clarify timeline constraints, budget reality, and key decision-makers",
    ],
    whatYouReceive: [
      "Written diagnostic clarifying root problems behind the brief",
      "Workflow map highlighting bottlenecks and manual handoffs",
      "Technical feasibility assessment and architectural recommendations",
    ],
    paymentPoint:
      "Covered by the initial project deposit, or engaged as a standalone paid discovery phase.",
    activities: [
      "Business and operational context",
      "Root problems behind the brief",
      "Existing workflows and tool audits",
      "Budget, timeline, and technical constraints",
    ],
    output:
      "A shared, documented understanding of the problem agreed before proposing scope.",
  },
  {
    id: "define",
    index: "02",
    name: "Define",
    summary:
      "We turn the problem into requirements, architecture, milestones and acceptance criteria.",
    detail:
      "We specify exact functional scope, data architecture, milestones, and acceptance criteria before engineering begins.",
    whatHappens: [
      "Define functional requirements, user journeys, and role-based permissions",
      "Specify database schemas, API architecture, and security controls",
      "Establish explicit boundaries for included versus excluded work",
      "Set milestone schedules with objective acceptance criteria for each phase",
    ],
    whatClientDoes: [
      "Review specifications to confirm terminology matches operational reality",
      "Approve the boundary of included versus excluded project scope",
      "Confirm acceptance criteria defining 'done' for each milestone",
    ],
    whatYouReceive: [
      "Statement of Work with explicit, locked scope boundaries",
      "Technical architecture plan, schema designs, and security specifications",
      "Milestone delivery roadmap with objective acceptance criteria",
    ],
    paymentPoint:
      "Locks the scope commitment before active engineering commences.",
    activities: [
      "Requirements and user journeys",
      "Boundaries of included and excluded scope",
      "Technical architecture and database schema",
      "Milestones and acceptance criteria",
    ],
    output:
      "A locked specification, architecture blueprint, and milestone roadmap.",
  },
  {
    id: "build",
    index: "03",
    name: "Build",
    summary:
      "Design, development, integration, testing and client review, in visible increments.",
    detail:
      "We develop working software in demonstrable increments with regular reviews, making adjustments while changes remain inexpensive.",
    whatHappens: [
      "Engineer production-ready code, data models, APIs, and user interfaces",
      "Write automated unit, integration, and accessibility tests",
      "Deploy working milestone builds to private staging environments",
      "Demonstrate progress regularly and incorporate feedback against agreed criteria",
    ],
    whatClientDoes: [
      "Test working software in staging as milestones are delivered",
      "Provide consolidated feedback within the 5-day review window",
      "Approve milestone completion when acceptance criteria are met",
    ],
    whatYouReceive: [
      "Working software running on isolated staging environments at every milestone",
      "Direct sprint walkthroughs with the engineers writing the code",
      "Clean, version-controlled source code in private repositories",
    ],
    paymentPoint:
      "Invoiced upon client demonstration and acceptance of agreed milestone deliverables.",
    activities: [
      "Interface and experience design",
      "Frontend and backend engineering",
      "Automated testing and validation",
      "Demonstrations of working increments",
    ],
    output:
      "A tested application meeting agreed criteria, demonstrated and approved by you.",
  },
  {
    id: "deploy",
    index: "04",
    name: "Deploy",
    summary:
      "Production release, configuration, testing, documentation and a proper handover.",
    detail:
      "We launch to your production infrastructure, verify real-world performance, and transfer full ownership and documentation.",
    whatHappens: [
      "Configure production cloud hosting, DNS, SSL, and automated backups",
      "Execute data migrations and connect live third-party service credentials",
      "Perform end-to-end smoke testing in the live production environment",
      "Deliver operational runbooks, architecture documentation, and repository access",
    ],
    whatClientDoes: [
      "Supply access credentials for client-owned domain and hosting accounts",
      "Participate in live verification testing to confirm business workflows",
      "Securely store administrative access and production recovery keys",
    ],
    whatYouReceive: [
      "Verified production software running in your cloud environment",
      "Full ownership of source code, cloud accounts, and credentials",
      "Operational runbooks, setup documentation, and architecture notes",
    ],
    paymentPoint:
      "Final balance falls due prior to live production cutover and credential handover.",
    activities: [
      "Production deployment and environment setup",
      "Live payment and third-party configuration",
      "Real-world testing and smoke validation",
      "Operational runbooks and credential handover",
    ],
    output:
      "A live application with transferred source code, credentials, and runbooks.",
  },
  {
    id: "evolve",
    index: "05",
    name: "Evolve",
    summary:
      "Maintenance, improvement and new development once the software is live.",
    detail:
      "We provide ongoing maintenance, security patches, and phased feature additions as your business scales.",
    whatHappens: [
      "Monitor uptime, database query performance, and external API health",
      "Apply regular security patches, framework upgrades, and dependency fixes",
      "Scope and build new capabilities as real usage reveals opportunities",
      "Provide transparent maintenance logs documenting updates and resolutions",
    ],
    whatClientDoes: [
      "Share operational feedback, edge cases, and changing business needs",
      "Prioritise feature requests based on real customer and staff usage",
      "Review periodic health summaries and approve upkeep recommendations",
    ],
    whatYouReceive: [
      "Reliable software maintained against browser and API updates",
      "Security and dependency logs keeping technical debt low",
      "Direct engineering support and a clear roadmap for new features",
    ],
    paymentPoint:
      "Billed monthly in advance for maintenance; major feature additions scoped as distinct milestones.",
    activities: [
      "Monitoring and uptime management",
      "Security patches and dependency updates",
      "Query optimisation and performance tuning",
      "Feature enhancements driven by real usage",
    ],
    output:
      "Continuously maintained software that stays aligned with your evolving business.",
  },
] as const satisfies readonly ProcessStage[];

export const processPrinciples = [
  {
    id: "visible",
    title: "Visible progress",
    detail:
      "You see working software during the build, not only at the end.",
  },
  {
    id: "scope",
    title: "Scope is a promise",
    detail:
      "What is agreed is what gets built; new requests are handled transparently.",
  },
  {
    id: "criteria",
    title: "Defined done",
    detail: "Each part of the project has agreed acceptance criteria.",
  },
  {
    id: "ownership",
    title: "You own it",
    detail:
      "Code, accounts, infrastructure and documentation belong to the client.",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  detail: string;
}[];

export const clientExpectations = [
  {
    id: "decision-maker",
    title: "Direct access to real operators",
    detail:
      "Direct communication with the people who experience the problem and make decisions.",
  },
  {
    id: "review-window",
    title: "Timely feedback within 5 business days",
    detail:
      "Prompt milestone reviews within 5 business days to keep engineering momentum moving forward.",
  },
  {
    id: "honest-context",
    title: "Honest operational context and sample data",
    detail:
      "Realistic sample data and frank operational context so we architect for edge cases early.",
  },
  {
    id: "system-access",
    title: "Timely access to credentials and accounts",
    detail:
      "Prompt provisioning of relevant API keys, domains, and vendor accounts to prevent launch delays.",
  },
] as const;

export const scopeChangePolicy = {
  title: "What happens if scope changes?",
  intro:
    "New priorities naturally emerge once software is in staging; here is how we handle changes transparently:",
  steps: [
    {
      title: "1. Scope is a written commitment",
      detail:
        "Agreed specifications are locked; neither side alters them silently.",
    },
    {
      title: "2. New requests are handled formally",
      detail:
        "We evaluate the exact cost and timeline impact before any code changes.",
    },
    {
      title: "3. You retain full commercial control",
      detail:
        "Swap features, approve a timeline amendment, or defer additions to future milestones.",
    },
  ],
} as const;
