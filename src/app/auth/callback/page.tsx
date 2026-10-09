"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing secure sign-in…");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    if (window.location.hash) window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
    const next = new URLSearchParams(window.location.search).get("next") ?? "/account";
    if (!accessToken || !refreshToken) {
      setTimeout(() => {
        setMessage("This authentication link is missing its session. Please request a new one.");
      }, 0);
      return;
    }
    fetch("/api/auth/callback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken, next }) })
      .then(async (response) => { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message ?? "Authentication failed."); router.replace(typeof data.next === "string" ? data.next : "/account"); })
      .catch((error: Error) => setMessage(error.message));
  }, [router]);
  return <AuthShell eyebrow="Authentication" title="One moment."><p className="rounded-2xl border border-line bg-navy-raised p-6 text-sm leading-6 text-muted-strong">{message}</p></AuthShell>;
}
