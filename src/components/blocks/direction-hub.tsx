import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button, ArrowLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/blocks/faq-section";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { ServiceListLink } from "@/components/blocks/service-page";
import { JsonLd } from "@/components/seo/json-ld";
import { getFaqs } from "@/lib/faq";
import { media } from "@/lib/media";
import type { MediaKey } from "@/lib/media";
import { servicesByDirection } from "@/lib/services";
import { breadcrumbJsonLd } from "@/lib/seo";

const copy = {
  importar: {
    label: "Importar",
    h1a: "Traer mercadería al país,",
    h1b: "sin adivinar la modalidad.",
    lead: "Muestras, repuestos, insumos, tecnología o mercadería desde el exterior. La urgencia, el volumen y las características del envío definen qué alternativa corresponde.",
    hero: "china" as MediaKey,
    alt: "Terminal portuaria de origen para operaciones de importación",
    faqIds: ["limite-courier", "inscripcion", "cuando-maritimo", "productos", "consolidar"],
    quoteHref: "/cotizar?need=importar",
  },
  exportar: {
    label: "Exportar",
    h1a: "Enviar al exterior",
    h1b: "con el encuadre correcto.",
    lead: "Muestras, documentación o productos hacia cualquier destino. Definimos si la operación sale por courier aéreo o si conviene encuadrarla como exportación comercial.",
    hero: "expo-standard" as MediaKey,
    alt: "Paquetes de exportación avanzando por una cinta de clasificación",
    faqIds: ["exporta-simple", "priority-vs-standard", "cuanto-tarda", "productos"],
    quoteHref: "/cotizar?need=exportar",
  },
} as const;

export function DirectionHub({
  direction,
}: {
  direction: "importar" | "exportar";
}) {
  const content = copy[direction];
  const list = servicesByDirection(direction);
  const faqs = getFaqs([...content.faqIds]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", href: "/" },
          { name: content.label, href: `/${direction}` },
        ])}
      />

      <Section tone="bg" size="compact" className="pt-10 md:pt-14">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Pill>{content.label}</Pill>
              <h1 className="mt-6 max-w-[18ch] text-display">
                <span className="block">{content.h1a}</span>
                <span className="block text-ink-600">{content.h1b}</span>
              </h1>
              <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">
                {content.lead}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href={content.quoteHref} size="lg" withArrow>
                  Cotizá tu envío
                </Button>
                <ArrowLink href="#alternativas">Ver alternativas</ArrowLink>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] overflow-hidden rounded-panel bg-surface-2">
                <Image
                  src={media(content.hero)}
                  alt={content.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface" id="alternativas">
        <Container>
          <h2 className="max-w-[20ch] text-title">Alternativas disponibles</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {list.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05}>
                <ServiceListLink
                  href={service.slug}
                  name={service.name}
                  promise={service.promise}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="bg" size="compact">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 rounded-panel border border-line bg-surface p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="max-w-[22ch] font-display text-2xl font-medium tracking-[-0.02em]">
                ¿Todavía no sabés qué modalidad necesitás?
              </h2>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                Contanos la operación y la analizamos nosotros. No hace falta que
                conozcas el nombre técnico del servicio.
              </p>
            </div>
            <Button
              href={content.quoteHref}
              variant="solid-ink"
              size="lg"
              className="shrink-0"
              withArrow
            >
              Analizar mi operación
            </Button>
          </div>
        </Container>
      </Section>

      <FaqSection items={faqs} title={`Preguntas sobre ${direction}`} tone="surface" />
      <ClosingCta />
    </>
  );
}
