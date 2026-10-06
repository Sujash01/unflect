"use client";

import { FormEvent, useEffect, useState } from "react";

type ApiData = {
  message?: string;
  errors?: Record<string, string | null>;
  needsVerification?: boolean;
};

async function requestJson(url: string, init: RequestInit): Promise<{ ok: boolean; status: number; data: ApiData }> {
  try {
    const response = await fetch(url, init);
    const data = (await response.json().catch(() => ({}))) as ApiData;
    return { ok: response.ok, status: response.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { message: "We could not reach the server. Check your connection and try again." },
    };
  }
}

function FormButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center rounded-full bg-indigo px-6 text-sm font-semibold text-indigo-ink transition-all hover:bg-indigo-bright disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-2 h-12 w-full rounded-xl border border-line bg-navy-inset px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-indigo/70"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="mt-2 h-40 max-h-40 w-full resize-none overflow-y-auto rounded-xl border border-line bg-navy-inset px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-indigo/70"
    />
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string | null }) {
  return (
    <label className="block text-sm text-muted-strong">
      <span>{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-[#ff9b8a]">{error}</span> : null}
    </label>
  );
}

function Message({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <p role={error ? "alert" : "status"} className={`mt-4 text-sm ${error ? "text-[#ff9b8a]" : "text-indigo-bright"}`}>
      {text}
    </p>
  );
}

const jsonHeaders = { "Content-Type": "application/json" };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(new URLSearchParams(window.location.search).get("reset") === "1");
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await requestJson("/api/auth/login", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email, password }),
      });
      if (!result.ok) {
        setMessage(result.data.message ?? "We could not sign you in.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/account";
      window.location.assign(safeNext);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-line bg-navy-raised p-6 sm:p-8">
      {reset ? <Message text="Password updated. Sign in with your new password." /> : null}
      <Field label="Email">
        <Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
      </Field>
      <Field label="Password">
        <Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
      </Field>
      {message ? <Message text={message} error /> : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FormButton disabled={busy}>{busy ? "Signing in…" : "Sign in"}</FormButton>
        <a className="text-sm text-muted transition-colors hover:text-bone" href="/forgot-password">Forgot password?</a>
      </div>
    </form>
  );
}

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/.test(password),
  };

  const passwordValid = Object.values(passwordChecks).every(Boolean);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setErrors({});
    try {
      const result = await requestJson("/api/auth/signup", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ name, email, password }),
      });
      if (!result.ok) {
        setErrors(result.data.errors ?? {});
        setMessage(result.data.message ?? Object.values(result.data.errors ?? {}).find(Boolean) ?? "We could not create your account.");
        return;
      }
      if (result.data.needsVerification) setDone(true);
      else window.location.assign("/account");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-navy-raised p-8">
        <p className="label-mono text-indigo">Check your inbox</p>
        <h2 className="mt-4 font-display text-title">Verify your email to continue.</h2>
        <p className="mt-4 text-sm leading-6 text-muted-strong">
          We sent a verification link to <span className="text-bone">{email}</span>. Once confirmed, follow the link back to Unflect.
        </p>
        <a href="/login" className="mt-7 inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm hover:border-bone/40">Back to sign in</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-line bg-navy-raised p-6 sm:p-8">
      <Field label="Name" error={errors.name}>
        <Input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
      </Field>
      <Field label="Email" error={errors.email}>
        <Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
      </Field>
      <Field label="Password" error={errors.password}>
        <Input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
        {password && (
          <div className="mt-3 space-y-2">
            <PasswordCheck label="At least 8 characters" met={passwordChecks.length} />
            <PasswordCheck label="One lowercase letter (a-z)" met={passwordChecks.lowercase} />
            <PasswordCheck label="One uppercase letter (A-Z)" met={passwordChecks.uppercase} />
            <PasswordCheck label="One number (0-9)" met={passwordChecks.number} />
            <PasswordCheck label="One special character (!@#$...)" met={passwordChecks.special} />
          </div>
        )}
      </Field>
      {message ? <Message text={message} error /> : null}
      <FormButton disabled={busy || (password.length > 0 && !passwordValid)}>{busy ? "Creating…" : "Create account"}</FormButton>
      <p className="text-xs leading-5 text-muted">
        By creating an account you agree to the <a className="text-bone underline underline-offset-4" href="/terms">Terms</a> and acknowledge the <a className="text-bone underline underline-offset-4" href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <svg className={`h-4 w-4 ${met ? "text-green-400" : "text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {met ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
        )}
      </svg>
      <span className={met ? "text-bone" : "text-muted"}>{label}</span>
    </div>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError(false);
    try {
      const result = await requestJson("/api/auth/forgot", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email }),
      });
      setMessage(result.data.message ?? "If an account exists, check your inbox.");
      setError(!result.ok);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-line bg-navy-raised p-6 sm:p-8">
      <Field label="Email">
        <Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
      </Field>
      {message ? <Message text={message} error={error} /> : null}
      <FormButton disabled={busy}>{busy ? "Sending…" : "Send recovery email"}</FormButton>
    </form>
  );
}

export function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await requestJson("/api/auth/reset", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ password }),
      });
      if (!result.ok) {
        setMessage(result.data.message ?? "We could not reset your password.");
        return;
      }
      window.location.assign("/login?reset=1");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-line bg-navy-raised p-6 sm:p-8">
      <Field label="New password">
        <Input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
      </Field>
      <Field label="Confirm password">
        <Input type="password" autoComplete="new-password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Repeat your password" />
      </Field>
      {message ? <Message text={message} error /> : null}
      <FormButton disabled={busy}>{busy ? "Updating…" : "Set new password"}</FormButton>
    </form>
  );
}

export function ProfileForm({ initial }: { initial: { display_name: string; bio: string; avatar_url: string } }) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await requestJson("/api/account/profile", {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(values),
      });
      setError(!result.ok);
      setMessage(result.ok ? "Profile saved." : result.data.message ?? "We could not save your profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Field label="Display name"><Input value={values.display_name} onChange={(event) => setValues((current) => ({ ...current, display_name: event.target.value }))} /></Field>
      <Field label="Bio"><Textarea value={values.bio} onChange={(event) => setValues((current) => ({ ...current, bio: event.target.value }))} placeholder="A short line about you." /></Field>
      <Field label="Avatar URL (optional)"><Input type="url" value={values.avatar_url} onChange={(event) => setValues((current) => ({ ...current, avatar_url: event.target.value }))} placeholder="https://…" /></Field>
      {message ? <Message text={message} error={error} /> : null}
      <FormButton disabled={busy}>{busy ? "Saving…" : "Save profile"}</FormButton>
    </form>
  );
}

export function SecurityForms({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);

  const passwordChecks = {
    length: next.length >= 8,
    lowercase: /[a-z]/.test(next),
    uppercase: /[A-Z]/.test(next),
    number: /[0-9]/.test(next),
    special: /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/.test(next),
  };

  const passwordValid = Object.values(passwordChecks).every(Boolean);

  async function passwordSubmit(event: FormEvent) {
    event.preventDefault();
    setPasswordBusy(true);
    setMessage("");
    try {
      const result = await requestJson("/api/account/password", {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setMessage(result.ok ? "Password changed." : result.data.message ?? "We could not change your password.");
      if (result.ok) {
        setCurrent("");
        setNext("");
      }
    } finally {
      setPasswordBusy(false);
    }
  }

  async function emailSubmit(event: FormEvent) {
    event.preventDefault();
    setEmailBusy(true);
    setEmailMessage("");
    try {
      const result = await requestJson("/api/account/email", {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify({ email: newEmail, currentPassword: emailPassword }),
      });
      setEmailMessage(result.data.message ?? (result.ok ? "Check your new email." : "We could not change your email."));
      if (result.ok) {
        setNewEmail("");
        setEmailPassword("");
      }
    } finally {
      setEmailBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <p className="label-mono text-muted">Password</p>
        <form onSubmit={passwordSubmit} className="mt-4 space-y-5">
          <Field label="Current password"><Input type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} required /></Field>
          <Field label="New password">
            <Input type="password" autoComplete="new-password" value={next} onChange={(event) => setNext(event.target.value)} required minLength={8} />
            {next && (
              <div className="mt-3 space-y-2">
                <PasswordCheck label="At least 8 characters" met={passwordChecks.length} />
                <PasswordCheck label="One lowercase letter (a-z)" met={passwordChecks.lowercase} />
                <PasswordCheck label="One uppercase letter (A-Z)" met={passwordChecks.uppercase} />
                <PasswordCheck label="One number (0-9)" met={passwordChecks.number} />
                <PasswordCheck label="One special character (!@#$...)" met={passwordChecks.special} />
              </div>
            )}
          </Field>
          {message ? <Message text={message} error={message !== "Password changed."} /> : null}
          <FormButton disabled={passwordBusy || (next.length > 0 && !passwordValid)}>{passwordBusy ? "Saving…" : "Change password"}</FormButton>
        </form>
      </section>

      <section className="border-t border-line pt-10">
        <p className="label-mono text-muted">Email address</p>
        <p className="mt-3 text-sm text-muted-strong">Current: <span className="text-bone">{email}</span></p>
        <form onSubmit={emailSubmit} className="mt-5 space-y-5">
          <Field label="New email"><Input type="email" autoComplete="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required /></Field>
          <Field label="Current password"><Input type="password" autoComplete="current-password" value={emailPassword} onChange={(event) => setEmailPassword(event.target.value)} required /></Field>
          {emailMessage ? <Message text={emailMessage} error={!emailMessage.startsWith("Check")} /> : null}
          <FormButton disabled={emailBusy}>{emailBusy ? "Updating…" : "Change email"}</FormButton>
        </form>
      </section>
    </div>
  );
}

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const [settings, setSettings] = useState({
    reducedMotion: Boolean(initial.reducedMotion),
    cursorEffects: initial.cursorEffects !== false,
    smoothScroll: initial.smoothScroll !== false,
  });
  const [message, setMessage] = useState("");
  const [busyKey, setBusyKey] = useState<keyof typeof settings | null>(null);

  async function toggle(key: keyof typeof settings) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setBusyKey(key);
    setMessage("");
    const root = document.documentElement;
    root.dataset.reducedMotion = next.reducedMotion ? "true" : "false";
    root.dataset.cursorEffects = next.cursorEffects ? "true" : "false";
    root.dataset.smoothScroll = next.smoothScroll ? "true" : "false";
    window.dispatchEvent(new CustomEvent("unflect:preferences"));

    try {
      const result = await requestJson("/api/account/settings", {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify({ settings: next }),
      });
      if (!result.ok) {
        setSettings(settings);
        root.dataset.reducedMotion = settings.reducedMotion ? "true" : "false";
        root.dataset.cursorEffects = settings.cursorEffects ? "true" : "false";
        root.dataset.smoothScroll = settings.smoothScroll ? "true" : "false";
        window.dispatchEvent(new CustomEvent("unflect:preferences"));
      }
      setMessage(result.ok ? "Settings saved." : result.data.message ?? "We could not save settings.");
    } finally {
      setBusyKey(null);
    }
  }

  const rows = [
    ["reducedMotion", "Reduce motion", "Use calmer transitions and disable decorative motion where possible."],
    ["cursorEffects", "Pointer ambience", "Keep the subtle pointer-responsive atmosphere on capable devices."],
    ["smoothScroll", "Smooth scrolling", "Use the site's enhanced scrolling behavior."],
  ] as const;

  return (
    <div className="space-y-3">
      {rows.map(([key, title, desc]) => (
        <button type="button" key={key} onClick={() => void toggle(key)} disabled={busyKey !== null} className="flex w-full items-center justify-between gap-5 rounded-2xl border border-line bg-navy-raised p-5 text-left transition-colors hover:border-line-strong disabled:cursor-wait disabled:opacity-70">
          <span>
            <span className="block text-sm text-bone">{title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted">{desc}</span>
          </span>
          <span aria-hidden="true" className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${settings[key] ? "border-indigo bg-indigo" : "border-line-strong bg-bone/[0.04]"}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full bg-bone transition-transform ${settings[key] ? "translate-x-6" : "translate-x-1"}`} />
          </span>
        </button>
      ))}
      {message ? <Message text={message} error={!message.startsWith("Settings saved.")} /> : null}
    </div>
  );
}

export function DeleteAccountForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (confirmation !== "DELETE") {
      setMessage("Type DELETE exactly to confirm.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await requestJson("/api/account/delete", {
        method: "DELETE",
        headers: jsonHeaders,
        body: JSON.stringify({ password, confirmation }),
      });
      if (!result.ok) {
        setMessage(result.data.message ?? "We could not delete the account.");
        return;
      }
      window.location.assign("/?account=deleted");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Current password"><Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
      <Field label="Type DELETE to confirm"><Input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" required placeholder="DELETE" /></Field>
      {message ? <Message text={message} error /> : null}
      <button type="submit" disabled={busy} className="inline-flex h-12 items-center justify-center rounded-full border border-[#ff9b8a]/40 px-6 text-sm text-[#ff9b8a] transition-colors hover:bg-[#ff9b8a]/[0.06] disabled:opacity-50">
        {busy ? "Deleting…" : "Delete account permanently"}
      </button>
    </form>
  );
}
