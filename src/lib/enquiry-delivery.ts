import { describeEnquiry, type EnquiryInput } from "./enquiry";
import { insertRow, isSupabaseConfigured } from "./supabase";

/**
 * Enquiry delivery adapter.
 *
 * Enquiries are stored in Supabase (table `enquiries`, see supabase/schema.sql).
 * Credentials live in `.env.local`. If they are not filled in yet the adapter
 * falls back to a structured server-log line, so the site and the contact form
 * keep working while you are setting things up.
 *
 * The function signature is unchanged, so the route handler and the form need
 * no changes.
 *
 * Notes:
 *   - Provider keys are server-only. Never expose them with NEXT_PUBLIC_.
 *   - Treat enquiries as confidential: they describe a business's weaknesses.
 *   - Message bodies are never written to logs.
 */

export type DeliveryResult =
  | { delivered: true; via: "log" | "database" | "email" | "crm" }
  | { delivered: false; reason: string };

export async function deliverEnquiry(
  enquiry: EnquiryInput,
  reference: string,
): Promise<DeliveryResult> {
  const summary = describeEnquiry(enquiry);

  if (isSupabaseConfigured()) {
    const result = await insertRow("enquiries", {
      reference,
      name: enquiry.name,
      company: enquiry.company,
      email: enquiry.email,
      project_type: enquiry.projectType,
      goal: enquiry.goal,
      problem: enquiry.problem,
      timeline: enquiry.timeline,
      budget: enquiry.budget,
      details: enquiry.details || null,
    });

    if (!result.ok) {
      console.error(
        JSON.stringify({
          event: "project_enquiry_store_failed",
          reference,
          status: result.status,
          detail: result.message,
        }),
      );
      return { delivered: false, reason: "database" };
    }

    console.info(
      JSON.stringify({
        event: "project_enquiry",
        reference,
        receivedAt: summary.receivedAt,
        classification: summary.classification,
        delivery: "supabase",
      }),
    );
    return { delivered: true, via: "database" };
  }

  // Fallback while Supabase credentials are not set: single-line, greppable,
  // free of message bodies.
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
      note: "Supabase not configured; set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
    }),
  );

  return { delivered: true, via: "log" };
}
