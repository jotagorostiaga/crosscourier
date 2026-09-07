import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { TrackingForm } from "@/components/blocks/tracking-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Seguir mi envío",
  description:
    "Consultá el estado de una operación en curso con tu número de operación de CrossCourier.",
  alternates: { canonical: "/seguir-mi-envio" },
  robots: { index: true, follow: true },
};

export default function TrackingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", href: "/" },
          { name: "Seguir mi envío", href: "/seguir-mi-envio" },
        ])}
      />

      <Section tone="bg" size="compact" className="pt-10 md:pt-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h1 className="max-w-[14ch] text-display">
                Seguí tu envío.
              </h1>
              <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">
                Ingresá el número de operación que te entregamos al confirmar el
                envío y te mostramos en qué instancia está.
              </p>

              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display text-lg font-medium tracking-[-0.015em]">
                  ¿No encontrás el número?
                </h2>
                <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                  Está en el mail de confirmación de la operación. Si no lo
                  tenés a mano, escribinos con el nombre de la empresa y la fecha
                  aproximada del envío y lo buscamos nosotros.
                </p>
                <p className="mt-4 text-[0.9375rem]">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="font-medium text-orange-text underline-offset-4 hover:underline"
                  >
                    {site.contact.email}
                  </a>
                </p>
              </div>

              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display text-lg font-medium tracking-[-0.015em]">
                  ¿Todavía no tenés una operación con nosotros?
                </h2>
                <ArrowLink href="/cotizar" className="mt-3">
                  Cotizá tu envío
                </ArrowLink>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <TrackingForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
