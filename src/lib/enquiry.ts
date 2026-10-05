/**
 * Project enquiry schema, options and validation.
 *
 * Deliberately dependency-free so the exact same rules run in the browser and
 * in the Route Handler. The server never trusts the client result.
 */

export const budgetCurrency = "\u00a3"; // Adjust if the business bills in another currency.

export const enquiryFields = {
  projectType: [
    { value: "web-application", label: "Web application or SaaS platform" },
    { value: "ecommerce", label: "E-commerce or online selling" },
    { value: "customer-portal", label: "Customer portal or self-service area" },
    { value: "internal-system", label: "Internal business system or dashboard" },
    { value: "admin-platform", label: "Admin or management platform" },
    { value: "integration", label: "Integration or API work" },
    { value: "unsure", label: "Not sure yet \u2014 needs defining" },
  ],
  timeline: [
    { value: "under-3-months", label: "Under 3 months" },
    { value: "3-6-months", label: "3 to 6 months" },
    { value: "6-12-months", label: "6 to 12 months" },
    { value: "ongoing", label: "Ongoing / recurring work" },
    { value: "exploring", label: "Exploring \u2014 no fixed date" },
  ],
  budget: [
    { value: "under-10k", label: `Under ${budgetCurrency}10,000` },
    { value: "10k-25k", label: `${budgetCurrency}10,000 \u2013 ${budgetCurrency}25,000` },
    { value: "25k-50k", label: `${budgetCurrency}25,000 \u2013 ${budgetCurrency}50,000` },
    { value: "50k-100k", label: `${budgetCurrency}50,000 \u2013 ${budgetCurrency}100,000` },
    { value: "100k-plus", label: `${budgetCurrency}100,000+` },
    { value: "unsure", label: "Not established yet" },
  ],
} as const;

export type ProjectTypeValue = (typeof enquiryFields.projectType)[number]["value"];
export type TimelineValue = (typeof enquiryFields.timeline)[number]["value"];
export type BudgetValue = (typeof enquiryFields.budget)[number]["value"];

export type EnquiryInput = {
  name: string;
  company: string;
  email: string;
  projectType: string;
  goal: string;
  problem: string;
  timeline: string;
  budget: string;
  details: string;
};

export type EnquiryFieldName = keyof EnquiryInput;

export const emptyEnquiry: EnquiryInput = {
  name: "",
  company: "",
  email: "",
  projectType: "",
  goal: "",
  problem: "",
  timeline: "",
  budget: "",
  details: "",
};

/** Labels reused by the form, validation messages and the API response. */
export const fieldLabels: Record<EnquiryFieldName, string> = {
  name: "Name",
  company: "Company",
  email: "Email",
  projectType: "Project type",
  goal: "What are you trying to build?",
  problem: "What problem are you trying to solve?",
  timeline: "Approximate timeline",
  budget: "Budget range",
  details: "Additional information",
};

const LIMITS = {
  name: 100,
  company: 160,
  email: 254,
  goal: 2000,
  problem: 2000,
  details: 2000,
} as const;

/** Pragmatic, permissive email shape check \u2014 not RFC 5322. */
const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;

const isProjectType = (v: string) =>
  enquiryFields.projectType.some((o) => o.value === v);
const isTimeline = (v: string) => enquiryFields.timeline.some((o) => o.value === v);
const isBudget = (v: string) => enquiryFields.budget.some((o) => o.value === v);

/** Optional honeypot \u2014 a hidden field bots tend to fill. */
export const HONEYPOT_FIELD = "website";

export type ValidationResult =
  | { ok: true; value: EnquiryInput; disposition: "accept" }
  /** Honeypot hit \u2014 respond as though accepted, but deliver nothing. */
  | { ok: true; value: EnquiryInput; disposition: "discard" }
  | { ok: false; errors: Partial<Record<EnquiryFieldName, string>> };

const clean = (v: unknown): string =>
  typeof v === "string"
    ? v
        // Strip control characters, then collapse whitespace runs.
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim()
    : "";

export function validateEnquiry(raw: unknown): ValidationResult {
  const errors: Partial<Record<EnquiryFieldName, string>> = {};

  const get = (key: string): string => {
    if (typeof raw !== "object" || raw === null) return "";
    return clean((raw as Record<string, unknown>)[key]);
  };

  // Honeypot: a filled field means a bot. Reported as success so the bot does
  // not learn the rule, but flagged `discard` so nothing is delivered.
  const website = get(HONEYPOT_FIELD);
  if (website) {
    return { ok: true, value: { ...emptyEnquiry }, disposition: "discard" };
  }

  const name = get("name");
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name)
    errors.name = `Please keep this under ${LIMITS.name} characters.`;

  const company = get("company");
  if (!company) errors.company = "Please tell us which company you are with.";
  else if (company.length > LIMITS.company)
    errors.company = `Please keep this under ${LIMITS.company} characters.`;

  const email = get("email");
  if (!email) errors.email = "Please provide an email address.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "Please provide a valid email address.";

  const projectType = get("projectType");
  if (!projectType) errors.projectType = "Please choose a project type.";
  else if (!isProjectType(projectType))
    errors.projectType = "Please choose an option from the list.";

  const goal = get("goal");
  if (!goal) errors.goal = "Please describe what you are trying to build.";
  else if (goal.length < 15)
    errors.goal = "A sentence or two is enough, but please add a little more detail.";
  else if (goal.length > LIMITS.goal)
    errors.goal = `Please keep this under ${LIMITS.goal} characters.`;

  const problem = get("problem");
  if (!problem)
    errors.problem = "Please describe the problem you are trying to solve.";
  else if (problem.length < 15)
    errors.problem =
      "This is the most useful part \u2014 please tell us what is going wrong today.";
  else if (problem.length > LIMITS.problem)
    errors.problem = `Please keep this under ${LIMITS.problem} characters.`;

  const timeline = get("timeline");
  if (!timeline) errors.timeline = "Please choose an approximate timeline.";
  else if (!isTimeline(timeline))
    errors.timeline = "Please choose an option from the list.";

  const budget = get("budget");
  if (!budget) errors.budget = "Please choose an indicative budget range.";
  else if (!isBudget(budget))
    errors.budget = "Please choose an option from the list.";

  const details = get("details");
  if (details.length > LIMITS.details)
    errors.details = `Please keep this under ${LIMITS.details} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    disposition: "accept",
    value: { name, company, email, projectType, goal, problem, timeline, budget, details },
  };
}

/** Human-readable summary used in the server-side delivery adapter. */
export function describeEnquiry(input: EnquiryInput) {
  return {
    reference: "",
    receivedAt: new Date().toISOString(),
    contact: { name: input.name, company: input.company, email: input.email },
    classification: {
      projectType: input.projectType,
      timeline: input.timeline,
      budget: input.budget,
    },
    goal: input.goal,
    problem: input.problem,
    details: input.details || "(none provided)",
  };
}
