import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Variant = "primary" | "solid-ink" | "outline" | "outline-ink" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
  "transition-[background-color,color,border-color,transform] duration-200 " +
  "[transition-timing-function:var(--cc-ease)] active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-45";

const variantClasses: Record<Variant, string> = {
  // Naranja de marca con texto ink: 7:1 de contraste. Nunca texto blanco sobre naranja.
  primary: "bg-orange text-ink hover:bg-orange-600",
  "solid-ink": "bg-ink text-on-ink hover:bg-ink-800",
  // En hover pasa al naranja de marca con texto ink: el mismo par de colores
  // del botón principal, así el secundario no inventa un estado propio.
  outline:
    "border border-line-strong bg-transparent text-fg hover:border-orange hover:bg-orange hover:text-ink",
  "outline-ink":
    "border border-white/30 bg-transparent text-on-ink hover:border-white/60 hover:bg-white/5",
  quiet: "bg-surface-2 text-fg hover:bg-line",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    withArrow,
  } = props;

  const classes = cn(base, variantClasses[variant], sizes[size], className);
  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRightIcon weight="bold" className="size-4 shrink-0" aria-hidden />
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const rest = { ...(props as ButtonAsButton) };
  delete rest.variant;
  delete rest.size;
  delete rest.withArrow;
  delete rest.className;
  delete rest.children;

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

export function ArrowLink({
  href,
  children,
  className,
  tone = "light",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "ink";
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.9375rem] font-medium underline-offset-4 hover:underline",
        tone === "light" ? "text-orange-text" : "text-orange",
        className,
      )}
    >
      {children}
      <ArrowRightIcon
        weight="bold"
        aria-hidden
        className="size-4 shrink-0 transition-transform duration-200 [transition-timing-function:var(--cc-ease)] group-hover:translate-x-1"
      />
    </Link>
  );
}
