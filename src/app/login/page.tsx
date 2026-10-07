import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/account/account-forms";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function LoginPage() {
  return (
    <AuthShell eyebrow="UNFLECT account" title="Welcome back.">
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-2xl border border-line bg-navy-raised" />
        }
      >
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-muted">
        New to Unflect?{" "}
        <Link href="/signup" className="text-bone underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
