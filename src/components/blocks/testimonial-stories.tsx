"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PlayIcon,
  QuotesIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Rail } from "@/components/ui/rail";
import { media } from "@/lib/media";
import type { MediaKey } from "@/lib/media";
import { cn } from "@/lib/utils";

export type Story = {
  id: string;
  /** Quién habla. Cliente real o empresa. */
  name: string;
  /** Qué operación fue, en una línea corta. */
  tag: string;
  quote: string;
  /** Detalle que se lee dentro de la historia, no en la miniatura. */
  detail: string;
  image: MediaKey;
  /**
   * Ruta de un video vertical (9:16) en /public. Cuando existe, reemplaza a la
   * foto: el mismo slot sirve para testimonios filmados.
   */
  video?: string;
  href?: string;
};

/**
 * Los tres casos reales del proyecto. Cada slot acepta foto o video vertical:
 * cuando lleguen los testimonios filmados sólo hay que sumar `video`.
 */
const defaultStories: Story[] = [
  {
    id: "guitarra",
    name: "Martín",
    tag: "Importación · Estados Unidos",
    quote: "Encontré la guitarra. Ellos resolvieron cómo traerla.",
    detail:
      "Ya tenía el modelo exacto que buscaba. Analizaron la operación, definieron la modalidad y coordinaron la importación hasta mi domicilio.",
    image: "story-guitarra",
  },
  {
    id: "vehiculo",
    name: "Grupo Andes",
    tag: "Carga internacional",
    quote: "Un vehículo que no se comercializaba en Argentina.",
    detail:
      "No entraba por régimen courier. Revisaron documentación y condiciones antes de mover nada, y recién después definimos cómo traerlo.",
    image: "story-vehiculo",
  },
  {
    id: "repuesto",
    name: "Planta industrial",
    tag: "Importación · Priority",
    quote: "La línea estaba parada esperando una pieza.",
    detail:
      "Cada día de demora costaba más que el flete. Modalidad aérea prioritaria, recolección coordinada en origen y seguimiento hasta la entrega.",
    image: "story-repuesto",
  },
  {
    id: "consolidacion",
    name: "Tienda Nordelta",
    tag: "Consolidación de compras",
    quote: "Compro a cinco proveedores y envío una sola vez.",
    detail:
      "Reciben cada compra en el warehouse, esperan a que llegue todo y arman una única operación internacional.",
    image: "story-consolidacion",
  },
  {
    id: "exporta",
    name: "Estudio Rivas",
    tag: "Exporta Simple",
    quote: "Primera exportación, sin saber por dónde empezar.",
    detail:
      "Nos explicaron el encuadre, qué documentación hacía falta y cómo salía la operación. Hoy exportamos todos los meses.",
    image: "story-exporta",
  },
];

const STORY_MS = 6000;

