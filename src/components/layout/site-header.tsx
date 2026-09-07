"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRightIcon,
  CaretDownIcon,
  ListIcon,
  MagnifyingGlassIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { media } from "@/lib/media";
import { ctaEvents } from "@/lib/quote/analytics";
import { flatNav, navGroups, routes, whatsappHref } from "@/lib/site";
import type { NavGroup } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Header en dos estados. En reposo es una pastilla de vidrio flotando sobre el
 * contenido; al hacer scroll —o al abrir un menú— se estira de punta a punta.
 * La transición vive en `globals.css` (`.cc-headbar`): acá sólo se decide el
 * estado, así el mismo markup sirve en el sitio y en el preview estático.
 *
 * Los tres paneles están siempre montados y se ocultan con `hidden`: los
 * enlaces siguen siendo rastreables y no hay parpadeo al alternar secciones.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Al cambiar de ruta los menús se cierran, ajustado durante el render para no
  // encadenar un segundo ciclo con un efecto.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenGroup(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenGroup(null);
      setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 160);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const menuOpen = openGroup !== null;

  return (
    <header
      data-scrolled={scrolled}
      // Con cualquier menú abierto la pastilla se vuelve opaca: si no, el velo
      // que difumina la página se ve a través de ella.
      data-menu={menuOpen || mobileOpen ? "open" : "closed"}
      className="pointer-events-none sticky top-0 z-50 h-(--cc-header-h)"
    >
      {/* Velo que desenfoca la página: el menú pasa a primer plano. */}
      <div
        aria-hidden
        hidden={!menuOpen}
        onClick={() => setOpenGroup(null)}
        onMouseEnter={scheduleClose}
        className="cc-headscrim pointer-events-auto fixed inset-0 max-xl:hidden"
      />

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="cc-headbar pointer-events-auto" onMouseLeave={scheduleClose}>
        <div className="cc-headbar-inner flex h-full items-center justify-between gap-3 sm:gap-4">
          <div className="flex h-full items-center gap-5">
            <Logo priority />

            <nav aria-label="Principal" className="hidden h-full xl:block">
              <ul className="flex h-full items-center gap-0.5">
                {navGroups.map((group) => {
                  const open = openGroup === group.href;
                  return (
                    <li
                      key={group.href}
                      className="flex h-full items-center"
                      onMouseEnter={() => {
                        cancelClose();
                        setOpenGroup(group.href);
                      }}
                    >
                      <button
                        type="button"
                        data-nav-trigger
                        aria-expanded={open}
                        aria-haspopup="true"
                        aria-controls={`nav-panel-${group.label.toLowerCase()}`}
                        onClick={() => setOpenGroup(open ? null : group.href)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                          open
                            ? "bg-surface-2 text-fg"
                            : pathname.startsWith(group.href)
                              ? "text-fg"
                              : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                        )}
                      >
                        {group.label}
                        <CaretDownIcon
                          weight="bold"
                          aria-hidden
                          className={cn(
                            "size-3 transition-transform duration-300 [transition-timing-function:var(--cc-ease)]",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
                {flatNav.map((link) => (
                  <li key={link.href} onMouseEnter={scheduleClose}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:bg-surface-2 hover:text-fg",
                        pathname === link.href ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link
              href={routes.tracking}
              onClick={() => ctaEvents.tracking("header")}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg max-lg:hidden"
            >
              <MagnifyingGlassIcon weight="bold" className="size-4" aria-hidden />
              Seguir mi envío
            </Link>
            <Button
              href={routes.quote}
              size="md"
              className="max-sm:hidden"
            >
              Cotizá tu envío
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex size-11 items-center justify-center rounded-full text-fg transition-colors duration-200 hover:bg-surface-2 xl:hidden"
            >
              {mobileOpen ? (
                <XIcon weight="bold" className="size-5" aria-hidden />
              ) : (
                <ListIcon weight="bold" className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Paneles: bajan desde la barra, de punta a punta. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 hidden xl:block"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {navGroups.map((group) => (
          <MegaPanel
            key={group.href}
            group={group}
            hidden={openGroup !== group.href}
            onNavigate={() => setOpenGroup(null)}
          />
        ))}
      </div>
    </header>
  );
}

function MegaPanel({
  group,
  hidden,
  onNavigate,
}: {
  group: NavGroup;
  hidden: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      id={`nav-panel-${group.label.toLowerCase()}`}
      hidden={hidden}
      className="cc-headdrop cc-fade pointer-events-auto absolute"
    >
      <div className="w-full px-6">
        <div className="grid grid-cols-12 gap-10 py-8">
          <div className="col-span-3 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-orange uppercase">
                {group.label}
              </p>
              <p className="mt-3 max-w-[30ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                {group.intro}
              </p>
            </div>
            <Link
              href={group.href}
              onClick={onNavigate}
              className="group mt-6 inline-flex w-fit items-center gap-2 text-[0.875rem] font-medium text-orange-text underline-offset-4 hover:underline"
            >
              Ver todo {group.label}
              <ArrowRightIcon
                weight="bold"
                aria-hidden
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <ul className="col-span-5 grid grid-cols-2 gap-x-4 gap-y-0.5 self-start">
            {group.links.map((link) => (
              <li key={`${group.href}-${link.href}`}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="group flex flex-col rounded-ui px-3 py-2.5 transition-colors duration-200 hover:bg-surface"
                >
                  <span className="flex items-center gap-1.5 text-[0.9375rem] font-medium">
                    {link.label}
                    <ArrowRightIcon
                      weight="bold"
                      aria-hidden
                      className="size-3 -translate-x-1 text-orange-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                  {link.hint ? (
                    <span className="mt-0.5 text-[0.8125rem] leading-snug text-fg-muted">
                      {link.hint}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="col-span-4 flex flex-col gap-3">
            {/* Atajo destacado con foto: le da cara al panel y empuja una acción. */}
            <Link
              href={group.featured.href}
              onClick={onNavigate}
              className="group relative flex min-h-[11rem] flex-1 flex-col justify-end overflow-hidden rounded-panel bg-surface-ink p-5 text-on-ink"
            >
              <Image
                src={media(group.media)}
                alt={group.mediaAlt}
                fill
                sizes="24rem"
                className="object-cover opacity-75 transition-transform duration-700 [transition-timing-function:var(--cc-ease)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,28,34,0.94),rgba(20,28,34,0.35)_60%,rgba(20,28,34,0.1))]"
              />
              <span className="relative">
                <span className="font-mono text-[0.625rem] tracking-[0.16em] text-orange uppercase">
                  Destacado
                </span>
                <span className="mt-2 block font-display text-lg font-medium tracking-[-0.02em]">
                  {group.featured.label}
                </span>
                {group.featured.hint ? (
                  <span className="mt-1 block text-[0.8125rem] text-on-ink-muted">
                    {group.featured.hint}
                  </span>
                ) : null}
              </span>
            </Link>

            <a
              href={whatsappHref(
                `Hola, quiero consultar por una operación de ${group.label.toLowerCase()}.`,
              )}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3 rounded-panel border border-line bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-ink-600"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-whatsapp/12 text-whatsapp"
              >
                <WhatsappLogoIcon weight="fill" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.875rem] font-medium">
                  ¿No sabés cuál necesitás?
                </span>
                <span className="block text-[0.8125rem] text-fg-muted">
                  Contanos tu operación por WhatsApp
                </span>
              </span>
              <ArrowRightIcon
                weight="bold"
                aria-hidden
                className="size-4 shrink-0 text-fg-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-fg"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto fixed inset-0 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          {/* Mismo velo que en desktop: la página se difumina detrás del menú. */}
          <div aria-hidden onClick={onClose} className="cc-headscrim absolute inset-0" />

          <div className="cc-headdrop-mobile absolute overflow-y-auto">
            <nav aria-label="Principal móvil" className="p-4">
              <ul className="flex flex-col gap-1">
                {navGroups.map((group) => (
                  <li key={group.href}>
                    <Link
                      href={group.href}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 rounded-ui px-3 pt-2.5 pb-1.5 transition-colors duration-200 active:bg-surface"
                    >
                      <span className="font-display text-[1.0625rem] font-medium tracking-[-0.02em]">
                        {group.label}
                      </span>
                      <ArrowRightIcon
                        weight="bold"
                        aria-hidden
                        className="size-4 shrink-0 text-fg-faint"
                      />
                    </Link>
                    <ul className="mb-2 flex flex-col">
                      {group.links.map((link) => (
                        <li key={`${group.href}-${link.href}`}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="block rounded-ui py-1.5 pr-3 pl-6 text-[0.9375rem] text-fg-muted transition-colors duration-200 active:bg-surface active:text-fg"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <ul className="mt-2 flex flex-col gap-1 border-t border-line pt-3">
                {[...flatNav, { label: "Seguir mi envío", href: routes.tracking }].map(
                  (link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between gap-3 rounded-ui px-3 py-2.5 transition-colors duration-200 active:bg-surface"
                      >
                        <span className="font-display text-[1.0625rem] font-medium tracking-[-0.02em]">
                          {link.label}
                        </span>
                        <ArrowRightIcon
                          weight="bold"
                          aria-hidden
                          className="size-4 shrink-0 text-fg-faint"
                        />
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <Button
                href={routes.quote}
                size="lg"
                onClick={onClose}
                className="mt-4 w-full"
                withArrow
              >
                Cotizá tu envío
              </Button>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
