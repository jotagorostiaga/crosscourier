"use client";

import { useId } from "react";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export type OptionCardItem<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

/**
 * Grupo de opciones con área de toque grande. Un radio nativo por opción:
 * navegable con teclado y anunciado como grupo por lectores de pantalla.
 */
export function OptionCards<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  columns = 1,
  error,
  compact,
}: {
  name: string;
  legend: string;
  options: OptionCardItem<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
  error?: string;
  compact?: boolean;
}) {
  const groupId = useId();

  return (
    <fieldset className="@container min-w-0">
      <legend className="sr-only">{legend}</legend>
      {/* Las columnas responden al ancho del contenedor, no del viewport: el
          mismo flujo vive en el hero angosto y en la página de cotización. */}
      <div
        className={cn(
          "grid gap-2.5",
          columns === 2 && "@[30rem]:grid-cols-2",
          columns === 3 && "@[26rem]:grid-cols-2 @[44rem]:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const id = `${groupId}-${option.value}`;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-ui border px-4 transition-colors duration-200",
                compact ? "py-3" : "py-3.5",
                selected
                  ? "border-ink bg-surface shadow-cc-sm"
                  : "border-line-strong bg-surface/60 hover:border-ink-600 hover:bg-surface",
                "active:translate-y-px",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange",
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                  selected
                    ? "border-orange bg-orange text-ink"
                    : "border-line-strong bg-transparent text-transparent",
                )}
              >
                <CheckIcon
                  key={selected ? "on" : "off"}
                  weight="bold"
                  className={cn("size-3", selected && "cc-pop")}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-medium text-fg">
                  {option.label}
                </span>
                {option.hint ? (
                  <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">
                    {option.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[0.8125rem] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
