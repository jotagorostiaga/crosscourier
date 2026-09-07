"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { media } from "@/lib/media";
import { getService } from "@/lib/services";

const SLUGS = [
  "/importar/courier-aereo-priority",
  "/importar/courier-aereo-standard",
  "/importar/courier-maritimo",
  "/exportar/exporta-simple",
];

const services = SLUGS.map((slug) => {
  const service = getService(slug);
  if (!service) throw new Error(`Falta el servicio ${slug}`);
  return service;
});

/**
 * Los servicios se van revelando con el scroll: el que está activo abre su
 * bajada y cambia la foto. Es la misma decisión de siempre —qué modalidad
 * corresponde— pero contada en el ritmo de la lectura y no en una grilla.
 *
 * El estado activo viaja por `data-on`, no por clases condicionales: así el
 * preview estático puede reproducir el mismo comportamiento sin React.
 */
export function ServicesScroll() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let frame = 0;
    function update() {
      frame = 0;
      const element = track.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const next = Math.min(
        services.length - 1,
        Math.floor(progress * services.length),
      );
      setActive((current) => (current === next ? current : next));
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="bg-bg">
      {/* Desktop: recorrido con panel pegajoso. El titular viaja con él. */}
      <div
        ref={track}
        data-scrollytell
        className="relative hidden lg:block"
        style={{ height: `${services.length * 78}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center pt-(--cc-header-h)">
          <Container className="w-full">
            <h2 className="mx-auto max-w-[16ch] text-center text-[clamp(2.25rem,1.2rem+2.6vw,3.5rem)] leading-[1.04] tracking-[-0.035em] text-balance">
              Un servicio para cada tipo de envío.
            </h2>

            <div className="mt-10 grid grid-cols-12 items-center gap-10 xl:mt-14">
              <ul className="col-span-6">
                {services.map((service, index) => (
                  <li
                    key={service.key}
                    data-stack-item
                    data-on={index === active}
                    className="cc-stack-item"
                  >
                    {/* La barra abraza titular y bajada: marca el bloque, no la línea. */}
                    <Link
                      href={service.slug}
                      className="group flex items-stretch gap-5 py-3"
                    >
                      <span className="cc-stack-bar" aria-hidden />
                      <span className="block min-w-0">
                        <span className="flex items-center gap-3">
                          <span className="font-display text-[clamp(1.65rem,1rem+1.7vw,2.5rem)] leading-tight font-medium tracking-[-0.03em]">
                            {service.name}
                          </span>
                          <ArrowRightIcon
                            weight="bold"
                            aria-hidden
                            className="size-4 shrink-0 -translate-x-1 text-orange-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </span>
                        {/* El alto está reservado: al cambiar de servicio la lista no salta. */}
                        <span className="cc-stack-body">
                          <span className="block max-w-[40ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                            {service.promise}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="relative col-span-6 aspect-[5/4] overflow-hidden rounded-panel bg-surface-2">
                {services.map((service, index) => (
                  <div
                    key={service.key}
                    data-stack-shot
                    data-on={index === active}
                    className="cc-stack-shot absolute inset-0"
                  >
                    <Image
                      src={media(service.media.key)}
                      alt={service.media.alt}
                      fill
                      sizes="(max-width: 1280px) 50vw, 600px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile: sin scrollytelling, cada servicio se lee completo. */}
      <Container className="lg:hidden">
        <h2 className="mx-auto max-w-[16ch] pt-16 text-center text-[clamp(1.9rem,1.2rem+2.6vw,2.5rem)] leading-[1.06] tracking-[-0.035em] text-balance">
          Un servicio para cada tipo de envío.
        </h2>
        <ul className="mt-10 flex flex-col gap-8 pb-4">
          {services.map((service) => (
            <li key={service.key}>
              <Link href={service.slug} className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface-2">
                  <Image
                    src={media(service.media.key)}
                    alt={service.media.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 h-6 w-[3px] shrink-0 rounded-full bg-orange"
                  />
                  <span>
                    <span className="block font-display text-xl font-medium tracking-[-0.025em]">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-fg-muted">
                      {service.promise}
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
