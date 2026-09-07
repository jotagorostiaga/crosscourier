import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section tone="bg" size="tall">
      <Container width="narrow">
        <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase">
          Error 404
        </p>
        <h1 className="mt-5 text-display">Esta página no existe.</h1>
        <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">
          Puede que la dirección haya cambiado. Si estabas buscando una
          modalidad puntual, arrancá por lo que necesitás hacer.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Button href="/cotizar" size="lg" withArrow>
            Cotizá tu envío
          </Button>
          <ArrowLink href="/importar">Ver opciones para importar</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
