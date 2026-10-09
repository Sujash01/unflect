import { requirePageSession } from "@/lib/auth/session";
import { ensureProfile } from "@/lib/auth/data";
import { AccountNav } from "@/components/account/account-nav";
import { ProfileForm } from "@/components/account/account-forms";

export const metadata = { title: "Profile", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default async function ProfilePage() {
  const session = await requirePageSession("/profile");
  const profile = await ensureProfile(session.user.id, session.user.email?.split("@")[0] ?? "");
  return <div className="container-page py-16 sm:py-24"><div className="grid gap-10 lg:grid-cols-[220px_1fr]"><AccountNav /><section className="max-w-2xl"><p className="label-mono text-indigo">Profile</p><h1 className="mt-3 font-display text-display">Make it yours.</h1><p className="mt-4 text-sm leading-6 text-muted-strong">Your profile is private to your account and is separate from project enquiries.</p><div className="mt-10 rounded-2xl border border-line bg-navy-raised p-6 sm:p-8"><ProfileForm initial={{ display_name: profile?.display_name ?? "", bio: profile?.bio ?? "", avatar_url: profile?.avatar_url ?? "" }} /></div></section></div></div>;
}
