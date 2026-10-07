import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotForm } from "@/components/account/account-forms";

export const metadata = { title: "Reset password", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default function ForgotPasswordPage() {
  return <AuthShell eyebrow="Account recovery" title="Reset your password."><p className="mb-7 text-sm leading-6 text-muted-strong">Enter your account email and we&apos;ll send a recovery link if an account exists.</p><ForgotForm /><p className="mt-6 text-center text-sm text-muted"><Link href="/login" className="text-bone underline underline-offset-4">Back to sign in</Link></p></AuthShell>;
}
