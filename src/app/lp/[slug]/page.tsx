import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { QuoteFlow } from "@/components/quote/quote-flow";
import { FaqSection } from "@/components/blocks/faq-section";
import { ClosingCta } from "@/components/blocks/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { campaigns, getCampaign } from "@/lib/campaigns";
import { getFaqs } from "@/lib/faq";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lp/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const campaign = getCampaign(slug);
  if (!campaign) return {};
  return {
    title: campaign.seoTitle,
    description: campaign.seoDescription,
    alternates: { canonical: `/lp/${campaign.slug}` },
    openGraph: {
      title: campaign.seoTitle,
      description: campaign.seoDescription,
      url: `/lp/${campaign.slug}`,
    },
  };
}

export default async function CampaignPage(props: PageProps<"/lp/[slug]">) {
  const { slug } = await props.params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  const faqs = getFaqs(campaign.faqIds);

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(faqs),
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: campaign.seoTitle, href: `/lp/${campaign.slug}` },
          ]),
        ]}
      />

      <section className="relative isolate overflow-hidden bg-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,140,0,0.08),transparent_65%)]"
        />
        <Container className="relative">
          <div className="grid items-start gap-12 pt-14 pb-20 md:pt-16 md:pb-24 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Pill>{campaign.label}</Pill>
              <h1 className="mt-6 max-w-[15ch] text-display">{campaign.h1}</h1>
              <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
                {campaign.lead}
              </p>
              <ul className="mt-10 space-y-6">
                {campaign.points.map((point) => (
                  <li key={point.title} className="flex items-start gap-3">
                    <CheckIcon
                      weight="bold"
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-orange-text"
                    />
                    <div>
                      <p className="font-display text-base font-medium tracking-[-0.01em]">
                        {point.title}
                      </p>
                      <p className="mt-1 max-w-[44ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                        {point.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
              <div className="rounded-panel border border-line bg-surface p-6 text-fg shadow-cc-lg md:p-8">
                <QuoteFlow
                  prefill={campaign.prefill}
                  entryPoint={`lp:${campaign.slug}`}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="surface" size="compact">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="max-w-[52ch] text-lead text-fg-muted">
              Esta operación se resuelve con una modalidad concreta. Podés ver
              cómo funciona en detalle antes de cotizar.
            </p>
            <ArrowLink href={campaign.relatedHref}>
              {campaign.relatedLabel}
            </ArrowLink>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={faqs}
        title="Antes de avanzar"
        showAllLink={false}
        tone="bg"
      />
      <ClosingCta />
    </>
  );
}
