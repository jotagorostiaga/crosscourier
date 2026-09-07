"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Cada pregunta es una tarjeta propia y no una fila de una lista: el bloque se
 * lee como una pila de piezas tocables, que en mobile es lo que importa. Sólo
 * una queda abierta a la vez para que la respuesta no compita con las demás.
 */
export function Accordion({
  items,
  className,
  tone = "bg",
}: {
  items: AccordionItem[];
  className?: string;
  /** Fondo de la sección: define el color de la tarjeta para que contraste. */
  tone?: "bg" | "surface";
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div
            key={item.id}
            data-faq-card
            data-open={expanded}
            className={cn(
              "cc-faq-card rounded-panel",
              tone === "bg" ? "bg-surface" : "bg-bg",
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left md:px-6"
              >
                <span className="font-display text-[1.0625rem] font-medium tracking-[-0.01em] text-fg md:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  data-faq-caret
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center text-fg-muted transition-transform duration-300 [transition-timing-function:var(--cc-ease)]",
                    expanded && "rotate-180",
                  )}
                >
                  <CaretDownIcon weight="bold" className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              hidden={!expanded}
              className="cc-fade px-5 pb-6 md:px-6"
            >
              <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
