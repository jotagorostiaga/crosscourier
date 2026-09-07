import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button, ArrowLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/blocks/faq-section";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { getFaqs } from "@/lib/faq";
import { media } from "@/lib/media";
import type { Service } from "@/lib/services";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import type { QuotePrefill } from "@/lib/quote/types";

function quoteHref(prefill: QuotePrefill): string {
  const params = new URLSearchParams();
  if (prefill.need) params.set("need", prefill.need);
  if (prefill.originCountry) params.set("origin", prefill.originCountry);
  if (prefill.destinationCountry)
    params.set("destination", prefill.destinationCountry);
  if (prefill.cargoKind) params.set("cargo", prefill.cargoKind);
  if (prefill.urgency) params.set("urgency", prefill.urgency);
  const query = params.toString();
  return query ? `/cotizar?${query}` : "/cotizar";
}

export function ServicePage({ service }: { service: Service }) {
  const hub = service.direction === "importar" ? "/importar" : "/exportar";
  const hubLabel =
    service.direction === "importar" ? "Importar" : "Exportar";
  const faqs = getFaqs(service.faqIds);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: service.name,
            description: service.seoDescription,
            slug: service.slug,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: hubLabel, href: hub },
            { name: service.name, href: service.slug },
          ]),
        ]}
      />

      {/* Cabecera: la necesidad primero, el nombre del servicio como dato. */}
      <Section tone="bg" size="compact" className="pt-8 md:pt-12">
        <Container>
          <nav aria-label="Ruta de navegación" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-fg-muted">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={hub} className="underline-offset-4 hover:underline">
                  {hubLabel}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-fg">{service.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase">
                {service.name}
              </p>
              <h1 className="mt-5 max-w-[16ch] text-display">{service.h1}</h1>
              <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">
                {service.lead}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href={quoteHref(service.prefill)} size="lg" withArrow>
                  Cotizá tu envío
                </Button>
                <ArrowLink href="#como-funciona">Ver cómo funciona</ArrowLink>
              </div>

              {service.facts ? (
                <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-3">
                  {service.facts.map((fact) => (
                    <div key={fact.label} className="border-t border-line-strong pt-4">
                      <dt className="text-[0.8125rem] text-fg-muted">
                        {fact.label}
                      </dt>
                      <dd className="tnum mt-2 font-display text-lg font-medium tracking-[-0.015em]">
                        {fact.value}
                      </dd>
                      {fact.note ? (
                        <dd className="mt-1 text-[0.8125rem] text-fg-faint">
                          {fact.note}
                        </dd>
                      ) : null}
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface-2 lg:aspect-[5/6]">
                <Image
                  src={media(service.media.key)}
                  alt={service.media.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                  style={
                    service.media.focus
                      ? { objectPosition: service.media.focus }
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Situación y problema */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <h2 className="max-w-[18ch] text-title lg:col-span-5">
              {service.situation.title}
            </h2>
            <p className="max-w-[62ch] text-lead text-fg-muted lg:col-span-7">
              {service.situation.body}
            </p>
          </div>
        </Container>
      </Section>

      {/* Para quién es + qué incluye */}
      <Section tone="bg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h2 className="text-title">Cuándo conviene</h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {service.fitFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-4 text-[0.9375rem] leading-relaxed"
                  >
                    <CheckIcon
                      weight="bold"
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-orange-text"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {service.notFor ? (
                <div className="mt-8 rounded-panel border border-line bg-surface p-5">
                  <div className="flex items-start gap-3">
                    <WarningDiamondIcon
                      weight="fill"
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-orange-text"
                    />
                    <div>
                      <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                        {service.notFor.body}
                      </p>
                      <ArrowLink href={service.notFor.href} className="mt-3">
                        {service.notFor.label}
                      </ArrowLink>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="text-title">Qué incluye</h2>
              <ul className="mt-8 space-y-4">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-fg-muted"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cómo funciona */}
      <Section tone="surface" id="como-funciona">
        <Container>
          <h2 className="max-w-[20ch] text-title">Cómo funciona la operación</h2>
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.07}>
                <div className="border-t border-ink pt-5">
                  <span className="tnum font-mono text-[0.6875rem] tracking-[0.16em] text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-medium tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fg-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14">
            <Button href={quoteHref(service.prefill)} size="lg" withArrow>
              Empezar la cotización
            </Button>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={faqs}
        title={`Preguntas sobre ${service.name}`}
        tone="bg"
      />

      <ClosingCta />
    </>
  );
}

export function ServiceListLink({
  href,
  name,
  promise,
}: {
  href: string;
  name: string;
  promise: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-6 py-6 transition-colors"
    >
      <span className="min-w-0">
        <span className="block font-display text-xl font-medium tracking-[-0.02em] md:text-2xl">
          {name}
        </span>
        <span className="mt-1.5 block text-[0.9375rem] text-fg-muted">
          {promise}
        </span>
      </span>
      <ArrowRightIcon
        weight="bold"
        aria-hidden
        className="size-5 shrink-0 text-fg-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-fg"
      />
    </Link>
  );
}
