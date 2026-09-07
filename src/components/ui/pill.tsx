import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Etiqueta de sección con contorno. Reemplaza al eyebrow suelto cuando la
 * sección necesita un anclaje visual más presente.
 */
export function Pill({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "ink";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-3 text-[0.8125rem] font-medium",
        tone === "light"
          ? "border-line-strong bg-surface text-fg"
          : "border-white/20 bg-white/5 text-on-ink",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-orange" />
      {children}
    </span>
  );
}
