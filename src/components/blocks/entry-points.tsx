import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  WarehouseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/lib/site";

const entries = [
  {
    icon: ArrowDownIcon,
    label: "Importar",
    hint: "Traer mercadería del exterior",
    href: "/importar",
  },
  {
    icon: ArrowUpIcon,
    label: "Exportar",
    hint: "Enviar a cualquier destino",
    href: "/exportar",
  },
  {
    icon: WarehouseIcon,
    label: "Warehouse",
    hint: "Recibir y consolidar",
    href: "/warehouse",
  },
  {
    icon: MagnifyingGlassIcon,
    label: "Seguir mi envío",
    hint: "Operación en curso",
    href: routes.tracking,
  },
];

/**
 * Bandeja de accesos directos apenas termina el hero: las cuatro cosas que
 * alguien viene a hacer, en una sola pieza. El contenedor exterior las agrupa
 * como un módulo —no son cuatro tarjetas sueltas— y cada una es un objetivo de
 * toque grande, que es lo que importa en mobile.
 */
export function EntryPoints() {
  return (
    <section className="bg-bg pb-16 md:pb-24">
      <Container>
        <Reveal>
          <div className="rounded-[calc(var(--cc-radius-panel)+0.5rem)] bg-surface-2 p-2">
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {entries.map((entry) => {
                const Icon = entry.icon;
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className="group flex h-full flex-col justify-between gap-8 rounded-panel bg-surface/55 p-5 transition-[background-color,box-shadow,transform] duration-300 [transition-timing-function:var(--cc-ease)] hover:-translate-y-0.5 hover:bg-surface hover:shadow-cc-md md:min-h-[10.5rem]"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-orange-text transition-colors duration-300 group-hover:bg-orange group-hover:text-ink group-active:bg-orange-600"
                        >
                          <Icon weight="bold" className="size-5" />
                        </span>
                        <span
                          aria-hidden
                          className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-fg-muted transition-colors duration-300 group-hover:bg-ink group-hover:text-on-ink"
                        >
                          <ArrowRightIcon
                            weight="bold"
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-px"
                          />
                        </span>
                      </span>

                      <span>
                        <span className="block font-display text-[1.0625rem] font-medium tracking-[-0.015em]">
                          {entry.label}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-fg-muted">
                          {entry.hint}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
