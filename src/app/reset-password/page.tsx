import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ResetForm } from "@/components/account/account-forms";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Set new password", robots: { index: false, follow: false }, alternates: { canonical: null } };

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Account recovery" title="Choose a new password.">
      <p className="mb-7 text-sm leading-6 text-muted-strong">
        Use a unique password you don&apos;t reuse elsewhere.
      </p>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8 text-sm text-muted">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo" />
            <span>Loading reset form…</span>
          </div>
        }
      >
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
