import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "@/components/account/account-forms";

export const metadata = { title: "Create account", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default function SignupPage() {
  return <AuthShell eyebrow="UNFLECT account" title="Create your account."><SignupForm /><p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/login" className="text-bone underline underline-offset-4">Sign in</Link></p></AuthShell>;
}
