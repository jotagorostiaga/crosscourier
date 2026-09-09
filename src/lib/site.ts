import type { MediaKey } from "@/lib/media";

export const site = {
  name: "CrossCourier",
  tagline: "Your business, but simpler.",
  /** Reemplazar por el dominio productivo antes del deploy. */
  url: "https://www.crosscourier.com.ar",
  locale: "es-AR",
  description:
    "Courier internacional, importación, exportación, consolidación de compras y warehouse. Analizamos tu operación y te recomendamos la modalidad que corresponde.",
  contact: {
    whatsapp: "5491100000000",
    whatsappLabel: "+54 9 11 0000-0000",
    email: "comercial@crosscourier.com.ar",
    address: "Buenos Aires, Argentina",
  },
  hubs: ["Buenos Aires", "Miami", "Shanghái", "Shenzhen"],
  backing: "SouthCross Logistics",
} as const;

/**
 * De dónde se sirve el sitio realmente, sin barra final. WhatsApp, LinkedIn y
 * compañía necesitan URLs absolutas para la imagen de preview, así que en el
 * deploy de GitHub Pages hay que apuntar acá (incluye el /repositorio) en vez
 * de al dominio productivo.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export type NavLink = {
  label: string;
  href: string;
  hint?: string;
};

export type NavGroup = {
  label: string;
  href: string;
  /** Qué resuelve el grupo, en una línea. */
  intro: string;
  links: NavLink[];
  /** Foto del panel desplegable. */
  media: MediaKey;
  mediaAlt: string;
  /** Atajo destacado al pie del panel. */
  featured: NavLink;
};

export const importNav: NavGroup = {
  label: "Importar",
  href: "/importar",
  intro:
    "Traé muestras, repuestos, insumos, tecnología o mercadería desde el exterior.",
  media: "china",
  mediaAlt: "Terminal de contenedores en origen",
  featured: {
    label: "Consolidación de Compras",
    href: "/importar/consolidacion-de-compras",
    hint: "Varios proveedores, una sola operación",
  },
  links: [
    {
      label: "Courier Aéreo Priority",
      href: "/importar/courier-aereo-priority",
      hint: "Cuando necesitás que llegue rápido",
    },
    {
      label: "Courier Aéreo Standard",
      href: "/importar/courier-aereo-standard",
      hint: "Aéreo eficiente, sin prioridad máxima",
    },
    {
      label: "Courier Marítimo",
      href: "/importar/courier-maritimo",
      hint: "Desde China y Miami, optimizando costo",
    },
    {
      label: "Consolidación de Compras",
      href: "/importar/consolidacion-de-compras",
      hint: "Varios proveedores, una sola operación",
    },
    {
      label: "Carga sin Límites",
      href: "/importar/carga-sin-limites",
      hint: "Cuando la carga excede el régimen courier",
    },
    {
      label: "Desde China",
      href: "/importar/courier-maritimo/desde-china",
      hint: "Recepción en Shanghái y Shenzhen",
    },
    {
      label: "Desde Miami",
      href: "/importar/courier-maritimo/desde-miami",
      hint: "Consolidamos tus compras en Estados Unidos",
    },
  ],
};

export const exportNav: NavGroup = {
  label: "Exportar",
  href: "/exportar",
  intro:
    "Enviá muestras, documentación o productos al exterior con la modalidad adecuada.",
  media: "expo-standard",
  mediaAlt: "Paquetes de exportación en una cinta de clasificación",
  featured: {
    label: "Exporta Simple",
    href: "/exportar/exporta-simple",
    hint: "Para exportaciones comerciales de PyMEs",
  },
  links: [
    {
      label: "Courier Aéreo Priority",
      href: "/exportar/courier-aereo-priority",
      hint: "Para exportaciones urgentes",
    },
    {
      label: "Courier Aéreo Standard",
      href: "/exportar/courier-aereo-standard",
      hint: "Aéreo sin prioridad máxima de embarque",
    },
    {
      label: "Exporta Simple",
      href: "/exportar/exporta-simple",
      hint: "Para exportaciones comerciales de PyMEs",
    },
  ],
};

export const warehouseNav: NavGroup = {
  label: "Warehouse",
  href: "/warehouse",
  intro:
    "Recibí, almacená, consolidá y prepará tu mercadería en un mismo lugar.",
  media: "warehouse",
  mediaAlt: "Pasillo de warehouse con racks de pallets",
  featured: {
    label: "Red de plazas",
    href: "/warehouse#red",
    hint: "Buenos Aires, Miami, Shanghái y Shenzhen",
  },
  links: [
    {
      label: "Cómo funciona",
      href: "/warehouse#funciones",
      hint: "Recepción, almacenamiento, consolidación y despacho",
    },
    {
      label: "Para quién es",
      href: "/warehouse#para-quien",
      hint: "Compras a varios proveedores y manejo de stock",
    },
    {
      label: "Red de plazas",
      href: "/warehouse#red",
      hint: "Dónde recibimos tu mercadería",
    },
    {
      label: "Preguntas frecuentes",
      href: "/warehouse#preguntas",
      hint: "Uso del warehouse y consolidación",
    },
  ],
};

export const navGroups: NavGroup[] = [importNav, exportNav, warehouseNav];

export const flatNav: NavLink[] = [
  { label: "Nosotros", href: "/crosscourier" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
];

export const routes = {
  home: "/",
  quote: "/cotizar",
  tracking: "/seguir-mi-envio",
} as const;

export function whatsappHref(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
