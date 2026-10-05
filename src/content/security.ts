/**
 * Security is presented as part of the development process, tiered by project
 * risk \u2014 not as a marketing claim.
 *
 * Hard constraints enforced by copy and code review:
 *  - No "100% secure", "unhackable", "bulletproof" or similar.
 *  - No guaranteed compliance or certification claims.
 *  - Security is described as risk-appropriate controls, not certainty.
 */

export type SecurityLevel = {
  id: "standard" | "enhanced" | "high-security";
  level: string;
  index: string;
  name: string;
  /** When this level applies. */
  applicability: string;
  summary: string;
  /** Practices applied at this level. */
  controls: readonly string[];
  /** What the client should expect to be involved with. */
  clientExpectation: string;
};

export const securityLevels = [
  {
    id: "standard",
    level: "Level 1",
    index: "01",
    name: "Standard",
    applicability: "Normal business applications and lower-risk projects.",
    summary:
      "Sound defaults applied consistently. Appropriate where the software handles ordinary business data and the consequence of compromise is bounded.",
    controls: [
      "Least-privilege access, including for our own team",
      "Managed authentication with multi-factor support where accounts are exposed",
      "Encrypted data in transit and at rest",
      "Secure development practices throughout the build",
      "Dependency and patch management",
      "Functional and integration testing before release",
      "Input validation and output encoding",
      "Backups and a documented restore position",
      "Logging proportionate to the system",
    ],
    clientExpectation:
      "You provide the business requirements and access to the systems involved. Security is handled by us unless you need specific controls.",
  },
  {
    id: "enhanced",
    level: "Level 2",
    index: "02",
    name: "Enhanced",
    applicability:
      "Projects requiring stronger security controls and additional practices.",
    summary:
      "Adds review, segregation and evidence on top of Standard. Appropriate where the system holds more sensitive data, supports more users, or is business-critical.",
    controls: [
      "Everything in Level 1, with each control evidenced and reviewed",
      "Formal threat consideration as part of the Define stage",
      "Stricter access control, review and periodic re-validation",
      "Additional automated and manual security testing before release",
      "Segregation of environments: development, staging and production",
      "Detailed audit logging of sensitive actions",
      "Documented incident response and communication process",
      "Hardened infrastructure configuration and secrets management",
      "Recovery objectives agreed and tested, not just configured",
      "Security documented for the handover rather than assumed",
    ],
    clientExpectation:
      "You are involved in agreeing access levels, recovery objectives and who within the business is authorised to do what.",
  },
  {
    id: "high-security",
    level: "Level 3",
    index: "03",
    name: "High security",
    applicability:
      "Sensitive, high-risk or regulated projects requiring significantly stronger controls and potentially specialist involvement.",
    summary:
      "Substantially more demanding. Where data, regulation or consequence justify it, the work involves specialist security input and a longer, more formal process.",
    controls: [
      "Everything in Levels 1 and 2, at a higher level of assurance",
      "Independent specialist security review, including penetration testing where proportionate",
      "Formal security requirements derived from a dedicated assessment",
      "Approved-by-design architecture with threat modelling per significant component",
      "Strict segregation of duties and privileged access controls",
      "Enhanced encryption, key management and rotation",
      "Continuous vulnerability management of dependencies and infrastructure",
      "Formal change control, code review and release authorisation",
      "Documented, tested and rehearsed incident response",
      "Contractual security responsibilities and handover obligations",
    ],
    clientExpectation:
      "Expect a longer discovery and define phase, specialist involvement, formal approvals, and your own compliance or legal input. Timelines reflect that.",
  },
] as const satisfies readonly SecurityLevel[];

/** Security principles \u2014 behaviours, not guarantees. */
export const securityPrinciples = [
  {
    id: "least-privilege",
    title: "Least privilege",
    detail:
      "Access is granted to the minimum needed for the task, reviewed, and removed when it is no longer needed \u2014 including our own.",
  },
  {
    id: "controlled-access",
    title: "Controlled access",
    detail:
      "Authentication and authorisation are designed deliberately, not inherited from a framework default.",
  },
  {
    id: "secure-development",
    title: "Secure development",
    detail:
      "Security is considered during design and build, not added at the end as a phase.",
  },
  {
    id: "testing",
    title: "Appropriate testing",
    detail:
      "Testing depth follows the risk level, rather than a fixed checklist applied identically to everything.",
  },
  {
    id: "data-handling",
    title: "Responsible data handling",
    detail:
      "Only the data needed is collected and kept. Client infrastructure and critical third-party accounts remain client-owned where practical.",
  },
  {
    id: "proportional",
    title: "Security by risk",
    detail:
      "Controls are chosen per project risk. Higher-risk work gets more; routine work is not over-engineered.",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  detail: string;
}[];

/** Explicit disclaimer \u2014 prevents overstated security marketing. */
export const securityDisclaimer =
  "No software can be described as completely secure. We design and test to reduce risk to the level the project warrants, and we do not claim guarantees we cannot evidence. Security is part of the process, not a promise of immunity.";