export function TestimonialStories({
  stories = defaultStories,
  title = "Historias de clientes.",
  intro = "Operaciones que empezaron con una consulta. Tocá una para verla completa.",
}: {
  stories?: Story[];
  title?: string;
  intro?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rail = useRef<HTMLUListElement>(null);

  function scrollRail(direction: 1 | -1) {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <Section tone="surface">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Testimonios</Eyebrow>
            <h2 className="mt-4 max-w-[18ch] text-title">{title}</h2>
            <p className="mt-5 max-w-[46ch] text-lead text-fg-muted">{intro}</p>
          </div>

          {/* Los controles del rail sólo aparecen donde hay algo que desplazar. */}
          <div className="hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              data-rail="prev"
              aria-label="Ver historias anteriores"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:border-ink hover:bg-bg"
            >
              <CaretLeftIcon weight="bold" className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              data-rail="next"
              aria-label="Ver más historias"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:border-ink hover:bg-bg"
            >
              <CaretRightIcon weight="bold" className="size-4" aria-hidden />
            </button>
          </div>
        </div>

      </Container>

      <div className="mt-12">
        <Rail listRef={rail} tone="surface">
          {stories.map((story, index) => (
            <Reveal
              as="li"
              key={story.id}
              delay={Math.min(index, 4) * 0.05}
              className="w-[15rem] shrink-0 snap-start sm:w-[16.5rem]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-panel bg-surface-ink text-left text-on-ink"
              >
                {/* Anillo de historia: marca que la pieza se abre, no que decora. */}
                <span
                  aria-hidden
                  className="absolute inset-0 z-20 rounded-panel ring-2 ring-transparent transition-shadow duration-300 group-hover:ring-orange/80"
                />
                <Image
                  src={media(story.image)}
                  alt=""
                  aria-hidden
                  fill
                  sizes="17rem"
                  className="object-cover transition-transform duration-700 [transition-timing-function:var(--cc-ease)] group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,28,34,0.94),rgba(20,28,34,0.4)_52%,rgba(20,28,34,0.18))]"
                />

                <span className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-orange uppercase">
                    {story.tag}
                  </span>
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-sm">
                    {story.video ? (
                      <PlayIcon weight="fill" className="size-3 translate-x-px" aria-hidden />
                    ) : (
                      <QuotesIcon weight="fill" className="size-3" aria-hidden />
                    )}
                  </span>
                </span>

                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.02em] text-balance">
                    {story.quote}
                  </span>
                  <span className="mt-3 flex items-center gap-2 text-[0.8125rem] text-on-ink-muted">
                    {story.name}
                    <ArrowRightIcon
                      weight="bold"
                      aria-hidden
                      className="size-3 -translate-x-1 text-orange opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </Rail>
      </div>


      {openIndex !== null ? (
        <StoryViewer
          stories={stories}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </Section>
  );
}

/** Visor a pantalla completa con el ritmo de una historia: avanza solo y se puede tocar. */
function StoryViewer({
  stories,
  index,
  onIndex,
  onClose,
}: {
  stories: Story[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const story = stories[index];

  const next = useCallback(() => {
    if (index >= stories.length - 1) onClose();
    else onIndex(index + 1);
  }, [index, stories.length, onClose, onIndex]);

  const previous = useCallback(() => {
    if (index > 0) onIndex(index - 1);
  }, [index, onIndex]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(next, STORY_MS);
    return () => clearTimeout(timer);
  }, [next, paused, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [next, previous, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Historia de ${story.name}`}
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar historia"
        className="absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:bg-white/10"
      >
        <XIcon weight="bold" className="size-5" aria-hidden />
      </button>

      <div
        className="relative aspect-[9/16] max-h-[86vh] w-full max-w-[26rem] overflow-hidden rounded-panel bg-surface-ink text-on-ink"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        {story.video ? (
          <video
            key={story.id}
            src={story.video}
            autoPlay
            muted
            playsInline
            loop
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            key={story.id}
            src={media(story.image)}
            alt=""
            aria-hidden
            fill
            sizes="26rem"
            className="object-cover"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,28,34,0.95),rgba(20,28,34,0.3)_50%,rgba(20,28,34,0.5))]"
        />

        {/* Barras de progreso: cuántas historias hay y dónde estamos. */}
        <div className="absolute inset-x-0 top-0 z-10 flex gap-1.5 p-3">
          {stories.map((item, itemIndex) => (
            <span
              key={item.id}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <span
                className={cn(
                  "block h-full rounded-full bg-white",
                  itemIndex < index && "w-full",
                  itemIndex === index && "cc-story-progress",
                  itemIndex > index && "w-0",
                )}
                style={
                  itemIndex === index
                    ? { animationPlayState: paused ? "paused" : "running" }
                    : undefined
                }
              />
            </span>
          ))}
        </div>

        {/* Zonas de toque, como en una historia: izquierda vuelve, derecha avanza. */}
        <button
          type="button"
          onClick={previous}
          aria-label="Historia anterior"
          className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-w-resize focus-visible:bg-white/5"
        />
        <button
          type="button"
          onClick={next}
          aria-label="Historia siguiente"
          className="absolute inset-y-0 right-0 z-10 w-1/3 cursor-e-resize focus-visible:bg-white/5"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6">
          <p className="font-mono text-[0.625rem] tracking-[0.16em] text-orange uppercase">
            {story.tag}
          </p>
          <p className="mt-3 font-display text-[1.375rem] leading-snug font-medium tracking-[-0.025em] text-balance">
            {story.quote}
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-ink-muted">
            {story.detail}
          </p>
          <p className="mt-4 text-[0.8125rem] font-medium">{story.name}</p>
        </div>
      </div>
    </div>
  );
}
