import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { faqs } from "@/lib/faq";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre importar y exportar",
  description:
    "Régimen courier, límites de peso y valor, Exporta Simple, consolidación de compras y documentación. Las consultas que más recibimos.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

const topics = [
  {
    id: "regimen",
    title: "Régimen y encuadre",
    intro: "Qué se puede hacer por courier y qué necesita otra modalidad.",
  },
  {
    id: "servicios",
    title: "Servicios",
    intro: "Diferencias entre modalidades y cuándo conviene cada una.",
  },
  {
    id: "operacion",
    title: "Operación",
    intro: "Plazos, consolidación, productos y seguimiento.",
  },
  {
    id: "exportacion",
    title: "Exportación",
    intro: "Exporta Simple y envíos comerciales al exterior.",
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(faqs),
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
          ]),
        ]}
      />

      <Section tone="bg" size="compact" className="pt-10 md:pt-16">
        <Container>
          <h1 className="max-w-[18ch] text-display">
            Preguntas frecuentes sobre importar y exportar.
          </h1>
          <p className="mt-6 max-w-[54ch] text-lead text-fg-muted">
            Si tu caso no está acá, contanos la operación y te respondemos con
            datos concretos, no con un rango genérico.
          </p>
        </Container>
      </Section>

      {topics.map((topic, index) => {
        const items = faqs.filter((faq) => faq.topic === topic.id);
        if (items.length === 0) return null;
        return (
          <Section
            key={topic.id}
            tone={index % 2 === 0 ? "surface" : "bg"}
            size="compact"
            id={topic.id}
          >
            <Container>
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <h2 className="text-title">{topic.title}</h2>
                  <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                    {topic.intro}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <Accordion
                    items={items.map((item) => ({
                      id: item.id,
                      question: item.question,
                      answer: item.answer,
                    }))}
                  />
                </div>
              </div>
            </Container>
          </Section>
        );
      })}

      <ClosingCta
        title="¿Tu caso no está en la lista?"
        body="Contanos la operación y te decimos qué corresponde antes de que arranques ningún trámite."
      />
    </>
  );
}
