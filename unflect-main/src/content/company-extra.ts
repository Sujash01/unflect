/**
 * Supporting copy that does not belong in a structured list.
 */

export const aiPhilosophyNote =
  "We use AI for engineering leverage, but engineers review every line and stand behind what ships.";

export const contactIntro = {
  eyebrow: "Start a project",
  heading: "Tell us what you are trying to build \u2014 and what problem is in the way.",
  body: "Describe the problem and context today. We will reply with an honest technical assessment.",
  expectations: [
    "Immediate transactional receipt followed by a considered engineering reply within two days.",
    "Honest assessment on whether custom software is the right solution.",
    "Realistic perspective on scope, architecture, and required investment.",
    "Direct notification if we are not the right studio for your project.",
  ],
} as const;

/** What to include for the strongest first response. */
export const contactGuidance = [
  {
    id: "problem",
    title: "The problem, not the feature list",
    detail: "What is going wrong today, who it affects, and what it costs.",
  },
  {
    id: "systems",
    title: "The systems involved",
    detail: "The tools you run today and which specific workflows fail.",
  },
  {
    id: "outcome",
    title: "What better looks like",
    detail: "The practical business outcome that defines success.",
  },
  {
    id: "constraints",
    title: "The constraints",
    detail: "Hard deadlines, budgets, and operational requirements.",
  },
] as const;
