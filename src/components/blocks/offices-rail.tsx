"use client";

import { useRef } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Rail } from "@/components/ui/rail";
import { offices, officeCountries, telHref } from "@/lib/offices";
import { site } from "@/lib/site";

/**
 * Las oficinas de la red, en un riel horizontal. Se listan como credencial
 * concreta —dirección, teléfono y mail de cada plaza— y no como un mapa
 * decorativo: lo que da confianza es poder escribirle a alguien.
 */
export function OfficesRail() {
  const rail = useRef<HTMLUListElement>(null);

  function scrollRail(direction: 1 | -1) {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <Section tone="surface">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 className="max-w-[18ch] text-title">
              Oficinas en {officeCountries.length} países.
            </h2>
            <p className="mt-5 max-w-[52ch] text-lead text-fg-muted">
              La red de {site.backing}, el respaldo operativo de {site.name}:{" "}
              {offices.length} oficinas con equipo en origen y destino.
            </p>
          </div>

          <div className="hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              data-rail="prev"
              aria-label="Ver oficinas anteriores"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:border-ink hover:bg-bg"
            >
              <CaretLeftIcon weight="bold" className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              data-rail="next"
              aria-label="Ver más oficinas"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:border-ink hover:bg-bg"
            >
              <CaretRightIcon weight="bold" className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </Container>

      {/* El riel sangra hasta el borde: se ve que hay más de lo que entra. */}
      <div className="mt-12">
        <Rail listRef={rail} tone="surface">
            {offices.map((office, index) => (
              <Reveal
                as="li"
                key={`${office.country}-${office.city}`}
                delay={Math.min(index, 4) * 0.05}
                className="w-[19rem] shrink-0 snap-start"
              >
                <article className="flex h-full flex-col rounded-panel border border-line bg-bg p-6">
                  <p className="font-mono text-[0.625rem] tracking-[0.16em] text-orange uppercase">
                    {office.country}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-medium tracking-[-0.02em]">
                    {office.city}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">
                    {office.address}
                  </p>

                  <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.8125rem]">
                    {office.phones?.length ? (
                      <div className="flex items-start gap-2.5">
                        <dt>
                          <span className="sr-only">Teléfono</span>
                          <PhoneIcon
                            weight="bold"
                            aria-hidden
                            className="mt-0.5 size-3.5 shrink-0 text-fg-faint"
                          />
                        </dt>
                        <dd className="flex flex-col gap-0.5">
                          {office.phones.map((phone) => (
                            <a
                              key={phone}
                              href={telHref(phone)}
                              className="tnum text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                            >
                              {phone}
                            </a>
                          ))}
                        </dd>
                      </div>
                    ) : null}

                    <div className="flex items-start gap-2.5">
                      <dt>
                        <span className="sr-only">Email</span>
                        <EnvelopeSimpleIcon
                          weight="bold"
                          aria-hidden
                          className="mt-0.5 size-3.5 shrink-0 text-fg-faint"
                        />
                      </dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${office.email}`}
                          className="break-all text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                        >
                          {office.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
          ))}
        </Rail>
      </div>
    </Section>
  );
}
