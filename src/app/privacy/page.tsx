import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

const hasConfirmedEntity =
  Boolean(siteConfig.legalEntityName) &&
  !siteConfig.legalEntityName.includes("[CONFIRM");

const entityDescriptor = hasConfirmedEntity
  ? `${siteConfig.name} (${siteConfig.legalEntityName})`
  : siteConfig.name;

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy and data handling information for ${entityDescriptor}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 sm:py-24 text-bone">
      <article className="max-w-3xl">
        <p className="label-mono text-indigo">Legal</p>
        <h1 className="mt-3 font-display text-display text-bone">
          Privacy Policy
        </h1>
        <p className="mt-5 font-mono text-xs text-muted">
          Last updated: {siteConfig.lastUpdatedLegal}
        </p>

        <div className="prose-unflect mt-12 space-y-10 text-sm leading-7 text-muted-strong">
          <section>
            <h2 className="text-lg font-semibold text-bone">
              1. Operating Entity & Location
            </h2>
            {/* TODO: Legal Entity Name, Company Registration No, and Jurisdiction — insert when supplied by owner */}
            {!siteConfig.legalEntityName.includes("[CONFIRM") ? (
              <p>
                This website ({siteConfig.domain}) is operated by {siteConfig.name} (Legal Entity: {siteConfig.legalEntityName}, Type: {siteConfig.legalEntityType}, Registration No: {siteConfig.registrationNumber}). Location: {siteConfig.location}. Studio address: {siteConfig.publicAddress}.
              </p>
            ) : (
              <p>
                This website ({siteConfig.domain}) is operated by {siteConfig.name}, an independent custom software studio operating remote-first. For legal and privacy inquiries, reach out through our contact channels.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              2. What we collect
            </h2>
            <p>
              Depending on how you use {siteConfig.domain}, we may receive account information such as your name, email address, profile details, authentication records, account settings, and security events. If you submit a project enquiry, we collect the information you choose to provide in that form, including your name, company, email address, and project requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              3. Why we use it
            </h2>
            <p>
              We use information to provide account access, authenticate users, recover accounts, respond to enquiries, operate and secure the website, prevent abuse, maintain operational records, and deliver requested software services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              4. Project enquiries
            </h2>
            <p>
              Project enquiries are stored as confidential business communications. If you create an account, the account dashboard displays only enquiries whose submitted email address matches your confirmed account email. An account does not grant access to another party’s enquiries.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              5. Service providers
            </h2>
            <p>
              We rely on trusted infrastructure providers including Supabase for authentication and database hosting, as well as production hosting providers (e.g. Vercel) necessary to operate the site. Those providers process data under their respective security and privacy commitments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              6. Cookies & authentication storage
            </h2>
            <p>
              Authentication relies on secure, httpOnly session cookies so access tokens are never exposed in browser local storage. We do not use third-party advertising or cross-site tracking cookies. Functional storage is used solely for interface preferences (such as light/dark mode and motion preferences).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              7. Security measures
            </h2>
            <p>
              We enforce server-side validation, database Row Level Security (RLS), rate limiting, encrypted transport (HTTPS), and secure cookies. No internet service can guarantee absolute security, but we design controls to match the risk level of our systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              8. Retention & account deletion
            </h2>
            <p>
              You can request account deletion through Settings. Deleting an account removes profile records and authentication credentials. Project enquiries and related business records are retained only as required for legitimate accounting, tax, fraud-prevention, or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              9. Your rights
            </h2>
            <p>
              You can update profile information, change your password, request an account data export, or delete your account from the account area. Depending on applicable data-protection laws, you may also have rights to access, rectify, restrict, or object to processing of personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              10. Changes to this policy
            </h2>
            <p>
              We may update this policy as website architecture or legal obligations evolve. The revision date above indicates the effective version.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-bone">
              11. Contact for privacy inquiries
            </h2>
            <p>
              For privacy-related questions, data export requests, or rights exercising, contact us directly via our{" "}
              <Link
                href="/contact"
                className="text-bone underline underline-offset-2 hover:text-indigo-bright"
              >
                contact page
              </Link>
              {!siteConfig.privacyEmail.includes("[CONFIRM") ? (
                <>
                  {" "}or by email at{" "}
                  <a
                    href={`mailto:${siteConfig.privacyEmail}`}
                    className="text-bone underline underline-offset-2 hover:text-indigo-bright"
                  >
                    {siteConfig.privacyEmail}
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>

          <p className="rounded-2xl border border-line bg-navy-raised p-5 text-xs leading-6 text-muted">
            This policy is a practical starting baseline based on the current website architecture and should be reviewed by qualified legal counsel for the jurisdictions in which {siteConfig.name} operates.
          </p>
        </div>
      </article>
    </div>
  );
}
