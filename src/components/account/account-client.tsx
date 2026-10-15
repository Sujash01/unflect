"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      aria-busy={busy ? "true" : undefined}
      onClick={signOut}
      className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-muted transition-all hover:border-bone/40 hover:text-bone active:scale-[0.97] active:brightness-95 disabled:opacity-50 disabled:cursor-wait"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin text-indigo shrink-0" />
      ) : (
        <LogOut className="h-4 w-4 shrink-0" />
      )}
      <span>{busy ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}

export function DataExportLink() {
  const [busy, setBusy] = useState(false);

  async function exportData() {
    setBusy(true);
    try {
      const response = await fetch("/api/account/export", { cache: "no-store" });
      if (!response.ok) return;
      const blob = new Blob([JSON.stringify(await response.json(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unflect-account-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportData}
      disabled={busy}
      aria-busy={busy ? "true" : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm transition-all hover:border-bone/40 active:scale-[0.97] active:brightness-95 disabled:opacity-50 disabled:cursor-wait"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin text-indigo shrink-0" />
      ) : (
        <Download className="h-4 w-4 shrink-0" />
      )}
      <span>{busy ? "Preparing…" : "Export my data"}</span>
    </button>
  );
}

export function ResendVerificationButton({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function resend() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      setMessage(data.message ?? "If the account exists, check your inbox.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={resend}
        disabled={busy}
        aria-busy={busy ? "true" : undefined}
        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-xs text-bone hover:border-bone/40 active:scale-[0.97] active:brightness-95 disabled:opacity-50 disabled:cursor-wait transition-all"
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin text-indigo shrink-0" /> : null}
        <span>{busy ? "Sending…" : "Resend verification"}</span>
      </button>
      {message ? <span className="text-xs text-muted">{message}</span> : null}
    </div>
  );
}
