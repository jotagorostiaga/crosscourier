import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/faq";

export function FaqSection({
  items,
  title = "Preguntas frecuentes",
  /** Segunda mitad del titular, en tono más claro. */
  titleAccent,
  intro,
  showAllLink = true,
  tone = "bg",
}: {
  items: FaqItem[];
  title?: string;
  titleAccent?: string;
  intro?: string;
  showAllLink?: boolean;
  tone?: "bg" | "surface";
}) {
  return (
    <Section tone={tone} id="preguntas">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* La columna izquierda se mantiene a la vista mientras se abren las respuestas. */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <h2 className="max-w-[14ch] text-[clamp(1.9rem,1.2rem+1.9vw,2.9rem)] leading-[1.06] tracking-[-0.03em]">
              <span className="block">{title}</span>
              {titleAccent ? (
                <span className="block text-ink-600">{titleAccent}</span>
              ) : null}
            </h2>
            {intro ? (
              <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                {intro}
              </p>
            ) : null}
            {showAllLink ? (
              <Button
                href="/preguntas-frecuentes"
                variant="outline"
                size="md"
                className="mt-8"
                withArrow
              >
                Ir a preguntas frecuentes
              </Button>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <Accordion
              tone={tone}
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
}
