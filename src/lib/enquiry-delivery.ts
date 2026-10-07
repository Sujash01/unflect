import { describeEnquiry, getEnquiryOptionLabel, type EnquiryInput } from "./enquiry";
import { insertRow, isSupabaseConfigured } from "./supabase";
import { siteConfig } from "@/config/site";

/**
 * Enquiry delivery adapter.
 *
 * Enquiries are stored in Supabase (table `enquiries`, see supabase/schema.sql).
 * If email credentials (RESEND_API_KEY or POSTMARK_SERVER_TOKEN) are provided,
 * two transactional emails are dispatched:
 *   1. Internal notification to the studio inbox with the complete brief.
 *   2. Transactional receipt to the submitter with their reference code,
 *      summary of requirements, and response timeframe promise.
 *
 * If credentials are not configured yet, the adapter falls back cleanly to
 * a structured server-log line so the site remains fully operational in local dev
 * and preview environments without throwing errors.
 *
 * Notes:
 *   - Provider keys are server-only. Never expose them with NEXT_PUBLIC_.
 *   - Treat enquiries as confidential: message bodies are NEVER written to logs.
 */

export type DeliveryResult =
  | { delivered: true; via: "log" | "database" | "email" | "crm" }
  | { delivered: false; reason: string };

function formatStudioNotification(enquiry: EnquiryInput, reference: string): string {
  const projectTypeLabel = getEnquiryOptionLabel("projectType", enquiry.projectType);
  const timelineLabel = getEnquiryOptionLabel("timeline", enquiry.timeline);
  const budgetLabel = getEnquiryOptionLabel("budget", enquiry.budget);

  return [
    `NEW PROJECT ENQUIRY — ${siteConfig.name}`,
    `Reference: ${reference}`,
    `Received: ${new Date().toUTCString()}`,
    ``,
    `CONTACT DETAILS:`,
    `Name:    ${enquiry.name}`,
    `Company: ${enquiry.company}`,
    `Email:   ${enquiry.email}`,
    ``,
    `PROJECT SPECIFICATIONS:`,
    `Type:     ${projectTypeLabel}`,
    `Timeline: ${timelineLabel}`,
    `Budget:   ${budgetLabel}`,
    ``,
    `PROBLEM (WHAT IS GOING WRONG TODAY):`,
    enquiry.problem,
    ``,
    `GOAL (DESIRED OUTCOME):`,
    enquiry.goal,
    ``,
    `ADDITIONAL CONTEXT:`,
    enquiry.details || "(None provided)",
  ].join("\n");
}

function formatClientReceipt(enquiry: EnquiryInput, reference: string): string {
  const projectTypeLabel = getEnquiryOptionLabel("projectType", enquiry.projectType);
  const timelineLabel = getEnquiryOptionLabel("timeline", enquiry.timeline);
  const budgetLabel = getEnquiryOptionLabel("budget", enquiry.budget);
  const responseWindow = siteConfig.responseWindow.includes("[CONFIRM")
    ? "2 working days"
    : siteConfig.responseWindow;

  return [
    `Hi ${enquiry.name},`,
    ``,
    `Thank you for contacting ${siteConfig.name}. We have received your project enquiry and logged it under reference ${reference}.`,
    ``,
    `WHAT HAPPENS NEXT:`,
    `A person will review your brief against our current engineering capacity and technical fit. We will reply directly to this email within ${responseWindow} with a clear, honest assessment of how we can help.`,
    ``,
    `SUMMARY OF YOUR SUBMISSION:`,
    `Reference:    ${reference}`,
    `Company:      ${enquiry.company}`,
    `Project type: ${projectTypeLabel}`,
    `Timeline:     ${timelineLabel}`,
    `Budget:       ${budgetLabel}`,
    ``,
    `Problem described:`,
    enquiry.problem,
    ``,
    `Desired outcome:`,
    enquiry.goal,
    ``,
    enquiry.details ? `Additional context:\n${enquiry.details}\n` : "",
    `If you have urgent updates or supplementary materials, simply reply to this email with your reference number.`,
    ``,
    `Best regards,`,
    `${siteConfig.name} Studio`,
    siteConfig.url,
  ].filter(Boolean).join("\n");
}

async function dispatchEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const fromEmail = process.env.EMAIL_FROM || "UNFLECT <notifications@unflect.in>";
  const resendKey = process.env.RESEND_API_KEY;
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    });
    return res.ok;
  }

  if (postmarkToken) {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": postmarkToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        From: fromEmail,
        To: options.to,
        Subject: options.subject,
        TextBody: options.text,
        ...(options.replyTo ? { ReplyTo: options.replyTo } : {}),
      }),
    });
    return res.ok;
  }

  return false;
}

export async function deliverEnquiry(
  enquiry: EnquiryInput,
  reference: string,
): Promise<DeliveryResult> {
  const summary = describeEnquiry(enquiry);
  let dbSuccess = false;

  // Step 1: Store in database if Supabase configured
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

    dbSuccess = true;
    console.info(
      JSON.stringify({
        event: "project_enquiry",
        reference,
        receivedAt: summary.receivedAt,
        classification: summary.classification,
        delivery: "supabase",
      }),
    );
  } else {
    // Fallback log when Supabase is not configured
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
  }

  // Step 2: Email dispatch (Studio notification + submitter receipt)
  const hasEmailProvider = Boolean(
    process.env.RESEND_API_KEY || process.env.POSTMARK_SERVER_TOKEN,
  );

  if (hasEmailProvider) {
    try {
      const studioInbox =
        process.env.STUDIO_NOTIFICATION_EMAIL ||
        (!siteConfig.email.includes("[CONFIRM") ? siteConfig.email : "team@unflect.in");

      // Dispatch internal studio notification
      await dispatchEmail({
        to: studioInbox,
        subject: `[${siteConfig.name} Enquiry ${reference}] ${enquiry.name} (${enquiry.company})`,
        text: formatStudioNotification(enquiry, reference),
        replyTo: enquiry.email,
      });

      // Dispatch client receipt
      await dispatchEmail({
        to: enquiry.email,
        subject: `We have received your enquiry [Ref: ${reference}] — ${siteConfig.name}`,
        text: formatClientReceipt(enquiry, reference),
        replyTo: !siteConfig.email.includes("[CONFIRM") ? siteConfig.email : undefined,
      });

      console.info(
        JSON.stringify({
          event: "project_enquiry_email_dispatched",
          reference,
        }),
      );
    } catch (err) {
      // Never fail submission if database write succeeded
      console.error(
        JSON.stringify({
          event: "project_enquiry_email_failed",
          reference,
          error: err instanceof Error ? err.message : "unknown",
        }),
      );
    }
  } else {
    console.info(
      JSON.stringify({
        event: "project_enquiry_email_skipped",
        reference,
        reason: "No email provider configured (RESEND_API_KEY / POSTMARK_SERVER_TOKEN)",
      }),
    );
  }

  return { delivered: true, via: dbSuccess ? "database" : "log" };
}
