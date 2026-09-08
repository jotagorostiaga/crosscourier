import {
  BuildingOfficeIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { hubPoints, mapDots, mapViewBox } from "@/components/blocks/world-dots";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Hub = {
  key: keyof typeof hubPoints;
  city: string;
  role: string;
  detail: string;
  /** De qué lado del marcador va la etiqueta. */
  side: "left" | "right";
  /** Corrimiento vertical en porcentaje del alto, para que no se pisen. */
  nudge?: number;
};

const hubs: Hub[] = [
  {
    key: "buenos-aires",
    city: "Buenos Aires",
    role: "Casa central",
    detail: "Coordinación de la operación y entrega en Argentina",
    side: "right",
  },
  {
    key: "miami",
    city: "Miami",
    role: "Warehouse",
    detail: "Recepción y consolidación de compras en Estados Unidos",
    side: "right",
  },
  {
    key: "shanghai",
    city: "Shanghái",
    role: "Warehouse",
    detail: "Recepción de proveedores y embarque",
    side: "left",
    nudge: -6,
  },
  {
    key: "shenzhen",
    city: "Shenzhen",
    role: "Warehouse",
    detail: "Recepción de proveedores y embarque",
    side: "left",
    nudge: 6,
  },
];

/** Rutas que dibujan de dónde viene la mercadería. */
const arcs: { from: keyof typeof hubPoints; to: keyof typeof hubPoints }[] = [
  { from: "shenzhen", to: "buenos-aires" },
  { from: "shanghai", to: "buenos-aires" },
  { from: "miami", to: "buenos-aires" },
];

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.22;
  return `M${from.x} ${from.y} Q${midX} ${midY - lift} ${to.x} ${to.y}`;
}

const proof = [
  {
    icon: BuildingOfficeIcon,
    title: "Recepción en origen",
    body: "Tu proveedor entrega en nuestra dirección. Vos no coordinás nada afuera.",
  },
  {
    icon: PackageIcon,
    title: "Consolidación",
    body: "Varias compras se reúnen en una sola operación internacional.",
  },
  {
    icon: ShieldCheckIcon,
    title: `Respaldo de ${site.backing}`,
    body: "Estructura y trayectoria en logística internacional detrás de cada envío.",
  },
];

export function NetworkMap({
  tone = "surface",
  showCta = true,
  id,
  compactBody = false,
}: {
  tone?: "bg" | "surface";
  showCta?: boolean;
  /** Ancla para enlazarla desde el menú (por ejemplo /warehouse#red). */
  id?: string;
  /**
   * En /warehouse el hero ya abre con "Recibí, almacená, consolidá…", así que
   * ahí el bloque se queda sólo con la parte que suma: dónde están los
   * warehouses. En Home, en cambio, ésta es la primera vez que se explica.
   */
  compactBody?: boolean;
}) {
  return (
    <Section tone={tone} id={id} className="scroll-mt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Pill>Red operativa</Pill>
              <h2 className="mt-6 text-title">
                <span className="block">Nuestros Warehouse</span>
                <span className="block text-ink-600">
                  para centralizar tu operación.
                </span>
              </h2>
              {compactBody ? (
                <p className="mt-5 max-w-[44ch] text-lead text-fg-muted">
                  Warehouses en Buenos Aires, Miami, Shanghái y Shenzhen: ahí
                  recibimos, almacenamos y consolidamos tu mercadería antes de
                  que empiece a viajar.
                </p>
              ) : (
                <>
                  <p className="mt-5 max-w-[44ch] text-lead text-fg-muted">
                    Recibí, almacená, consolidá y prepará tu mercadería en un
                    mismo lugar.
                  </p>
                  <p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-fg-muted">
                    {site.name} brinda servicios de warehouse para empresas que
                    necesitan administrar compras, stock o mercadería antes de
                    su distribución nacional o internacional.
                  </p>
                </>
              )}
              {showCta ? (
                <Button href="/warehouse" className="mt-8" withArrow>
                  Conocer Warehouse
                </Button>
              ) : null}
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <WorldMap />
            </Reveal>
          </div>
        </div>

        <ul className="mt-16 grid gap-4 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
          {proof.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.title} delay={index * 0.06}>
                <Icon weight="light" aria-hidden className="size-6 text-orange-text" />
                <h3 className="mt-4 font-display text-base font-medium tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[40ch] text-[0.875rem] leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

export function WorldMap({ className }: { className?: string }) {
  const { width, height } = mapViewBox;

  return (
    <figure
      className={cn("relative", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <figcaption className="sr-only">
        Mapa con las plazas donde CrossCourier tiene operación: Buenos Aires,
        Miami, Shanghái y Shenzhen.
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="cc-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cc-orange)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--cc-orange)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--cc-orange)" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="cc-fade" cx="45%" cy="45%" r="62%">
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="cc-map-mask">
            <rect width={width} height={height} fill="url(#cc-fade)" />
          </mask>
        </defs>

        <path
          d={mapDots}
          mask="url(#cc-map-mask)"
          stroke="var(--cc-ink-600)"
          strokeOpacity="0.34"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {arcs.map((arc) => {
          const d = arcPath(hubPoints[arc.from], hubPoints[arc.to]);
          return (
            <g key={`${arc.from}-${arc.to}`}>
              <path d={d} stroke="url(#cc-arc)" strokeWidth="1.4" fill="none" />
              <path
                d={d}
                className="cc-arc-flow"
                stroke="var(--cc-orange)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        })}

        {hubs.map((hub, index) => {
          const point = hubPoints[hub.key];
          return (
            <g key={hub.key}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                className="cc-ping"
                style={{ animationDelay: `${index * 0.7}s` }}
                fill="var(--cc-orange)"
              />
              <circle cx={point.x} cy={point.y} r="5" fill="var(--cc-orange)" />
              <circle cx={point.x} cy={point.y} r="2" fill="var(--cc-ink)" />
            </g>
          );
        })}
      </svg>

      {hubs.map((hub) => {
        const point = hubPoints[hub.key];
        return (
          <div
            key={hub.key}
            className="absolute hidden size-0 sm:block"
            style={{
              left: `${(point.x / width) * 100}%`,
              top: `${(point.y / height) * 100 + (hub.nudge ?? 0)}%`,
            }}
          >
            <div
              className={cn(
                "absolute w-max -translate-y-1/2 rounded-ui border border-line bg-surface px-3 py-2 whitespace-nowrap shadow-cc-md",
                hub.side === "right" ? "left-4" : "right-4",
              )}
            >
              <p className="text-[0.8125rem] leading-none font-medium">{hub.city}</p>
              <p className="mt-1 font-mono text-[0.625rem] tracking-[0.14em] text-orange uppercase">
                {hub.role}
              </p>
            </div>
          </div>
        );
      })}

      {/* En mobile las etiquetas no entran sobre el mapa: van debajo. */}
      <ul className="absolute inset-x-0 -bottom-2 flex flex-wrap gap-x-4 gap-y-1 sm:hidden">
        {hubs.map((hub) => (
          <li
            key={hub.key}
            className="font-mono text-[0.6875rem] tracking-[0.12em] uppercase"
          >
            {hub.city}
          </li>
        ))}
      </ul>
    </figure>
  );
}
