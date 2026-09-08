import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowsInLineHorizontalIcon,
  PackageIcon,
  StackIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/blocks/faq-section";
import { NetworkMap } from "@/components/blocks/network-map";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { getFaqs } from "@/lib/faq";
import { media } from "@/lib/media";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Warehouse internacional: recepción, almacenamiento y consolidación",
  description:
    "Recibí, almacená, consolidá y prepará tu mercadería en un mismo lugar. Warehouses en Buenos Aires, Miami, Shanghái y Shenzhen.",
  alternates: { canonical: "/warehouse" },
};

const capabilities = [
  {
    icon: PackageIcon,
    title: "Recepción",
    body: "Tus proveedores entregan en nuestra dirección. Registramos y controlamos cada bulto que llega a tu nombre.",
  },
  {
    icon: StackIcon,
    title: "Almacenamiento",
    body: "La mercadería queda guardada el tiempo que necesites, mientras se completa la compra o se define el despacho.",
  },
  {
    icon: ArrowsInLineHorizontalIcon,
    title: "Consolidación",
    body: "Compras de distintos proveedores y fechas se reúnen en una sola operación internacional.",
  },
  {
    icon: TruckIcon,
    title: "Preparación y despacho",
    body: "Acondicionamos la mercadería y la preparamos para su distribución nacional o internacional.",
  },
];

const useCases = [
  "Empresas que compran a varios proveedores en un mismo origen",
  "Operaciones que necesitan almacenamiento temporal antes del embarque",
  "Negocios que administran stock y reponen de forma recurrente",
  "Mercadería que hay que acondicionar antes de distribuir",
];

export default function WarehousePage() {
  const faqs = getFaqs(["warehouse-uso", "consolidar", "limite-courier"]);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Warehouse internacional",
            description:
              "Recepción, almacenamiento, consolidación y preparación de mercadería en Buenos Aires, Miami, Shanghái y Shenzhen.",
            slug: "/warehouse",
          }),
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: "Warehouse", href: "/warehouse" },
          ]),
        ]}
      />

      <Section tone="bg" size="compact" className="pt-10 md:pt-16">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h1 className="max-w-[16ch] text-display">
                Warehouse para centralizar tu operación.
              </h1>
              <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">
                Recibí, almacená, consolidá y prepará tu mercadería en un mismo
                lugar, antes de su distribución nacional o internacional.
              </p>
              <Button href="/cotizar" size="lg" className="mt-9" withArrow>
                Consultar por warehouse
              </Button>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-panel bg-surface-2">
                <Image
                  src={media("warehouse")}
                  alt="Pasillo central de un warehouse con racks de pallets"
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

      <Section tone="surface" id="funciones" className="scroll-mt-24">
        <Container>
          <h2 className="max-w-[22ch] text-title">
            Cuatro funciones sobre la misma mercadería.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-5">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Reveal key={capability.title} delay={index * 0.06}>
                  <div className="h-full rounded-panel border border-line bg-bg p-7">
                    <Icon
                      weight="light"
                      aria-hidden
                      className="size-7 text-orange-text"
                    />
                    <h3 className="mt-5 font-display text-lg font-medium tracking-[-0.015em]">
                      {capability.title}
                    </h3>
                    <p className="mt-2.5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                      {capability.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="bg" id="para-quien" className="scroll-mt-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="max-w-[18ch] text-title lg:col-span-5">
              Para quién resuelve algo concreto
            </h2>
            <ul className="divide-y divide-line border-y border-line lg:col-span-7">
              {useCases.map((useCase) => (
                <li key={useCase} className="py-5 text-lead text-fg-muted">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <NetworkMap tone="surface" showCta={false} id="red" compactBody />

      <FaqSection items={faqs} title="Preguntas sobre warehouse" tone="bg" />
      <ClosingCta
        title="¿Necesitás centralizar tu mercadería?"
        body="Contanos cómo comprás hoy y te decimos cómo se ordena la operación."
      />
    </>
  );
}
