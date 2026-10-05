"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, LogOut } from "lucide-react";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return <button type="button" disabled={busy} onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-muted transition-colors hover:border-bone/40 hover:text-bone disabled:opacity-50"><LogOut className="h-4 w-4" />{busy ? "Signing out…" : "Sign out"}</button>;
}

export function DataExportLink() {
  const [busy, setBusy] = useState(false);
  async function exportData() {
    setBusy(true);
    try {
      const response = await fetch("/api/account/export", { cache: "no-store" });
      if (!response.ok) return;
      const blob = new Blob([JSON.stringify(await response.json(), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `unflect-account-export-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  }
  return <button type="button" onClick={exportData} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm transition-colors hover:border-bone/40 disabled:opacity-50"><Download className="h-4 w-4" />{busy ? "Preparing…" : "Export my data"}</button>;
}


export function ResendVerificationButton({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function resend() {
    setBusy(true);
    const response = await fetch("/api/auth/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json().catch(() => ({}));
    setMessage(data.message ?? "If the account exists, check your inbox.");
    setBusy(false);
  }
  return <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={resend} disabled={busy} className="rounded-full border border-line-strong px-4 py-2 text-xs text-bone hover:border-bone/40 disabled:opacity-50">{busy ? "Sending…" : "Resend verification"}</button>{message ? <span className="text-xs text-muted">{message}</span> : null}</div>;
}
