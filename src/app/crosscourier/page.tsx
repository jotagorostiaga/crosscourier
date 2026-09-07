import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { NetworkMap } from "@/components/blocks/network-map";
import { OfficesRail } from "@/components/blocks/offices-rail";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { media } from "@/lib/media";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "CrossCourier: quiénes somos y cómo trabajamos",
  description:
    "Nacimos respaldados por la trayectoria de SouthCross Logistics. Analizamos cada operación antes de proponer una modalidad de transporte internacional.",
  alternates: { canonical: "/crosscourier" },
};

const principles = [
  {
    title: "Primero la operación, después el servicio",
    body: "No arrancamos preguntando qué modalidad querés contratar. Arrancamos entendiendo qué necesitás mover, desde dónde, con qué plazo y bajo qué condiciones.",
  },
  {
    title: "Decimos cuándo no corresponde",
    body: "Si una operación no entra por régimen courier, lo decimos antes de avanzar y la analizamos como carga internacional. Un encuadre mal elegido cuesta tiempo y dinero.",
  },
  {
    title: "Una persona a cargo, no un número de caso",
    body: "Durante la operación hay un equipo que conoce tu envío y responde. El seguimiento no reemplaza la conversación.",
  },
];

const capabilities = [
  { label: "Respaldo operativo", value: site.backing },
  { label: "Warehouses", value: site.hubs.join(", ") },
  { label: "Modalidades", value: "Aérea, marítima y carga internacional" },
  { label: "Regímenes", value: "Courier, Exporta Simple y régimen general" },
];

export default function CompanyPage() {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: "CrossCourier", href: "/crosscourier" },
          ]),
        ]}
      />

      <Section tone="bg" size="compact" className="pt-10 md:pt-16">
        <Container>
          <h1 className="max-w-[20ch] text-display">
            Somos el equipo que resuelve la operación, no solo el transporte.
          </h1>
          <p className="mt-7 max-w-[62ch] text-lead text-fg-muted">
            CrossCourier nació respaldado por la trayectoria de {site.backing} y
            un equipo con experiencia en logística internacional. Trabajamos con
            PyMEs que necesitan importar o exportar y que no tienen por qué
            conocer la letra chica de cada régimen.
          </p>

          <div className="relative mt-14 aspect-[16/10] overflow-hidden rounded-panel bg-surface-2 md:aspect-[21/9]">
            <Image
              src={media("hero")}
              alt="Equipo de CrossCourier revisando documentación de una operación"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <h2 className="max-w-[18ch] text-title">Cómo trabajamos</h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.07}>
                <div className="border-t border-ink pt-5">
                  <h3 className="max-w-[24ch] font-display text-lg font-medium tracking-[-0.015em]">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <NetworkMap tone="bg" />

      <OfficesRail />

      <Section tone="bg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="max-w-[16ch] text-title">
                Con qué contás cuando operás con nosotros
              </h2>
              <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                Solo credenciales concretas: dónde operamos, qué modalidades
                manejamos y quién respalda la estructura.
              </p>
            </div>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
              {capabilities.map((item) => (
                <div key={item.label} className="border-t border-line-strong pt-5">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-3 font-display text-lg font-medium tracking-[-0.015em]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
