import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { exportNav, flatNav, importNav, routes, site, warehouseNav } from "@/lib/site";

const columns = [
  { title: importNav.label, span: "md:col-span-3", links: importNav.links },
  { title: exportNav.label, span: "md:col-span-3", links: exportNav.links },
  {
    title: "CrossCourier",
    span: "md:col-span-2",
    links: [
      { label: warehouseNav.label, href: warehouseNav.href },
      ...flatNav,
      { label: "Seguir mi envío", href: routes.tracking },
      { label: "Cotizá tu envío", href: routes.quote },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // El padding inferior deja lugar a la barra fija de cotización en mobile.
    <footer className="bg-surface-ink-2 pb-20 text-on-ink lg:pb-0">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Logo tone="ink" />
            <p className="mt-5 max-w-[30ch] font-display text-lg tracking-[-0.01em] text-on-ink">
              {site.tagline}
            </p>
            <dl className="mt-8 space-y-3 text-[0.9375rem] text-on-ink-muted">
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="underline-offset-4 hover:text-on-ink hover:underline"
                  >
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">WhatsApp</dt>
                <dd>{site.contact.whatsappLabel}</dd>
              </div>
              <div>
                <dt className="sr-only">Dirección</dt>
                <dd>{site.contact.address}</dd>
              </div>
            </dl>
          </div>

          {columns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={column.span}
            >
              <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase">
                {column.title}
              </p>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-on-ink-muted underline-offset-4 transition-colors hover:text-on-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line-on-ink py-8 text-[0.8125rem] text-on-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            {year} {site.name}. Operaciones con el respaldo de {site.backing}.
          </p>
          <p className="font-mono tracking-[0.08em] uppercase">
            {site.hubs.join(" / ")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
