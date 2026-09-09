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
 * Va en oscuro, sobre el mismo ink del footer: la página queda encuadrada
 * entre dos bloques de marca y el contenido claro en el medio. El degradado
 * es más denso del lado del texto y se abre hacia la derecha, así la foto
 * respira detrás de la tarjeta del cotizador sin comprometer la lectura.
 *
 * Abajo el bloque no se degrada al fondo claro —mezclar dos valores opuestos
 * siempre deja una banda de gris sucio— sino que termina como forma: la foto
 * se disuelve en ink plano y el bloque cierra con las esquinas redondeadas.
 */
export function HeroHome() {
  return (
    <section className="cc-hero-offset relative isolate overflow-hidden rounded-b-[clamp(1.5rem,2.6vw,2.5rem)] bg-surface-ink-2">
      <Image
        src={media("hero2")}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        /* En desktop el recorte muestra la parte alta de la foto: más al centro
           la trompa del avión se corta contra el borde superior. */
        className="cc-hero-photo object-cover object-center md:object-[50%_4%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(22,32,42,0.9)_0%,rgba(22,32,42,0.82)_45%,rgba(22,32,42,0.94)_100%)] md:bg-[linear-gradient(100deg,var(--cc-surface-ink-2)_0%,rgba(22,32,42,0.96)_32%,rgba(22,32,42,0.78)_56%,rgba(22,32,42,0.52)_100%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[680px] rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.12),transparent_65%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 pt-12 pb-20 md:pt-16 md:pb-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Pill tone="ink">
              Courier internacional · Importación y exportación
            </Pill>

            <h1 className="mt-7 max-w-[16ch] text-[clamp(2.15rem,1.1rem+2.9vw,3.5rem)] leading-[1.03] tracking-[-0.035em] text-on-ink">
              <span className="block">Cuando importás o exportás,</span>
              <span className="block text-on-ink-muted">
                necesitás mucho más que un courier.
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-lead text-on-ink-muted">
              Contanos qué necesitás traer o enviar y analizamos la alternativa
              que mejor se adapta a tu operación.
            </p>

            <Link
              href={routes.tracking}
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-orange underline-offset-4 hover:underline"
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
