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
      "We understand the business, the actual problem and the constraints before anything is built.",
    detail:
      "Every project starts with understanding, not design. We learn how the business works today, what breaks, who is affected and what a better outcome would look like. This is where we tell you if the problem is worth solving in software at all — and if it is, what solving it properly will require.",
    whatHappens: [
      "We interview the operators and stakeholders who experience the problem day to day.",
      "We map existing workflows, shadow spreadsheets, data formats, and pain points.",
      "We audit current tools, technical constraints, legacy dependencies, and regulatory requirements.",
      "We verify whether software is the right answer or if a simpler process change would suffice.",
    ],
    whatClientDoes: [
      "Walk us through how work moves through your business right now.",
      "Share representative workflow examples, sample data, and access to current systems.",
      "Highlight what breaks when volume spikes and what workarounds the team relies on.",
      "Clarify commercial constraints: deadlines, budget reality, and decision approvals.",
    ],
    whatYouReceive: [
      "A written diagnostic clarifying the root problem behind the brief.",
      "Current-state workflow diagram highlighting bottlenecks and manual bridges.",
      "Initial technical feasibility summary with architectural recommendations.",
      "Clear recommendation on whether to proceed to definition.",
    ],
    paymentPoint:
      "Covered by the initial project deposit (50% on small projects, 30–40% on milestone projects) or engaged as a standalone paid Discovery phase for complex engagements.",
    activities: [
      "Business and commercial context",
      "The actual problem behind the brief",
      "Existing workflows and how work moves today",
      "Users and roles involved",
      "Current systems in use and what each one is for",
      "Pain points, workarounds and the cost of leaving them",
      "Desired outcomes and how success will be recognised",
      "Constraints: budget, deadline, legacy systems, regulation",
    ],
    output:
      "A shared understanding of the problem, written down and agreed before scope is proposed.",
  },
  {
    id: "define",
    index: "02",
    name: "Define",
    summary:
      "We turn the problem into requirements, scope, architecture, milestones and acceptance criteria.",
    detail:
      "The problem becomes something buildable. We specify what the software will do, what it will not do, how it will be structured, who is responsible for what, and how we will know each part is done. Scope here is treated as a promise — which is why it is written down precisely enough to be held to.",
    whatHappens: [
      "We define exact functional requirements, user journeys, and role-based permissions.",
      "We specify architectural design, database schemas, third-party APIs, and security controls.",
      "We establish explicit boundaries: what is included and what is deliberately excluded.",
      "We draft the milestone breakdown with testable acceptance criteria for every deliverable.",
    ],
    whatClientDoes: [
      "Review the functional specifications and confirm terminology matches business reality.",
      "Approve the boundary of included work versus excluded work.",
      "Confirm acceptance criteria: agreeing on what constitutes 'done' for each milestone.",
      "Sign off on the specification document and delivery roadmap.",
    ],
    whatYouReceive: [
      "Detailed Statement of Work (SOW) with unambiguous scope boundaries.",
      "Technical architecture plan, database schema, and security classification.",
      "Milestone roadmap with measurable acceptance criteria for each phase.",
      "Fixed commercial proposal with delivery schedule and payment terms.",
    ],
    paymentPoint:
      "Specification sign-off locks the scope commitment. For phased or milestone engagements, the agreed milestone schedule takes effect prior to active engineering.",
    activities: [
      "Requirements and user stories",
      "Scope: what is included and explicitly excluded",
      "Feature definition and priority",
      "Deliverables and acceptance criteria",
      "Technical architecture and integration approach",
      "Timeline, milestones and dependencies",
      "Responsibilities on both sides",
      "Security level assessment",
    ],
    output:
      "A defined specification, scope boundary, milestone plan and set of acceptance criteria.",
  },
  {
    id: "build",
    index: "03",
    name: "Build",
    summary:
      "Design, development, integration, testing and client review, in visible increments.",
    detail:
      "Work proceeds in increments you can see and use, rather than a long silence followed by a reveal. You see progress, give feedback against the agreed scope, and we adjust while changes are still inexpensive to make.",
    whatHappens: [
      "We build production-ready code, data schemas, API routes, and user interfaces.",
      "We test each component: unit tests, integration paths, validation, and accessibility.",
      "We deploy working increments to a staging environment you can click and test.",
      "We demonstrate completed milestones and address feedback against the agreed criteria.",
    ],
    whatClientDoes: [
      "Test working increments in staging environments as milestones are released.",
      "Provide consolidated feedback within the agreed 5 business-day review window.",
      "Verify that delivered behavior matches the agreed acceptance criteria.",
      "Approve milestone acceptance when criteria are satisfied.",
    ],
    whatYouReceive: [
      "Demonstrable software running on isolated staging environments at every milestone.",
      "Sprint and milestone demonstration walk-throughs with the engineer building your code.",
      "Clean, version-controlled source code in private Git repositories.",
      "Continuous milestone review logs and progress updates.",
    ],
    paymentPoint:
      "Milestone payments are invoiced upon client demonstration and acceptance of the agreed milestone deliverables.",
    activities: [
      "Interface and experience design",
      "Development against the defined scope",
      "Integration with existing systems",
      "Testing: functional, integration, and security practices",
      "Client review and demonstration of working increments",
      "Iteration against agreed feedback",
    ],
    output:
      "A working application that meets the agreed acceptance criteria, demonstrated and reviewed with you.",
  },
  {
    id: "deploy",
    index: "04",
    name: "Deploy",
    summary:
      "Production release, configuration, testing, documentation and a proper handover.",
    detail:
      "Launching is its own stage, not an afterthought. We deploy to production, verify the real environment rather than assuming staging matched it, document it, and hand it over properly — including the credentials and infrastructure you own.",
    whatHappens: [
      "We configure production cloud hosting, DNS records, SSL certificates, and database backups.",
      "We execute data migrations and connect live third-party keys (payments, CRMs, email).",
      "We perform end-to-end smoke testing in the real production environment.",
      "We assemble the handover pack: runbooks, setup documentation, and architecture notes.",
      "We transfer all repository rights, account credentials, and hosting access to you.",
    ],
    whatClientDoes: [
      "Supply production credentials for client-owned services (domain, payment gateway, cloud accounts).",
      "Participate in live verification testing to confirm business workflows operate as specified.",
      "Receive and store credentials, recovery keys, and administrative access securely.",
      "Complete final commercial settlement prior to official launch cutover.",
    ],
    whatYouReceive: [
      "Live production software deployed and verified in your own environment.",
      "Full ownership transfer of the source repository, cloud accounts, and credentials.",
      "Complete handover documentation: operational runbook, setup instructions, and architecture guide.",
      "Warranty period covering specified functionality corrections.",
    ],
    paymentPoint:
      "Final balance (the remaining 50% on small projects, or the final deployment milestone) falls due prior to live production cutover and full credential transfer.",
    activities: [
      "Production deployment and environment configuration",
      "Live integration and payment configuration",
      "Production testing and verification",
      "Documentation and handover pack",
      "Ownership transfer of client accounts, credentials and infrastructure",
      "Cutover plan and rollback position",
    ],
    output:
      "A production application, the source repository, credentials, and the documentation to operate it.",
  },
  {
    id: "evolve",
    index: "05",
    name: "Evolve",
    summary:
      "Maintenance, improvement and new development once the software is live and in use.",
    detail:
      "Software that is never improved becomes a liability. Live systems need upkeep, security updates, performance work and — as the business changes — new capability. We support what we build, and we separate maintenance from new development so nothing is ambiguous.",
    whatHappens: [
      "We monitor application uptime, database query performance, and external API error rates.",
      "We apply proactive security patches, framework upgrades, and dependency maintenance.",
      "We scope and build new capabilities as real customer usage reveals high-value opportunities.",
      "We provide regular maintenance logs detailing what was upgraded, tested, and resolved.",
    ],
    whatClientDoes: [
      "Report edge-case anomalies, team feedback, or shifting operational needs.",
      "Collaborate on feature prioritisation based on real usage metrics.",
      "Review periodic health summaries and approve recommendations for architectural upkeep.",
      "Engage via monthly retainer or separate scoped change orders for major feature additions.",
    ],
    whatYouReceive: [
      "Maintained, dependable software that stays aligned with modern browsers and APIs.",
      "Security and dependency upgrade logs ensuring your system doesn't accumulate debt.",
      "Direct technical support from the studio without helpdesk queues.",
      "A continuous path to expand your platform as your business grows.",
    ],
    paymentPoint:
      "Monthly in advance for recurring maintenance, monitoring, and support retainers. Major new feature development is scoped and billed as distinct project milestones.",
    activities: [
      "Maintenance and technical upkeep",
      "Security updates and dependency maintenance",
      "Performance and reliability work",
      "Improvements driven by real usage",
      "New features and major changes as the business evolves",
      "Proactive reporting on what needs attention",
    ],
    output:
      "Software that keeps working, keeps improving, and stays aligned with the business.",
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
      "What is agreed is what gets built. Anything else is a change request.",
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
      "We work best with the people who know the workflow firsthand. Middlemen and telephone games slow down projects. We need direct communication with the person who feels the problem and the person authorized to make commercial decisions.",
  },
  {
    id: "review-window",
    title: "Timely feedback within 5 business days",
    detail:
      "When we demonstrate a milestone or deliver an increment to staging, we need your feedback within 5 business days. Fast feedback keeps engineering momentum high and ensures changes remain inexpensive to incorporate.",
  },
  {
    id: "honest-context",
    title: "Honest operational context and sample data",
    detail:
      "Tell us where existing systems fail, what your team secretly dislikes, and what manual workarounds exist today. Realistic sample data and frank operational realities allow us to architect for edge cases early.",
  },
  {
    id: "system-access",
    title: "Timely access to credentials and accounts",
    detail:
      "Delays in provisioning API keys, DNS permissions, staging credentials, or third-party vendor documentation delay deployment. We rely on you to authorise necessary system accesses promptly.",
  },
] as const;

export const scopeChangePolicy = {
  title: "What happens if scope changes?",
  intro:
    "Software is tactile. As soon as you see a working system in staging, new ideas and clearer priorities inevitably emerge. We treat that as natural progress, not a confrontation. Here is how we protect your project when requirements evolve:",
  steps: [
    {
      title: "1. Scope is a written commitment",
      detail:
        "The specification agreed in the Define stage is what gets built. Neither side changes it silently. You can count on the agreed deliverables, budget, and milestone dates.",
    },
    {
      title: "2. New requests are handled formally",
      detail:
        "When you request new functionality or a shift in requirements, we prepare a concise Change Request. We evaluate its concrete impact on architecture, timeline, and cost before writing a line of code.",
    },
    {
      title: "3. You retain full commercial control",
      detail:
        "You decide how to handle the change: (a) swap out a lower-priority feature of equal weight within the existing budget, (b) approve a formal cost/timeline amendment, or (c) defer the feature to the Evolve phase. No surprise invoices.",
    },
  ],
} as const;
