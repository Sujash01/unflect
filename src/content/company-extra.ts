/**
 * Supporting copy that does not belong in a structured list.
 */

export const aiPhilosophyNote =
  "We use AI as an engineering capability where it genuinely improves the work. It is not the positioning of the company, and it is not a substitute for judgement. Someone reviews every line, tests what matters, makes the security decisions and stands behind what ships.";

export const contactIntro = {
  eyebrow: "Start a project",
  heading: "Tell us what you are trying to build \u2014 and what problem is in the way.",
  body: "This is the beginning of a project discussion, not a contact form. The more you can say about the problem today, the more useful our first reply will be. If we are not the right fit, we will say so.",
  expectations: [
    "A reply from a person who has read the enquiry, not an autoresponder.",
    "An honest read on whether software is the right answer to this problem.",
    "A view on scope, sequence and what it would realistically take.",
    "A clear statement if we are not the right people for it.",
  ],
} as const;

/** What to include for the strongest first response. */
export const contactGuidance = [
  {
    id: "problem",
    title: "The problem, not the feature list",
    detail:
      "What is going wrong today, who it affects, and what it is costing you. This is the most useful thing you can tell us.",
  },
  {
    id: "systems",
    title: "The systems involved",
    detail:
      "What you already run, what it does, and which parts are the problem. Rough names are fine.",
  },
  {
    id: "outcome",
    title: "What better looks like",
    detail:
      "How you would recognise success. Not a specification \u2014 an outcome. We will help shape the specification afterwards.",
  },
  {
    id: "constraints",
    title: "The constraints",
    detail:
      "Deadlines, budget reality, internal approvals, regulatory requirements. Better known early than discovered late.",
  },
] as const;
