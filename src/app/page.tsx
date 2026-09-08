import type { Metadata } from "next";
import { HeroHome } from "@/components/blocks/hero-home";
import { EntryPoints } from "@/components/blocks/entry-points";
import { ServicesScroll } from "@/components/blocks/services-scroll";
import { MediaSplit } from "@/components/blocks/media-split";
import { Differentiators } from "@/components/blocks/differentiators";
import { FeatureBanner } from "@/components/blocks/feature-banner";
import { TestimonialStories } from "@/components/blocks/testimonial-stories";
import { NetworkMap } from "@/components/blocks/network-map";
import { FaqSection } from "@/components/blocks/faq-section";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { featuredFaqs } from "@/lib/faq";
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} · Courier internacional, importación y exportación`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), faqJsonLd(featuredFaqs)]} />

      <HeroHome />
      <EntryPoints />
      <ServicesScroll />
      <NetworkMap tone="bg" />

      <MediaSplit
        title="¿Compraste a varios proveedores? Consolidá antes de enviar."
        body={
          <>
            <p>
              Podemos recibir tus compras en nuestros warehouses, almacenarlas y
              reunirlas para preparar una única operación internacional.
            </p>
            <p>
              Ideal para empresas que compran a distintos proveedores o reciben
              mercadería en momentos diferentes.
            </p>
          </>
        }
        image="consolidacion"
        alt="Cajas etiquetadas agrupadas en el warehouse antes de consolidar"
        href="/importar/consolidacion-de-compras"
        linkLabel="Conocer Consolidación de Compras"
        tone="surface"
      />

      <Differentiators />

      <FeatureBanner
        eyebrow="Carga sin límites"
        title="¿Tu carga excede las condiciones del courier?"
        body={
          <p>
            Cuando el peso, el valor o el volumen piden otra modalidad,
            analizamos una solución de carga internacional para tu operación.
          </p>
        }
        cta="Más información"
        ctaHref="/importar/carga-sin-limites"
        image="carga"
      />

      <FaqSection
        items={featuredFaqs}
        title="Preguntas"
        titleAccent="antes de cotizar."
        intro="Las consultas que más recibimos sobre régimen courier, importación y exportación."
        tone="bg"
      />
      <TestimonialStories />
      <ClosingCta />
    </>
  );
}
