import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Pill } from "@/components/ui/pill";
import { HeroQuoteStarter } from "@/components/quote/hero-quote-starter";
import { media } from "@/lib/media";
import { routes } from "@/lib/site";

/**
 * Primera pantalla: mitad propuesta de valor, mitad inicio de cotización.
 *
 * La foto de fondo aporta el registro institucional sin robarle protagonismo a
 * la tipografía: va lavada bajo un degradado del color de fondo, de modo que la
 * columna de texto siempre apoya sobre plano claro y la tarjeta del cotizador
 * flota por encima.
 */
export function HeroHome() {
  return (
    <section className="cc-hero-offset relative isolate overflow-hidden bg-bg">
      <Image
        src={media("warehouse")}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="cc-hero-photo object-cover object-center opacity-[0.42]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(246,246,244,0.9)_0%,rgba(246,246,244,0.78)_45%,rgba(246,246,244,0.74)_100%)] md:bg-[linear-gradient(96deg,var(--cc-bg)_0%,rgba(246,246,244,0.96)_30%,rgba(246,246,244,0.78)_52%,rgba(246,246,244,0.68)_100%)]"
      />

      {/* Marca de agua con el isotipo: identidad, no decoración genérica. */}
      <Image
        src="/brand/mark.png"
        alt=""
        aria-hidden
        width={400}
        height={440}
        priority
        className="pointer-events-none absolute -top-28 -right-28 hidden w-[540px] max-w-none opacity-[0.05] lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[680px] rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.08),transparent_65%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Pill>Courier internacional · Importación y exportación</Pill>

            <h1 className="mt-7 max-w-[16ch] text-[clamp(2.15rem,1.1rem+2.9vw,3.5rem)] leading-[1.03] tracking-[-0.035em]">
              <span className="block">Cuando importás o exportás,</span>
              <span className="block text-ink-600">
                necesitás mucho más que un courier.
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">
              Contanos qué necesitás traer o enviar y analizamos la alternativa
              que mejor se adapta a tu operación.
            </p>

            <Link
              href={routes.tracking}
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-orange-text underline-offset-4 hover:underline"
            >
              ¿Ya tenés un envío en curso? Seguí tu envío
              <ArrowRightIcon
                weight="bold"
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <HeroQuoteStarter />
          </div>
        </div>
      </Container>
    </section>
  );
}
