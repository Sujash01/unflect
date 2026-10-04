import { describeEnquiry, type EnquiryInput } from "./enquiry";

/**
 * Enquiry delivery adapter.
 *
 * The form is fully wired end-to-end, but there is no third-party integration
 * configured \u2014 because choosing a provider requires an account, a domain and a
 * data-processing decision that belongs to the business, not to a code change.
 *
 * Default behaviour: a structured, single-line summary is written to the server
 * log. That is enough to prove the pipeline works and to develop against, and it
 * is the only thing that happens with an enquirer's details today.
 *
 * TO GO LIVE, replace the body of `deliverEnquiry` with a real transport \u2014
 * one of:
 *   - Transactional email (Resend, Postmark, SES) addressed to an inbox you own.
 *   - A CRM or lead system (HubSpot, Pipedrive) via its API.
 *   - A ticketing or project intake tool.
 *
 * Requirements for that transport:
 *   - Send over TLS to a server-side endpoint. Never expose provider keys with a
 *     NEXT_PUBLIC_ prefix.
 *   - Obtain and record the lawful basis for processing, and publish it.
 *   - Do not log message bodies to a third-party log sink without a decision.
 *   - Treat the enquiry as confidential: it describes a business's weaknesses.
 *
 * The function signature stays the same, so nothing else needs to change.
 */

export type DeliveryResult =
  | { delivered: true; via: "log" | "email" | "crm" }
  | { delivered: false; reason: string };

export async function deliverEnquiry(
  enquiry: EnquiryInput,
  reference: string,
): Promise<DeliveryResult> {
  const summary = describeEnquiry({ ...enquiry, details: enquiry.details });

  // Single-line, greppable, and free of message bodies.
  console.info(
    JSON.stringify({
      event: "project_enquiry",
      reference,
      receivedAt: summary.receivedAt,
      contact: {
        name: summary.contact.name,
        company: summary.contact.company,
        email: summary.contact.email,
      },
      classification: summary.classification,
      characterCounts: {
        goal: enquiry.goal.length,
        problem: enquiry.problem.length,
        details: enquiry.details.length,
      },
      delivery: "server-log",
    }),
  );

  return { delivered: true, via: "log" };
}
