import type { Metadata } from "next";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { QuoteFlowFromParams } from "@/components/quote/quote-flow-from-params";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cotizá tu envío internacional",
  description:
    "Contanos qué necesitás importar o exportar. Analizamos la operación y te proponemos la modalidad que corresponde antes de pedirte tus datos.",
  alternates: { canonical: "/cotizar" },
};

/** Tres cosas que el usuario necesita saber, sin robarle atención al formulario. */
const reassurance = [
  "Seis pasos, dos minutos",
  "Los datos de contacto van al final",
  "Revisa un especialista",
];

export default function QuotePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", href: "/" },
          { name: "Cotizá tu envío", href: "/cotizar" },
        ])}
      />

      {/* Una sola columna centrada: el formulario es lo único que importa acá. */}
      <section className="relative isolate overflow-hidden bg-bg py-14 md:pt-16 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.07),transparent_65%)]"
        />

        <Container className="relative">
          <div className="mx-auto max-w-[48rem]">
            {/* Sin eyebrow: el CTA del header ya dijo a qué vino el usuario.
                La bajada entra en un renglón en desktop para que el formulario
                —lo único accionable de la página— quede lo más arriba posible. */}
            <div className="flex flex-col items-center text-center">
              <h1 className="max-w-[16ch] text-display">
                Contanos tu operación.
              </h1>
              <p className="mt-5 text-lead text-balance text-fg-muted">
                Identificamos qué modalidad corresponde a tu envío antes de
                cotizar.
              </p>
            </div>

            <div className="mt-10 rounded-panel border border-line bg-surface p-6 shadow-cc-lg md:mt-12 md:p-10">
              <QuoteFlowFromParams entryPoint="cotizador" />
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
              {reassurance.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[0.8125rem] text-fg-muted"
                >
                  <CheckIcon
                    weight="bold"
                    aria-hidden
                    className="size-3.5 shrink-0 text-orange-text"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 text-center text-[0.875rem] text-fg-muted">
              ¿Preferís hablarlo directo?{" "}
              <a
                href={whatsappHref(
                  "Hola, quiero consultar por una operación de importación o exportación.",
                )}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-orange-text underline-offset-4 hover:underline"
              >
                Escribinos por WhatsApp
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
