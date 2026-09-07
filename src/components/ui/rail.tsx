"use client";

import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Riel horizontal a sangre. Las tarjetas siguen alineadas al eje de 1200 del
 * sitio —el padding replica el del contenedor— pero pueden salirse hacia el
 * margen, y ahí se desvanecen contra el fondo en lugar de cortarse en seco.
 *
 * El degradado sólo aparece en desktop: es donde hay margen suficiente para
 * que no se apoye sobre la primera tarjeta.
 */
export function Rail({
  children,
  listRef,
  tone = "surface",
  className,
  label,
}: {
  children: ReactNode;
  listRef?: RefObject<HTMLUListElement | null>;
  /** Fondo de la sección: define el color del degradado de los bordes. */
  tone?: "bg" | "surface";
  className?: string;
  label?: string;
}) {
  const fade = tone === "surface" ? "from-surface" : "from-bg";

  return (
    <div className="relative">
      <ul
        ref={listRef}
        aria-label={label}
        className={cn(
          "cc-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
          "px-6 sm:px-8 lg:px-[max(2.5rem,calc((100%-1200px)/2))]",
          className,
        )}
      >
        {children}
      </ul>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent max-lg:hidden",
          fade,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent max-lg:hidden",
          fade,
        )}
      />
    </div>
  );
}
