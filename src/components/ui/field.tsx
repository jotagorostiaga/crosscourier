"use client";

import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-ui border bg-surface px-4 text-fg placeholder:text-fg-faint " +
  "transition-[border-color,box-shadow] duration-200 " +
  "focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

function FieldShell({
  label,
  help,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  help?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[0.8125rem] font-medium tracking-[0.01em] text-fg"
      >
        {label}
      </label>
      {children}
      {help && !error ? (
        <p className="text-[0.8125rem] text-fg-muted">{help}</p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger"
        >
          <WarningCircleIcon weight="fill" className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  help,
  error,
  className,
  ...props
}: {
  label: string;
  help?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell
      label={label}
      help={help}
      error={error}
      htmlFor={id}
      className={className}
    >
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          controlBase,
          "h-12",
          error ? "border-danger" : "border-line-strong",
        )}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  help,
  error,
  options,
  placeholder,
  className,
  ...props
}: {
  label: string;
  help?: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell
      label={label}
      help={help}
      error={error}
      htmlFor={id}
      className={className}
    >
      <select
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          controlBase,
          "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2356646f%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')]",
          error ? "border-danger" : "border-line-strong",
        )}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextareaField({
  label,
  help,
  error,
  className,
  ...props
}: {
  label: string;
  help?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell
      label={label}
      help={help}
      error={error}
      htmlFor={id}
      className={className}
    >
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          controlBase,
          "min-h-24 resize-y py-3",
          error ? "border-danger" : "border-line-strong",
        )}
      />
    </FieldShell>
  );
}
