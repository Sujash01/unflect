"use client";

import { useId, type ReactNode } from "react";

/** Shared field chrome: label, control, hint and error, wired for assistive tech. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-4">
        <span className="text-[0.875rem] font-medium text-bone">
          {label}
          {required ? (
            <span className="ml-1 text-indigo" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-2 text-[0.75rem] font-normal text-muted">Optional</span>
          )}
        </span>
      </label>

      {hint ? (
        <p id={hintId} className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}

      {/* Control sits directly after its label for reliable screen-reader order. */}
      <div className="mt-2.5">{children}</div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-[#ff9b8a]"
        >
          <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 bg-[#ff9b8a]" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared control styling. Border and text both change on error \u2014 never colour alone. */
export function controlClasses(error?: string | boolean): string {
  return [
    "w-full rounded-xl border bg-navy-inset px-4 text-[0.9375rem] text-bone",
    "placeholder:text-muted/70 transition-[border-color,background-color,box-shadow] duration-200",
    "hover:border-line-strong",
    error
      ? "border-[#ff9b8a]/70 focus-visible:border-[#ff9b8a]"
      : "border-line focus-visible:border-indigo/70",
  ].join(" ");
}

/** Single-line input. */
export function TextInput({
  name,
  type = "text",
  value,
  onChange,
  onFocus,
  error,
  placeholder,
  autoComplete,
  inputMode,
}: {
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  error?: string | undefined;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
}) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={error ? true : undefined}
      className={`${controlClasses(error)} h-12`}
    />
  );
}

/** Textarea with a character counter that announces politely. */
export function TextArea({
  name,
  value,
  onChange,
  onFocus,
  error,
  placeholder,
  maxLength,
  rows = 5,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  error?: string | undefined;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}) {
  const counterId = `${name}-count`;

  return (
    <>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={counterId}
        className={`${controlClasses(error)} resize-y py-3.5 leading-relaxed`}
      />
      {maxLength ? (
        <p id={counterId} aria-live="polite" className="label-mono mt-2 text-muted">
          {value.length} / {maxLength}
        </p>
      ) : null}
    </>
  );
}

/** Select control using the native element for maximum mobile reliability. */
export function Select({
  name,
  value,
  onChange,
  onFocus,
  error,
  options,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  error?: string | undefined;
  options: readonly { value: string; label: string }[];
  placeholder: string;
}) {
  const generatedId = useId();
  const selectId = name || generatedId;

  return (
    <div className="relative">
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        aria-invalid={error ? true : undefined}
        className={`${controlClasses(error)} select-chevron h-12 cursor-pointer pr-10 ${
          value ? "text-bone" : "text-muted"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-bone">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
