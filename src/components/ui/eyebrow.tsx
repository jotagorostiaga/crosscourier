import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Etiqueta de sección. Se usa con criterio: como máximo una cada tres
 * secciones, para que el ritmo de la página no se vuelva plantilla.
 *
 * Va en el naranja de marca, que es el color con el que el sitio marca los
 * detalles chicos —contadores, etiquetas, roles— tanto en claro como en ink.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
