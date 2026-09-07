"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { ctaEvents } from "@/lib/quote/analytics";
import { routes, site, whatsappHref } from "@/lib/site";

const HIDDEN_ON = [routes.quote];

/**
 * Entrada permanente al cotizador en mobile. Aparece recién cuando el usuario
 * pasó el hero, para no tapar la primera pantalla.
 */
export function StickyQuoteBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:88vh;height:1px;width:1px;pointer-events:none;";
    document.body.appendChild(sentinel);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [pathname]);

  if (HIDDEN_ON.includes(pathname as (typeof HIDDEN_ON)[number])) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduce ? false : { y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center gap-2.5">
            <Link
              href={routes.quote}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-orange font-medium text-ink active:translate-y-px"
            >
              Cotizá tu envío
            </Link>
            <a
              href={whatsappHref(
                "Hola, necesito consultar por una operación de importación o exportación.",
              )}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => ctaEvents.whatsapp("sticky_bar")}
              aria-label={`Escribir por WhatsApp a ${site.name}`}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface active:translate-y-px"
            >
              <WhatsappLogoIcon weight="fill" className="size-5 text-whatsapp" aria-hidden />
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
