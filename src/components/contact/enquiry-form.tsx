"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "./field";
import { analytics } from "@/lib/analytics";
import {
  enquiryFields,
  fieldLabels,
  validateEnquiry,
  HONEYPOT_FIELD,
  type EnquiryFieldName,
  type EnquiryInput,
} from "@/lib/enquiry";
import { emptyEnquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const TEXT_LIMITS = { goal: 2000, problem: 2000, details: 2000 } as const;

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryInput>(emptyEnquiry);
  const [errors, setErrors] = useState<Partial<Record<EnquiryFieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const setField = useCallback(
    (field: EnquiryFieldName) =>
      (value: string) => {
        if (!startedRef.current) {
          startedRef.current = true;
          analytics.formStart(field);
        }
        setValues((current) => ({ ...current, [field]: value }));
        // Clear a field's error as soon as the user edits it.
        setErrors((current) => {
          if (!current[field]) return current;
          const next = { ...current };
          delete next[field];
          return next;
        });
      },
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    analytics.formSubmitAttempt();
    setFormError(null);

    const payload = {
      ...values,
      [HONEYPOT_FIELD]: (
        document.querySelector<HTMLInputElement>(`#${HONEYPOT_FIELD}`)
      )?.value ?? "",
    };

    const result = validateEnquiry(payload);

    if (!result.ok) {
      setErrors(result.errors);
      analytics.formSubmitError(Object.keys(result.errors), "validation");
      // Move focus to the first invalid control.
      const firstField = Object.keys(result.errors)[0];
      const element = formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`);
      element?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const serverErrors =
          data && typeof data === "object" && "errors" in data && data.errors
            ? (data.errors as Partial<Record<EnquiryFieldName, string>>)
            : {};
        if (Object.keys(serverErrors).length > 0) setErrors(serverErrors);
        setStatus("error");
        setFormError(
          response.status === 429
            ? "Too many submissions from this connection. Please try again shortly."
            : "Something went wrong sending your enquiry. Please try again in a moment.",
        );
        analytics.formSubmitError(Object.keys(serverErrors), "server");
        return;
      }

      const ref =
        data && typeof data === "object" && "reference" in data && typeof data.reference === "string"
          ? data.reference
          : null;

      setReference(ref);
      setStatus("success");
      setValues(emptyEnquiry);
      analytics.formSubmitSuccess({
        reference: ref ?? "unknown",
        projectType: result.value.projectType,
        timeline: result.value.timeline,
        budget: result.value.budget,
      });
      // Move the announcement into view for keyboard and screen-reader users.
      requestAnimationFrame(() => summaryRef.current?.focus());
    } catch {
      setStatus("error");
      setFormError(
        "We could not reach the server. Please check your connection and try again.",
      );
      analytics.formSubmitError([], "network");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={summaryRef}
        tabIndex={-1}
        className="relative overflow-hidden rounded-2xl border border-line bg-navy-raised p-7 sm:p-10"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/60 to-transparent opacity-80"
        />
        <p className="label-mono flex items-center gap-2.5 text-indigo">
          Enquiry received
        </p>
        <h2 className="mt-6 font-display text-display">
          Thank you. We have what we need.
        </h2>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-strong">
          Your enquiry has been recorded. Someone will read it properly and reply
          with a considered response — not an autoresponder.
        </p>
        {reference ? (
          <p className="mt-6 border-y border-line py-4 text-[0.875rem] text-muted">
            Your reference:{" "}
            <span className="font-mono text-bone">{reference}</span>
          </p>
        ) : null}
        <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted-strong">
          We will review the brief and reply with a considered next step. If you need
          to follow up, keep your reference number handy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStatus("idle");
              setReference(null);
              setFormError(null);
              startedRef.current = false;
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-2xl border border-line bg-navy-raised p-6 sm:p-8 lg:p-10"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/60 to-transparent opacity-80"
      />
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-title">Project enquiry</h2>
        <p className="label-mono text-muted">
          {status === "submitting" ? "Sending" : "All fields required unless marked"}
        </p>
      </div>

      {formError ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-md border border-[#ff9b8a]/40 bg-[#ff9b8a]/[0.06] p-4 text-[0.875rem] leading-relaxed text-[#ff9b8a]"
        >
          <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 bg-[#ff9b8a]" />
          {formError}
        </p>
      ) : null}

      <div className="mt-8 space-y-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label={fieldLabels.name} htmlFor="name" error={errors.name} required>
            <TextInput
              name="name"
              value={values.name}
              onChange={setField("name")}
              onFocus={() => analytics.formStart("name")}
              error={errors.name}
              autoComplete="name"
              placeholder="Jane Okafor"
            />
          </Field>

          <Field label={fieldLabels.company} htmlFor="company" error={errors.company} required>
            <TextInput
              name="company"
              value={values.company}
              onChange={setField("company")}
              error={errors.company}
              autoComplete="organization"
              placeholder="Company name"
            />
          </Field>
        </div>

        <Field label={fieldLabels.email} htmlFor="email" error={errors.email} required>
          <TextInput
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={setField("email")}
            error={errors.email}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </Field>

        <Field label={fieldLabels.projectType} htmlFor="projectType" error={errors.projectType} required>
          <Select
            name="projectType"
            value={values.projectType}
            onChange={setField("projectType")}
            error={errors.projectType}
            options={enquiryFields.projectType}
            placeholder="Select the closest match"
          />
        </Field>

        <Field
          label={fieldLabels.problem}
          htmlFor="problem"
          hint="The most useful part of this form. What is going wrong today, and what is it costing you?"
          error={errors.problem}
          required
        >
          <TextArea
            name="problem"
            value={values.problem}
            onChange={setField("problem")}
            error={errors.problem}
            maxLength={TEXT_LIMITS.problem}
            placeholder="Our order process runs through three spreadsheets and a shared inbox. It works until volume picks up, then we start double-checking everything by hand."
          />
        </Field>

        <Field
          label={fieldLabels.goal}
          htmlFor="goal"
          hint="What should exist that does not now?"
          error={errors.goal}
          required
        >
          <TextArea
            name="goal"
            value={values.goal}
            onChange={setField("goal")}
            error={errors.goal}
            maxLength={TEXT_LIMITS.goal}
            placeholder="A single system where orders, stock and customer records agree with each other, and where the team can see status without asking anyone."
          />
        </Field>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field label={fieldLabels.timeline} htmlFor="timeline" error={errors.timeline} required>
            <Select
              name="timeline"
              value={values.timeline}
              onChange={setField("timeline")}
              error={errors.timeline}
              options={enquiryFields.timeline}
              placeholder="Select a range"
            />
          </Field>

          <Field
            label={fieldLabels.budget}
            htmlFor="budget"
            hint="An honest range helps us give a realistic answer."
            error={errors.budget}
            required
          >
            <Select
              name="budget"
              value={values.budget}
              onChange={setField("budget")}
              error={errors.budget}
              options={enquiryFields.budget}
              placeholder="Select a range"
            />
          </Field>
        </div>

        <Field
          label={fieldLabels.details}
          htmlFor="details"
          hint="Existing systems, constraints, internal approvals, or anything else that matters."
          error={errors.details}
        >
          <TextArea
            name="details"
            value={values.details}
            onChange={setField("details")}
            error={errors.details}
            maxLength={TEXT_LIMITS.details}
            rows={4}
            placeholder="We already pay for a CRM that does not talk to our fulfilment software, and we cannot move off it until the contract ends in March."
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Website</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          className="h-0 w-0 border-0 p-0 text-transparent"
        />
      </div>

      <div className="mt-9 flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[0.8125rem] leading-relaxed text-muted">
          Your enquiry is used to respond to you and nothing else. We do not sell
          or share contact details.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className={cn("shrink-0", status === "submitting" && "cursor-wait opacity-70")}
        >
          {status === "submitting" ? "Sending enquiry\u2026" : "Start a project"}
        </Button>
      </div>
    </form>
  );
}
