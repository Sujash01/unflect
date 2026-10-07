import { AuthShell } from "@/components/auth-shell";
import { ResetForm } from "@/components/account/account-forms";

export const metadata = { title: "Set new password", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default function ResetPasswordPage() {
  return <AuthShell eyebrow="Account recovery" title="Choose a new password."><p className="mb-7 text-sm leading-6 text-muted-strong">Use a unique password you don&apos;t reuse elsewhere.</p><ResetForm /></AuthShell>;
}
