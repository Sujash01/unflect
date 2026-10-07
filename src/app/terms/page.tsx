import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

// Check if legal entity has been confirmed (not containing [CONFIRM placeholder)
const hasConfirmedEntity =
  Boolean(siteConfig.legalEntityName) &&
  !siteConfig.legalEntityName.includes("[CONFIRM");

const entityDescriptor = hasConfirmedEntity
  ? `${siteConfig.name} (${siteConfig.legalEntityName})`
  : siteConfig.name;

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Terms and conditions for using the website and software services of ${entityDescriptor}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-page py-16 sm:py-24 text-bone">
      <article className="max-w-3xl">
        <p className="label-mono text-indigo">Legal</p>
        <h1 className="mt-3 font-display text-display text-bone">
          Terms & Conditions
        </h1>
        <p className="mt-5 font-mono text-xs text-muted">
          Last updated: {siteConfig.lastUpdatedLegal}
        </p>

        <div className="prose-unflect mt-12 space-y-10 text-sm leading-7 text-muted-strong">
          {/* Section 1: Entity & Governing Scope */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              1. About these terms & studio operations
            </h2>
            {/* TODO: Legal Entity Name, Company Registration No, and Jurisdiction — insert when supplied by owner */}
            {hasConfirmedEntity ? (
              <p>
                These terms govern the use of the {siteConfig.domain} website and related account features provided by {siteConfig.name} (Legal Entity: {siteConfig.legalEntityName}, Type: {siteConfig.legalEntityType}, Registration No: {siteConfig.registrationNumber}). Location: {siteConfig.location}. By browsing or using this website, you agree to these terms.
              </p>
            ) : (
              <p>
                These terms govern the use of the {siteConfig.domain} website and related account features provided by {siteConfig.name}, an independent custom software studio operating remote-first. By accessing or using this website, submitting an enquiry, or registering an account, you agree to these terms.
              </p>
            )}
          </section>

          {/* Section 2: Commercial Engagements & Payment Structure */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              2. Commercial engagements & payment structure
            </h2>
            <p>
              Submitting an enquiry or brief via this website does not form a binding contract or obligate {siteConfig.name} to accept a project. Formal software delivery is governed by separate, written Statements of Work (SOW). Unless explicitly amended in a signed contract, our commercial engagements adhere to the following baseline structures:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-strong">
              <li>
                <strong className="text-bone">Small projects:</strong> Single-phase delivery billed 50% upfront as a non-refundable commencement deposit and 50% prior to production go-live or final credential handover.
              </li>
              <li>
                <strong className="text-bone">Medium projects:</strong> 30–40% upfront deposit, followed by milestone tranches invoiced upon demonstration and client acceptance of agreed deliverables.
              </li>
              <li>
                <strong className="text-bone">Large or complex systems:</strong> Initial paid Discovery and Define phase to lock architecture, scope boundaries, and acceptance criteria before build commitments are made.
              </li>
              <li>
                <strong className="text-bone">Recurring support & maintenance:</strong> Billed monthly in advance for continuous monitoring, security patching, dependency upkeep, and agreed support boundaries.
              </li>
            </ul>
          </section>

          {/* Section 3: Scope Commitment & Change Requests */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              3. Scope commitment & change requests
            </h2>
            <p>
              We operate on the principle that <em className="text-bone font-medium">scope is a promise</em>. What is written and agreed in the project specification is what gets built. New requirements, altered assumptions, or design changes requested after scope approval are handled formally through written Change Requests.
            </p>
            <p className="mt-3">
              Each Change Request details the specific impact on cost, architecture, and milestone timeline before any engineering work begins. The client retains full authority to approve the cost/timeline adjustment, swap an equivalent feature within budget, or defer the request to post-launch maintenance.
            </p>
          </section>

          {/* Section 4: Handover & Intellectual Property */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              4. Handover & intellectual property ownership
            </h2>
            <p>
              We build software for clients to run and own. Upon receipt of full and final payment for the project, all rights, title, and interest in bespoke source code, visual designs, database schemas, and documentation created specifically for the project transfer completely to the client.
            </p>
            <p className="mt-3">
              Client accounts (domains, merchant gateways, hosting providers, third-party vendor platforms) remain under client ownership. General-purpose studio tooling, underlying utilities, or third-party open-source libraries integrated into the deliverables remain subject to their respective permissive open-source licenses.
            </p>
          </section>

          {/* Section 5: No Impossible Guarantees */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              5. No impossible guarantees & warranty scope
            </h2>
            <p>
              We do not make impossible guarantees. No software is completely unbreakable, no third-party cloud infrastructure provides 100% uninterrupted availability, and no deadline survives unmanaged scope expansion. We are direct about technical reality rather than offering vague reassurances.
            </p>
            <p className="mt-3">
              We provide a clearly defined warranty period following launch to correct reproducible deviations from the agreed written specification. Warranty coverage does not include new feature development, client-introduced modifications, or outages originating from third-party APIs or infrastructure providers.
            </p>
          </section>

          {/* Section 6: AI Use & Human Accountability */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              6. AI use & human accountability
            </h2>
            <p>
              We use artificial intelligence tools as an engineering capability where they genuinely improve workflow speed and code precision. AI is never a substitute for professional engineering judgement.
            </p>
            <p className="mt-3">
              An experienced human engineer personally reviews every line of code, designs the architecture, implements security controls, tests edge cases, and remains fully accountable for everything we ship.
            </p>
          </section>

          {/* Section 7: Accounts, Security & Acceptable Use */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              7. Accounts & acceptable use
            </h2>
            <p>
              If you register an account on {siteConfig.domain}, you are responsible for maintaining the confidentiality of your sign-in credentials and for all actions taken under your account. You agree not to:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-strong">
              <li>Attempt to bypass authentication, rate limits, or access controls.</li>
              <li>Overload, scrape, or flood server endpoints or enquiry forms.</li>
              <li>Transmit malicious payloads, automated spam, or illegal material.</li>
              <li>Impersonate another individual or company when submitting briefs.</li>
            </ul>
          </section>

          {/* Section 8: Disclaimers & Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              8. Disclaimers & limitation of liability
            </h2>
            <p>
              This website is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. Marketing descriptions and representative scenarios published on the website are informational and do not form binding contractual representations unless incorporated into a formal Statement of Work.
            </p>
            <p className="mt-3">
              To the fullest extent permitted by applicable law, {siteConfig.name} shall not be liable for any indirect, incidental, special, or consequential damages resulting from website downtime, third-party infrastructure outages, or reliance on published content.
            </p>
          </section>

          {/* Section 9: Changes to Terms */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              9. Changes to these terms
            </h2>
            <p>
              We may revise these terms from time to time to reflect operational changes or legal requirements. When updates occur, we update the &quot;Last updated&quot; date at the top of this document. Continued use of the website following published updates signifies your agreement to the revised terms.
            </p>
          </section>

          {/* Section 10: Legal Inquiries & Contact */}
          <section>
            <h2 className="text-lg font-semibold text-bone">
              10. Contact for legal inquiries
            </h2>
            <p>
              For legal inquiries, scope clarifications, or data rights requests, contact us through our{" "}
              <Link
                href="/contact"
                className="text-bone underline underline-offset-2 hover:text-indigo-bright"
              >
                contact page
              </Link>
              {siteConfig.email && !siteConfig.email.includes("[CONFIRM") ? (
                <>
                  {" "}or write directly to{" "}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-bone underline underline-offset-2 hover:text-indigo-bright"
                  >
                    {siteConfig.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>

          {/* Advisory Notice Box */}
          <p className="rounded-2xl border border-line bg-navy-raised p-5 text-xs leading-6 text-muted">
            These terms serve as a website baseline and are not a substitute for bespoke commercial contracts. Have them reviewed by qualified legal counsel prior to relying on them as final business terms for {siteConfig.name}.
          </p>
        </div>
      </article>
    </div>
  );
}
