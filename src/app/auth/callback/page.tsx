"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("Completing secure sign-in…");
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    async function processCallback() {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const next = search.get("next") ?? hash.get("next") ?? "/account";
      setIsRecovery(next.includes("reset-password"));

      // Check for errors returned by Supabase
      const errorDesc =
        search.get("error_description") ||
        hash.get("error_description") ||
        search.get("error") ||
        hash.get("error");

      if (errorDesc) {
        const cleanError = errorDesc.replace(/\+/g, " ");
        const isExpired = cleanError.toLowerCase().includes("expired") || cleanError.toLowerCase().includes("invalid");
        setMessage(
          isExpired
            ? "This authentication link has expired or has already been used. Please request a new one."
            : cleanError
        );
        setStatus("error");
        return;
      }

      const accessToken = hash.get("access_token") || search.get("access_token");
      const refreshToken = hash.get("refresh_token") || search.get("refresh_token") || "";
      const tokenHash = search.get("token_hash") || hash.get("token_hash");
      const code = search.get("code") || hash.get("code");
      const type = search.get("type") || hash.get("type") || (next.includes("reset-password") ? "recovery" : "signup");

      if (window.location.hash) {
        window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
      }

      if (!accessToken && !tokenHash && !code) {
        setMessage("This authentication link is missing required session parameters. Please request a new one.");
        setStatus("error");
        return;
      }

      const payload: Record<string, string> = { next };
      if (accessToken) {
        payload.access_token = accessToken;
        payload.refresh_token = refreshToken;
      } else if (tokenHash) {
        payload.token_hash = tokenHash;
        payload.type = type;
      } else if (code) {
        payload.code = code;
      }

      try {
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message ?? "Authentication failed.");
        }
        const target = typeof data.next === "string" ? data.next : "/account";
        window.location.replace(target);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Authentication failed.");
        setStatus("error");
      }
    }

    void processCallback();
  }, []);

  return (
    <AuthShell eyebrow="Authentication" title={status === "loading" ? "One moment." : "Authentication issue"}>
      <div className="rounded-2xl border border-line bg-navy-raised p-6 sm:p-8">
        {status === "loading" ? (
          <div className="flex items-center gap-3 text-sm text-muted-strong">
            <Loader2 className="h-5 w-5 animate-spin text-indigo" />
            <span>{message}</span>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm leading-6 text-[#ff9b8a]">{message}</p>
            <div className="flex flex-wrap gap-3">
              {isRecovery ? (
                <Link
                  href="/forgot-password"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-indigo px-5 text-sm font-semibold text-indigo-ink hover:bg-indigo-bright"
                >
                  Request a new reset link
                </Link>
              ) : null}
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-bone hover:border-bone/50"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
