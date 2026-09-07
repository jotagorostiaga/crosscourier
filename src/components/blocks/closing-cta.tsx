import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/media";
import { routes, site } from "@/lib/site";

/**
 * Cierre de página: una sola acción. El texto y el CTA quedan juntos a la
 * izquierda —se leen como una unidad— y el isologo ocupa el espacio de la
 * derecha, que es donde la marca puede firmar sin competirle a nada.
 */
export function ClosingCta({
  title = "¿Qué necesitás traer o enviar?",
  body = "Contanos tu operación. Te ayudamos a identificar la alternativa adecuada y cotizamos tu envío.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-ink text-on-ink">
      <div aria-hidden className="cc-rule-grid absolute inset-0 opacity-60" />

      <Container className="relative">
        <div className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="max-w-[16ch] text-display">{title}</h2>
            <p className="mt-6 max-w-[46ch] text-lead text-on-ink-muted">{body}</p>
            <Button href={routes.quote} size="lg" className="mt-9" withArrow>
              Cotizá tu envío
            </Button>
          </div>

          {/* Isologo a gran escala: firma de marca, no ilustración. */}
          <div
            aria-hidden
            className="pointer-events-none hidden justify-self-end lg:col-span-5 lg:block"
          >
            <Image
              src={asset("/brand/isologo.svg")}
              alt=""
              width={412}
              height={348}
              className="w-[clamp(11rem,16vw,17rem)] opacity-90"
            />
          </div>
        </div>

        <p className="border-t border-line-on-ink py-8 font-display text-lg tracking-[-0.01em] text-on-ink-muted">
          {site.name}. <span className="text-orange">{site.tagline}</span>
        </p>
      </Container>
    </section>
  );
}
