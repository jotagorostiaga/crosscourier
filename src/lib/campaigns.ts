import type { MediaKey } from "@/lib/media";
import type { QuotePrefill } from "@/lib/quote/types";

export type Campaign = {
  slug: string;
  /** Intención de búsqueda que atiende la landing. */
  intent: string;
  /** Etiqueta corta que se muestra arriba del título. */
  label: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  lead: string;
  /** Tres pruebas concretas, no claims genéricos. */
  points: { title: string; body: string }[];
  prefill: QuotePrefill;
  faqIds: string[];
  media: MediaKey;
  alt: string;
  relatedHref: string;
  relatedLabel: string;
};

export const campaigns: Campaign[] = [
  {
    slug: "importar-repuestos",
    label: "Importar repuestos",
    intent: "traer repuestos del exterior",
    seoTitle: "Importar repuestos del exterior sin frenar la operación",
    seoDescription:
      "Traé repuestos desde China, Estados Unidos o Europa. Analizamos la operación y coordinamos la recolección con tu proveedor.",
    h1: "Traé el repuesto antes de que la operación se frene.",
    lead: "Importación de repuestos y componentes desde cualquier origen. Definimos la modalidad según la urgencia y coordinamos con tu proveedor.",
    points: [
      {
        title: "Recolección en la puerta del proveedor",
        body: "No necesitás que tu proveedor sepa exportar. Coordinamos el retiro nosotros.",
      },
      {
        title: "Modalidad según la urgencia real",
        body: "Aéreo prioritario cuando el tiempo manda, marítimo cuando la compra se puede planificar.",
      },
      {
        title: "Encuadre confirmado antes de avanzar",
        body: "Te decimos si entra por courier o si hay que analizarla como carga internacional.",
      },
    ],
    prefill: { need: "importar", cargoKind: "repuestos" },
    faqIds: ["limite-courier", "productos", "priority-vs-standard"],
    media: "priority",
    alt: "Repuestos embalados y listos para embarque aéreo",
    relatedHref: "/importar/courier-aereo-priority",
    relatedLabel: "Conocer Courier Aéreo Priority",
  },
  {
    slug: "importar-desde-china",
    label: "Importar desde China",
    intent: "importar de china puerta a puerta",
    seoTitle: "Importar desde China puerta a puerta",
    seoDescription:
      "Recibimos tu mercadería en Shanghái y Shenzhen, consolidamos y coordinamos la operación completa hasta Argentina.",
    h1: "Importar desde China, resuelto de punta a punta.",
    lead: "Te damos una dirección de recepción en Shanghái y Shenzhen. Tu proveedor entrega ahí y nosotros armamos la operación internacional.",
    points: [
      {
        title: "Dirección propia en origen",
        body: "Warehouses en Shanghái y Shenzhen para recibir a tus proveedores.",
      },
      {
        title: "Consolidación incluida",
        body: "Si comprás a varios proveedores, esperamos y despachamos todo junto.",
      },
      {
        title: "Aéreo o marítimo según el número",
        body: "Comparamos las dos vías sobre tu operación concreta antes de decidir.",
      },
    ],
    prefill: { need: "importar", originCountry: "CN" },
    faqIds: ["cuando-maritimo", "consolidar", "limite-courier"],
    media: "china",
    alt: "Terminal de contenedores en un puerto chino",
    relatedHref: "/importar/courier-maritimo/desde-china",
    relatedLabel: "Conocer Courier Marítimo desde China",
  },
  {
    slug: "importar-tecnologia",
    label: "Importar tecnología",
    intent: "importar tecnología",
    seoTitle: "Importar tecnología e insumos electrónicos",
    seoDescription:
      "Traé equipamiento, componentes electrónicos e insumos de tecnología con el encuadre correcto y la documentación resuelta.",
    h1: "Importar tecnología, con las restricciones revisadas antes.",
    lead: "Equipamiento, componentes y electrónica desde Estados Unidos, China y Europa. Revisamos restricciones y documentación antes de mover la mercadería.",
    points: [
      {
        title: "Revisamos restricciones del producto",
        body: "Baterías, certificaciones y documentación especial se chequean antes del embarque.",
      },
      {
        title: "Modalidad aérea o marítima",
        body: "Según el volumen, el valor declarado y el plazo con el que contás.",
      },
      {
        title: "Operaciones recurrentes",
        body: "Si reponés seguido, ordenamos la operación como una cuenta y no como envíos sueltos.",
      },
    ],
    prefill: { need: "importar", cargoKind: "equipamiento" },
    faqIds: ["productos", "limite-courier", "inscripcion"],
    media: "standard",
    alt: "Carga preparada y envuelta lista para transporte aéreo",
    relatedHref: "/importar/courier-aereo-standard",
    relatedLabel: "Conocer Courier Aéreo Standard",
  },
  {
    slug: "courier-internacional",
    label: "Courier internacional",
    intent: "courier internacional argentina",
    seoTitle: "Courier internacional en Argentina",
    seoDescription:
      "Courier internacional puerta a puerta para importar y exportar. Analizamos tu operación y te decimos qué modalidad corresponde.",
    h1: "Courier internacional, con criterio operativo.",
    lead: "Importación y exportación puerta a puerta. Antes de cotizar entendemos qué necesitás mover, con qué plazo y bajo qué régimen puede viajar.",
    points: [
      {
        title: "Importar y exportar",
        body: "Aéreo prioritario, aéreo estándar, marítimo, consolidación y Exporta Simple.",
      },
      {
        title: "Encuadre antes que precio",
        body: "Un régimen mal elegido cuesta más que la diferencia de flete.",
      },
      {
        title: "Cargas fuera de régimen",
        body: "Si tu operación excede el courier, la analizamos como carga internacional.",
      },
    ],
    prefill: {},
    faqIds: ["limite-courier", "inscripcion", "carga-general"],
    media: "warehouse",
    alt: "Pasillo de warehouse con mercadería preparada para despacho",
    relatedHref: "/importar",
    relatedLabel: "Ver todas las opciones para importar",
  },
  {
    slug: "enviar-muestras-al-exterior",
    label: "Enviar muestras al exterior",
    intent: "enviar muestras al exterior",
    seoTitle: "Enviar muestras al exterior",
    seoDescription:
      "Envío de muestras y documentación al exterior puerta a puerta, con la prioridad que necesita cada operación comercial.",
    h1: "Que la muestra llegue antes de la decisión.",
    lead: "Envío de muestras y documentación a cualquier destino. Prioridad de embarque cuando la negociación tiene fecha.",
    points: [
      {
        title: "Retiro en tu domicilio",
        body: "Coordinamos el retiro en Argentina el mismo día cuando la operación lo permite.",
      },
      {
        title: "Documentación resuelta",
        body: "Te decimos qué necesita el destino antes de despachar.",
      },
      {
        title: "Seguimiento hasta la entrega",
        body: "Confirmamos la recepción del destinatario final.",
      },
    ],
    prefill: { need: "muestras", originCountry: "AR" },
    faqIds: ["priority-vs-standard", "cuanto-tarda", "exporta-simple"],
    media: "expo-priority",
    alt: "Muestra comercial embalada para envío internacional",
    relatedHref: "/exportar/courier-aereo-priority",
    relatedLabel: "Conocer Courier Aéreo Priority",
  },
  {
    slug: "exporta-simple",
    label: "Exporta Simple",
    intent: "requisitos exporta simple",
    seoTitle: "Exporta Simple para PyMEs",
    seoDescription:
      "Exportá hasta USD 15.000 por envío con el régimen simplificado. Te acompañamos en la operación y en la documentación.",
    h1: "Ya vendiste al exterior. Ahora exportá como corresponde.",
    lead: "Exporta Simple permite hacer una exportación comercial sin la estructura del régimen general. Revisamos si tu operación encuadra y te acompañamos.",
    points: [
      {
        title: "Hasta USD 15.000 por envío",
        body: "Es el tope del régimen. Si lo superás, analizamos la operación como carga internacional.",
      },
      {
        title: "Pensado para PyMEs",
        body: "No necesitás montar un área de comercio exterior para hacer tu primera exportación.",
      },
      {
        title: "Documentación explicada",
        body: "Te decimos exactamente qué necesitás y en qué orden.",
      },
    ],
    prefill: { need: "exportar", originCountry: "AR" },
    faqIds: ["exporta-simple", "carga-general", "cuanto-tarda"],
    media: "exporta-simple",
    alt: "Revisión de documentación de exportación en una oficina",
    relatedHref: "/exportar/exporta-simple",
    relatedLabel: "Conocer Exporta Simple",
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}
