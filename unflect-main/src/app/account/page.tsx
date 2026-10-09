import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, FolderOpen, Shield, type LucideIcon } from "lucide-react";
import { requirePageSession } from "@/lib/auth/session";
import { ensureProfile, getUserEnquiries } from "@/lib/auth/data";
import { isAdmin } from "@/lib/auth/admin";
import { AccountNav } from "@/components/account/account-nav";
import { DataExportLink, ResendVerificationButton, SignOutButton } from "@/components/account/account-client";

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-raised p-5">
      <Icon className="h-4 w-4 text-indigo" />
      <p className="mt-6 text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-bone">{value}</p>
    </div>
  );
}

export default async function AccountPage() {
  const session = await requirePageSession("/account");
  const profile = await ensureProfile(
    session.user.id,
    session.user.email?.split("@")[0] ?? "",
  );
  const enquiries =
    session.user.email && session.user.email_confirmed_at
      ? await getUserEnquiries(session.user.email)
      : { ok: true as const, data: [] };

  const name = profile?.display_name || session.user.email?.split("@")[0] || "there";
  const userIsAdmin = isAdmin(session.user.email);

  return (
    <div className="container-page py-16 sm:py-24 text-bone">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <AccountNav />

        <div>
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="label-mono text-indigo">Client Portal</p>
              <h1 className="mt-3 font-display text-display text-bone">
                Good to see you, {name}.
              </h1>
              <p className="mt-2 text-sm text-muted-strong">
                Your UNFLECT account lets you track submitted project briefs, manage access credentials, and download your data records.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">{session.user.email}</p>
              {!session.user.email_confirmed_at && session.user.email ? (
                <ResendVerificationButton email={session.user.email} />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {userIsAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo bg-indigo/10 px-4 py-2 text-sm font-medium text-indigo transition-colors hover:bg-indigo/20"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <DataExportLink />
              <SignOutButton />
            </div>
          </div>

          {/* Quick Stats */}
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat
              icon={CheckCircle2}
              label="Account verification"
              value={session.user.email_confirmed_at ? "Verified" : "Pending confirmation"}
            />
            <Stat
              icon={FolderOpen}
              label="Connected enquiries"
              value={String(enquiries.ok ? enquiries.data.length : 0)}
            />
            <Stat
              icon={Clock3}
              label="Member since"
              value={
                session.user.created_at
                  ? new Date(session.user.created_at).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </section>

          {/* Enquiries Section */}
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-mono text-muted">Project history</p>
                <h2 className="mt-2 font-display text-title text-bone">
                  Your enquiries
                </h2>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-bone transition-colors"
              >
                New enquiry <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-navy-raised">
              {!session.user.email_confirmed_at ? (
                <div className="p-6 text-sm leading-6 text-muted">
                  <p className="text-bone font-medium">Email confirmation required</p>
                  <p className="mt-1 text-xs text-muted">
                    To protect confidential project details, enquiries are linked only after verifying your email address. Check your inbox for the confirmation link.
                  </p>
                </div>
              ) : !enquiries.ok || enquiries.data.length === 0 ? (
                <p className="p-6 text-sm leading-6 text-muted">
                  No enquiries are connected to this account yet. When you submit a project brief using{" "}
                  <span className="font-mono text-xs text-bone">{session.user.email}</span>, it will appear here with its status and reference code.
                </p>
              ) : (
                enquiries.data.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 border-b border-line p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-mono text-xs text-indigo">
                        Ref: {item.reference}
                      </p>
                      <p className="mt-1 text-sm font-medium text-bone">
                        {item.company}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {item.project_type} · {item.timeline} · Budget: {item.budget}
                      </p>
                    </div>
                    <span className="w-fit rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted-strong">
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
