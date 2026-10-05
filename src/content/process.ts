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
  /** What this stage actually covers. */
  activities: readonly string[];
  /** What you receive at the end of this stage. */
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
      "Every project starts with understanding, not design. We learn how the business works today, what breaks, who is affected and what a better outcome would look like. This is where we tell you if the problem is worth solving in software at all \u2014 and if it is, what solving it properly will require.",
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
      "The problem becomes something buildable. We specify what the software will do, what it will not do, how it will be structured, who is responsible for what, and how we will know each part is done. Scope here is treated as a promise \u2014 which is why it is written down precisely enough to be held to.",
    activities: [
      "Requirements and user stories",
      "Scope: what is included and explicitly excluded",
      "Feature definition and priority",
      "Deliverables and acceptance criteria",
      "Technical architecture and integration approach",
      "Timeline, milestones and dependencies",
      "Responsibilities on both sides",
      "Security level assessment (see Level 1\u20133)",
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
    activities: [
      "Interface and experience design",
      "Development against the defined scope",
      "Integration with existing systems",
      "Testing: functional, integration, and the security practices appropriate to the level",
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
      "Launching is its own stage, not an afterthought. We deploy to production, verify the real environment rather than assuming staging matched it, document it, and hand it over properly \u2014 including the credentials and infrastructure you own.",
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
      "Software that is never improved becomes a liability. Live systems need upkeep, security updates, performance work and \u2014 as the business changes \u2014 new capability. We support what we build, and we separate maintenance from new development so nothing is ambiguous.",
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
