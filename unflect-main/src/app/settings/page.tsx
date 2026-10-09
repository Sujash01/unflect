import { requirePageSession } from "@/lib/auth/session";
import { ensureProfile } from "@/lib/auth/data";
import { AccountNav } from "@/components/account/account-nav";
import { DeleteAccountForm, SecurityForms, SettingsForm } from "@/components/account/account-forms";

export const metadata = { title: "Settings", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default async function SettingsPage() {
  const session = await requirePageSession("/settings");
  const profile = await ensureProfile(session.user.id, session.user.email?.split("@")[0] ?? "");
  return <div className="container-page py-16 sm:py-24"><div className="grid gap-10 lg:grid-cols-[220px_1fr]"><AccountNav /><section className="max-w-3xl"><p className="label-mono text-indigo">Settings</p><h1 className="mt-3 font-display text-display">Control the details.</h1><div className="mt-10 space-y-12"><section><h2 className="font-display text-title">Experience</h2><p className="mt-2 mb-5 text-sm text-muted">These preferences are stored with your account.</p><SettingsForm initial={profile?.settings ?? {}} /></section><section className="border-t border-line pt-12"><h2 className="font-display text-title">Security</h2><p className="mt-2 mb-7 text-sm text-muted">Keep your sign-in details current.</p><SecurityForms email={session.user.email ?? ""} /></section><section className="border-t border-line pt-12"><h2 className="font-display text-title text-[#ff9b8a]">Danger zone</h2><p className="mt-2 mb-7 text-sm text-muted">Account deletion is permanent. Your profile and account activity are removed; project enquiries already submitted to Unflect may be retained as business records.</p><div className="rounded-2xl border border-[#ff9b8a]/20 bg-[#ff9b8a]/[0.03] p-6"><DeleteAccountForm /></div></section></div></section></div></div>;
}
