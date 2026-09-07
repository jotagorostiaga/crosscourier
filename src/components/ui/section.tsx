import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "bg" | "surface" | "ink";

/**
 * Ritmo vertical único del sitio. Las secciones no inventan su propio padding.
 * `ink` se reserva para los dos momentos de marca: hero y cierre.
 */
export function Section({
  children,
  className,
  tone = "bg",
  size = "default",
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  size?: "default" | "compact" | "tall";
  id?: string;
  as?: "section" | "div" | "footer" | "header";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative",
        tone === "bg" && "bg-bg text-fg",
        tone === "surface" && "bg-surface text-fg",
        tone === "ink" && "bg-surface-ink text-on-ink",
        size === "compact" && "py-14 md:py-20",
        size === "default" && "py-20 md:py-28",
        size === "tall" && "py-24 md:py-36",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  title,
  body,
  className,
  align = "start",
  tone = "light",
  children,
}: {
  title: ReactNode;
  body?: ReactNode;
  className?: string;
  align?: "start" | "center";
  tone?: "light" | "ink";
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <h2 className="max-w-[20ch] text-title">{title}</h2>
      {body ? (
        <p
          className={cn(
            "max-w-[58ch] text-lead",
            tone === "light" ? "text-fg-muted" : "text-on-ink-muted",
          )}
        >
          {body}
        </p>
      ) : null}
      {children}
    </div>
  );
}
