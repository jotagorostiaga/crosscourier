"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section tone="bg" size="tall">
      <Container width="narrow">
        <h1 className="text-display">Algo se rompió de nuestro lado.</h1>
        <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">
          Probá de nuevo. Si el problema sigue, escribinos y seguimos la
          consulta por WhatsApp.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button onClick={reset} size="lg">
            Reintentar
          </Button>
          <Button href="/" variant="outline" size="lg">
            Volver al inicio
          </Button>
        </div>
      </Container>
    </Section>
  );
}
