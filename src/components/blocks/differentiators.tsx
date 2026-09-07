import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const items = [
  {
    title: "Entendemos qué necesitás hacer",
    body: "Analizamos el producto, origen, destino, peso, valor y urgencia antes de proponer nada.",
  },
  {
    title: "Recomendamos la modalidad",
    body: "Priority, Standard, Marítimo, Exporta Simple, Consolidación o una alternativa fuera del courier.",
  },
  {
    title: "Coordinamos la operación",
    body: "Recolección, documentación, transporte y entrega según el servicio contratado.",
  },
  {
    title: "Te acompañamos",
    body: "Contás con un equipo para seguir la operación y responder durante el proceso.",
  },
];

export function Differentiators() {
  return (
    <Section tone="bg">
      <Container>
        <h2 className="max-w-[24ch] text-title">
          Optimizamos costos. Reducimos tiempos. Hacemos que tu envío llegue.
        </h2>

        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.07}>
              <div className="border-t border-ink pt-5">
                <span className="tnum font-mono text-[0.6875rem] tracking-[0.16em] text-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
