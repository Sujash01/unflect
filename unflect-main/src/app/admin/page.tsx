import { redirect } from "next/navigation";
import { Database, Users, Activity, FileText } from "lucide-react";
import { requirePageSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
import { getAllEnquiries, getAllProfiles, getAllAccountEvents } from "@/lib/admin/data";
import { AdminNav } from "@/components/admin/admin-nav";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import { ProfilesTable } from "@/components/admin/profiles-table";
import { EventsTable } from "@/components/admin/events-table";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default async function AdminPage() {
  const session = await requirePageSession("/admin");
  
  if (!isAdmin(session.user.email)) {
    redirect("/account");
  }

  const [enquiriesResult, profilesResult, eventsResult] = await Promise.all([
    getAllEnquiries(),
    getAllProfiles(),
    getAllAccountEvents(),
  ]);

  const enquiries = enquiriesResult.ok ? enquiriesResult.data : [];
  const profiles = profilesResult.ok ? profilesResult.data : [];
  const events = eventsResult.ok ? eventsResult.data : [];

  // Calculate stats
  const stats = {
    totalEnquiries: enquiries.length,
    totalProfiles: profiles.length,
    totalEvents: events.length,
    newEnquiries: enquiries.filter(e => e.status === 'new').length,
  };

  return (
    <div className="container-page py-8 sm:py-16 lg:py-24 text-bone">
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-[220px_1fr]">
        <AdminNav />

        <div>
          {/* Header */}
          <div className="border-b border-line pb-6 sm:pb-8">
            <p className="label-mono text-indigo">Admin Panel</p>
            <h1 className="mt-2 sm:mt-3 font-display text-2xl sm:text-display text-bone">
              System Overview
            </h1>
            <p className="mt-2 text-sm text-muted-strong">
              Manage enquiries, user accounts, and system data.
            </p>
          </div>

          {/* Quick Stats */}
          <section className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-line bg-navy-raised p-4 sm:p-5">
              <FileText className="h-4 w-4 text-indigo" />
              <p className="mt-4 sm:mt-6 text-xs text-muted">Total Enquiries</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-bone">{stats.totalEnquiries}</p>
              {stats.newEnquiries > 0 && (
                <p className="mt-1 text-xs text-indigo">{stats.newEnquiries} new</p>
              )}
            </div>
            <div className="rounded-2xl border border-line bg-navy-raised p-4 sm:p-5">
              <Users className="h-4 w-4 text-indigo" />
              <p className="mt-4 sm:mt-6 text-xs text-muted">User Accounts</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-bone">{stats.totalProfiles}</p>
            </div>
            <div className="rounded-2xl border border-line bg-navy-raised p-4 sm:p-5">
              <Activity className="h-4 w-4 text-indigo" />
              <p className="mt-4 sm:mt-6 text-xs text-muted">Account Events</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-bone">{stats.totalEvents}</p>
            </div>
            <div className="rounded-2xl border border-line bg-navy-raised p-4 sm:p-5">
              <Database className="h-4 w-4 text-indigo" />
              <p className="mt-4 sm:mt-6 text-xs text-muted">Database Status</p>
              <p className="mt-1 text-sm font-medium text-bone">Connected</p>
            </div>
          </section>

          {/* Enquiries Section */}
          <section className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="label-mono text-muted">Project enquiries</p>
                <h2 className="mt-2 font-display text-xl sm:text-title text-bone">
                  All Enquiries
                </h2>
              </div>
            </div>
            <div className="mt-4 sm:mt-5">
              <EnquiriesTable enquiries={enquiries} />
            </div>
          </section>

          {/* Profiles Section */}
          <section className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="label-mono text-muted">User management</p>
                <h2 className="mt-2 font-display text-xl sm:text-title text-bone">
                  User Profiles
                </h2>
              </div>
            </div>
            <div className="mt-4 sm:mt-5">
              <ProfilesTable profiles={profiles} />
            </div>
          </section>

          {/* Events Section */}
          <section className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="label-mono text-muted">Audit log</p>
                <h2 className="mt-2 font-display text-xl sm:text-title text-bone">
                  Recent Events
                </h2>
              </div>
            </div>
            <div className="mt-4 sm:mt-5">
              <EventsTable events={events} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
