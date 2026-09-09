import type { MediaKey } from "@/lib/media";
import type { QuotePrefill } from "@/lib/quote/types";

export type ServiceKey =
  | "impo-priority"
  | "impo-standard"
  | "impo-maritimo"
  | "impo-maritimo-china"
  | "impo-maritimo-miami"
  | "impo-consolidacion"
  | "impo-carga-sin-limites"
  | "expo-priority"
  | "expo-standard"
  | "expo-exporta-simple";

export type ServiceStep = {
  title: string;
  body: string;
};

export type ServiceFact = {
  label: string;
  value: string;
  note?: string;
};

export type Service = {
  key: ServiceKey;
  slug: string;
  direction: "importar" | "exportar";
  /** Nombre comercial completo. */
  name: string;
  /** Frase de necesidad. Es lo que el usuario piensa, no el nombre técnico. */
  promise: string;
  /** Meta title y description. */
  seoTitle: string;
  seoDescription: string;
  /** Hero de la landing. */
  h1: string;
  lead: string;
  /** Situación → problema. */
  situation: {
    title: string;
    body: string;
  };
  /** Para quién es y para quién no. Ordena expectativas antes de cotizar. */
  fitFor: string[];
  notFor?: {
    body: string;
    href: string;
    label: string;
  };
  /** Qué incluye la operación. */
  includes: string[];
  /** Cómo funciona. */
  steps: ServiceStep[];
  /** Datos verificables del régimen o del servicio. Nada inventado. */
  facts?: ServiceFact[];
  /** Preguntas frecuentes propias de esta landing (ids de lib/faq). */
  faqIds: string[];
  /** Contexto que se precarga en el cotizador desde esta página. */
  prefill: QuotePrefill;
  /** Foto de cabecera. */
  media: {
    key: MediaKey;
    alt: string;
    /**
     * Punto focal del recorte (valor de `object-position`). Se usa cuando el
     * sujeto no está al centro y el encuadre vertical lo cortaría.
     */
    focus?: string;
  };
};

const COURIER_LIMITS: ServiceFact[] = [
  {
    label: "Valor máximo por envío",
    value: "USD 3.000",
    note: "Límite del régimen courier",
  },
  {
    label: "Peso máximo por envío",
    value: "50 kg",
    note: "Límite del régimen courier",
  },
  {
    label: "Modalidad",
    value: "Puerta a puerta",
    note: "Sin gestión aduanera propia",
  },
];

const EXPORT_FACTS: ServiceFact[] = [
  {
    label: "Modalidad",
    value: "Puerta a puerta",
    note: "Retiro en Argentina y entrega al destinatario",
  },
  {
    label: "Condiciones del envío",
    value: "Se confirman por operación",
    note: "Dependen del destino y del tipo de mercadería",
  },
];

export const services: Service[] = [
  {
    key: "impo-priority",
    slug: "/importar/courier-aereo-priority",
    direction: "importar",
    name: "Courier Aéreo Priority",
    promise: "Cuando necesitás que llegue rápido.",
    seoTitle: "Courier Aéreo Priority: importar urgente desde el exterior",
    seoDescription:
      "Importación puerta a puerta por vía aérea para operaciones donde el tiempo manda: repuestos, muestras y mercadería crítica. Contanos tu operación y cotizamos.",
    h1: "Cuando la operación no puede esperar.",
    lead: "Importación aérea prioritaria para repuestos, muestras y mercadería crítica. Analizamos la operación, definimos la ruta y coordinamos la recolección en origen.",
    situation: {
      title: "Una máquina parada cuesta más que el flete",
      body: "Cuando falta un repuesto, se frena una línea de producción, una obra o una entrega comprometida. En esos casos el costo real no está en el envío: está en el tiempo que la operación queda detenida. Priority existe para esas situaciones.",
    },
    fitFor: [
      "Repuestos que frenan una producción o un servicio",
      "Muestras que necesitan llegar antes de una decisión de compra",
      "Mercadería con fecha comprometida con un cliente",
      "Envíos de bajo volumen y alta urgencia",
    ],
    notFor: {
      body: "Si el envío supera los límites del régimen courier en peso, valor o volumen, la operación se analiza como carga internacional.",
      href: "/importar/carga-sin-limites",
      label: "Ver Carga sin Límites",
    },
    includes: [
      "Recolección en el domicilio del proveedor en origen",
      "Transporte aéreo con prioridad de embarque",
      "Gestión documental del régimen courier",
      "Entrega puerta a puerta en Argentina",
      "Seguimiento y contacto directo durante la operación",
    ],
    steps: [
      {
        title: "Contanos qué necesitás traer",
        body: "Producto, origen, peso aproximado y valor. Con eso ya podemos identificar si la operación entra por courier.",
      },
      {
        title: "Analizamos y te confirmamos la modalidad",
        body: "Revisamos restricciones del producto, documentación necesaria y ruta disponible desde el origen.",
      },
      {
        title: "Coordinamos la recolección",
        body: "Nos ponemos en contacto con tu proveedor y organizamos el retiro de la mercadería.",
      },
      {
        title: "Seguís la operación hasta la entrega",
        body: "Tenés un equipo que responde durante todo el proceso, no un número de seguimiento y nada más.",
      },
    ],
    facts: COURIER_LIMITS,
    faqIds: ["priority-vs-standard", "limite-courier", "inscripcion", "productos"],
    prefill: { need: "importar", urgency: "asap" },
    media: {
      key: "priority",
      alt: "Operario preparando paquetes para embarque aéreo en un depósito",
    },
  },
  {
    key: "impo-standard",
    slug: "/importar/courier-aereo-standard",
    direction: "importar",
    name: "Courier Aéreo Standard",
    promise: "Cuando buscás una alternativa aérea eficiente.",
    seoTitle: "Courier Aéreo Standard: importar por avión sin prioridad máxima",
    seoDescription:
      "Importación aérea puerta a puerta para operaciones que necesitan agilidad pero no un servicio prioritario. Analizamos tu envío y te decimos qué modalidad conviene.",
    h1: "La agilidad del avión, sin pagar la urgencia.",
    lead: "Para operaciones que necesitan transporte aéreo pero pueden esperar unos días más. Misma operatoria courier, otra prioridad de embarque.",
    situation: {
      title: "No todo lo que viaja en avión es urgente",
      body: "Muchas empresas pagan un servicio prioritario para mercadería que podía esperar tres o cuatro días. Standard mantiene el envío por vía aérea y la entrega puerta a puerta, pero sin el costo de la prioridad de embarque.",
    },
    fitFor: [
      "Reposición de stock planificada",
      "Insumos y componentes de compra recurrente",
      "Productos de valor medio donde el costo del flete pesa",
      "Compras a proveedores con fecha de despacho conocida",
    ],
    includes: [
      "Recolección en origen",
      "Transporte aéreo en régimen courier",
      "Gestión documental",
      "Entrega puerta a puerta en Argentina",
      "Seguimiento de la operación",
    ],
    steps: [
      {
        title: "Contanos qué necesitás traer",
        body: "Con producto, origen, peso y valor definimos si conviene Standard o Priority.",
      },
      {
        title: "Comparamos la alternativa",
        body: "Te mostramos la diferencia real entre modalidades para tu operación puntual.",
      },
      {
        title: "Coordinamos con tu proveedor",
        body: "Organizamos el retiro y la documentación necesaria para el embarque.",
      },
      {
        title: "Entrega y acompañamiento",
        body: "Seguimos la operación hasta que la mercadería llega a destino.",
      },
    ],
    facts: COURIER_LIMITS,
    faqIds: ["priority-vs-standard", "limite-courier", "productos", "cuanto-tarda"],
    prefill: { need: "importar" },
    media: {
      key: "standard",
      alt: "Pallets de carga entrando a la bodega de un avión carguero",
    },
  },
  {
    key: "impo-maritimo",
    slug: "/importar/courier-maritimo",
    direction: "importar",
    name: "Courier Marítimo",
    promise: "Cuando podés esperar más para optimizar el costo.",
    seoTitle: "Courier Marítimo: importar desde China y Miami",
    seoDescription:
      "Importación marítima con operatoria courier desde China y Miami. Para compras planificadas donde el costo pesa más que el tiempo de tránsito.",
    h1: "Más tiempo de tránsito, mejor costo por kilo.",
    lead: "Una alternativa para importar desde China y Miami combinando transporte marítimo con la operatoria courier. Pensada para compras planificadas.",
    situation: {
      title: "El flete aéreo no siempre cierra",
      body: "Cuando la mercadería pesa, ocupa volumen o tiene un margen ajustado, el aéreo se come la rentabilidad de la compra. Si la operación se puede planificar con anticipación, el marítimo cambia por completo el número final.",
    },
    fitFor: [
      "Compras de reposición planificadas con anticipación",
      "Mercadería voluminosa o pesada para su valor",
      "Proveedores habituales en China o Estados Unidos",
      "Operaciones donde el costo define la decisión",
    ],
    includes: [
      "Recepción de la mercadería en nuestro warehouse de origen",
      "Consolidación con otras compras si corresponde",
      "Transporte marítimo",
      "Gestión documental de la operación",
      "Entrega en Argentina",
    ],
    steps: [
      {
        title: "Definimos origen y volumen",
        body: "China y Miami son las rutas donde el marítimo courier tiene más sentido.",
      },
      {
        title: "Recibimos la mercadería en origen",
        body: "Tu proveedor entrega en nuestro warehouse. Vos no coordinás nada de eso.",
      },
      {
        title: "Consolidamos y embarcamos",
        body: "Si hay más de una compra, viajan juntas en una sola operación.",
      },
      {
        title: "Entrega en Argentina",
        body: "Te avisamos cada hito relevante del tránsito hasta la entrega.",
      },
    ],
    faqIds: ["cuando-maritimo", "limite-courier", "consolidar", "cuanto-tarda"],
    prefill: { need: "importar", urgency: "evaluando" },
    media: {
      key: "maritimo",
      alt: "Pallets en el muelle de una terminal portuaria, con un buque portacontenedores al fondo",
    },
  },
  {
    key: "impo-maritimo-china",
    slug: "/importar/courier-maritimo/desde-china",
    direction: "importar",
    name: "Courier Marítimo desde China",
    promise: "Compraste en China y querés optimizar el flete.",
    seoTitle: "Importar desde China: courier marítimo puerta a puerta",
    seoDescription:
      "Importá desde China con operatoria courier marítima. Recibimos en nuestro warehouse en Shanghái y Shenzhen, consolidamos y coordinamos la operación completa.",
    h1: "Importar desde China sin coordinar cada eslabón.",
    lead: "Recibimos tu mercadería en nuestros warehouses de Shanghái y Shenzhen, la consolidamos y armamos una sola operación hasta Argentina.",
    situation: {
      title: "El problema no es comprar en China, es traerlo",
      body: "Conseguir el proveedor suele ser la parte fácil. Después aparecen el retiro en fábrica, el depósito de consolidación, la documentación, el embarque y la coordinación con alguien en otro huso horario. Ahí es donde la operación se traba.",
    },
    fitFor: [
      "Compras a uno o varios proveedores chinos",
      "Mercadería que llega en distintos momentos",
      "Volumen que no justifica un contenedor completo",
      "Empresas que compran de forma recurrente",
    ],
    includes: [
      "Dirección de recepción en Shanghái y Shenzhen",
      "Recepción y control de bultos",
      "Almacenamiento a la espera de otros proveedores",
      "Consolidación y embarque marítimo",
      "Entrega en Argentina",
    ],
    steps: [
      {
        title: "Te damos una dirección en China",
        body: "Tu proveedor entrega ahí. No necesitás coordinar el retiro vos mismo.",
      },
      {
        title: "Recibimos y esperamos",
        body: "Si comprás a varios proveedores, guardamos la mercadería hasta completar la compra.",
      },
      {
        title: "Consolidamos y embarcamos",
        body: "Todo viaja como una sola operación internacional.",
      },
      {
        title: "Seguimiento hasta la entrega",
        body: "Un equipo en Argentina responde por la operación completa.",
      },
    ],
    faqIds: ["cuando-maritimo", "consolidar", "productos", "limite-courier"],
    prefill: {
      need: "importar",
      originCountry: "CN",
      urgency: "evaluando",
    },
    media: {
      key: "maritimo-china",
      alt: "Buque portacontenedores cargando en un puerto de China",
    },
  },
  {
    key: "impo-maritimo-miami",
    slug: "/importar/courier-maritimo/desde-miami",
    direction: "importar",
    name: "Courier Marítimo desde Miami",
    promise: "Compraste en Estados Unidos y querés bajar el costo del flete.",
    seoTitle: "Importar desde Miami: courier marítimo para compras en EEUU",
    seoDescription:
      "Importá desde Estados Unidos con operatoria courier marítima. Recibimos tus compras en Miami, las consolidamos y coordinamos la operación hasta Argentina.",
    h1: "Comprás en Estados Unidos. Nosotros lo traemos.",
    lead: "Recibimos tus compras en nuestro warehouse de Miami, esperamos a que llegue todo y armamos una sola operación hacia Argentina.",
    situation: {
      title: "Varias compras, varios envíos, varios costos",
      body: "Comprar en Estados Unidos es simple hasta que aparecen cinco proveedores distintos, cinco entregas en fechas distintas y cinco fletes internacionales. Consolidar en Miami convierte todo eso en una sola operación.",
    },
    fitFor: [
      "Compras en tiendas y proveedores de Estados Unidos",
      "Mercadería que llega en fechas distintas",
      "Repuestos, accesorios, tecnología e insumos",
      "Empresas que compran de forma recurrente en EEUU",
    ],
    includes: [
      "Dirección de recepción en Miami",
      "Recepción y control de bultos",
      "Almacenamiento durante la espera",
      "Consolidación y embarque",
      "Entrega en Argentina",
    ],
    steps: [
      {
        title: "Comprás y enviás a nuestra dirección en Miami",
        body: "Usás la dirección del warehouse como destino de tus compras.",
      },
      {
        title: "Recibimos y controlamos",
        body: "Registramos cada bulto que llega a tu nombre.",
      },
      {
        title: "Consolidamos cuando lo indicás",
        body: "Vos decidís cuándo cerrar la operación y despachar.",
      },
      {
        title: "Entrega en Argentina",
        body: "Coordinamos el tránsito y la entrega final.",
      },
    ],
    faqIds: ["consolidar", "limite-courier", "productos", "cuanto-tarda"],
    prefill: {
      need: "importar",
      originCountry: "US",
      originCity: "Miami",
    },
    media: {
      key: "maritimo-miami",
      alt: "Warehouse de Miami con mercadería lista para consolidar",
    },
  },
  {
    key: "impo-consolidacion",
    slug: "/importar/consolidacion-de-compras",
    direction: "importar",
    name: "Consolidación de Compras",
    promise: "¿Compraste a varios proveedores? Consolidá antes de enviar.",
    seoTitle: "Consolidación de compras internacionales",
    seoDescription:
      "Recibimos tus compras en nuestros warehouses, las almacenamos y las reunimos para preparar una única operación internacional hacia Argentina.",
    h1: "Varias compras. Una sola operación.",
    lead: "Recibimos tus compras en nuestros warehouses, las guardamos hasta que llegue todo y preparamos un único envío internacional.",
    situation: {
      title: "Cinco proveedores no tienen por qué ser cinco envíos",
      body: "Cuando la compra se arma de a partes, cada proveedor despacha cuando puede. Sin un punto de recepción común, cada bulto se transforma en una operación internacional separada, con su propio costo y su propia coordinación.",
    },
    fitFor: [
      "Compras a distintos proveedores en un mismo origen",
      "Mercadería que se despacha en momentos diferentes",
      "Empresas que arman surtido antes de importar",
      "Compras recurrentes que conviene agrupar",
    ],
    includes: [
      "Dirección de recepción en el warehouse de origen",
      "Recepción, control y registro de bultos",
      "Almacenamiento a la espera del resto de la compra",
      "Consolidación en una sola operación",
      "Preparación documental y despacho",
    ],
    steps: [
      {
        title: "Te damos la dirección del warehouse",
        body: "Miami, Shanghái o Shenzhen, según dónde estés comprando.",
      },
      {
        title: "Tus proveedores entregan ahí",
        body: "Cada uno despacha cuando puede. Nosotros registramos lo que llega.",
      },
      {
        title: "Esperamos a que esté completo",
        body: "La mercadería queda almacenada hasta que definís cerrar la compra.",
      },
      {
        title: "Consolidamos y despachamos",
        body: "Sale como una sola operación internacional hacia Argentina.",
      },
    ],
    faqIds: ["consolidar", "cuanto-tarda", "limite-courier", "productos"],
    prefill: { need: "importar" },
    media: {
      key: "consolidacion",
      alt: "Cajas etiquetadas agrupadas en una estantería de depósito",
    },
  },
  {
    key: "impo-carga-sin-limites",
    slug: "/importar/carga-sin-limites",
    direction: "importar",
    name: "Carga sin Límites",
    promise: "Cuando tu carga excede las condiciones del courier.",
    seoTitle: "Carga internacional: operaciones fuera del régimen courier",
    seoDescription:
      "Cuando el peso, el valor, el volumen o el tipo de mercadería requieren otra modalidad, analizamos una solución de carga internacional con el respaldo de SouthCross Logistics.",
    h1: "Tu carga no entra por courier. La operación sigue igual.",
    lead: "Cuando el peso, el valor, el volumen o el tipo de mercadería requieren otra modalidad, analizamos una solución de carga internacional adaptada a la operación.",
    situation: {
      title: "El límite del régimen no es el límite de la operación",
      body: "El régimen courier tiene topes de peso y valor. Cuando una operación los supera, muchas empresas escuchan un no y vuelven a empezar la búsqueda. Con el respaldo de SouthCross Logistics podemos analizar la misma operación bajo otra modalidad y seguir adelante.",
    },
    fitFor: [
      "Envíos que superan los topes del régimen courier",
      "Maquinaria, equipamiento y bienes de capital",
      "Vehículos y unidades que no se comercializan en el país",
      "Mercadería con requisitos especiales de documentación",
    ],
    includes: [
      "Análisis de factibilidad de la operación",
      "Definición de la modalidad de transporte",
      "Coordinación documental",
      "Transporte internacional",
      "Acompañamiento de un especialista durante el proceso",
    ],
    steps: [
      {
        title: "Contanos la operación completa",
        body: "Producto, origen, peso, volumen, valor y plazo estimado.",
      },
      {
        title: "Analizamos factibilidad",
        body: "Revisamos régimen aplicable, documentación y condiciones de la mercadería.",
      },
      {
        title: "Proponemos una modalidad",
        body: "Con el respaldo operativo de SouthCross Logistics.",
      },
      {
        title: "Coordinamos y acompañamos",
        body: "Un especialista queda a cargo de la operación de punta a punta.",
      },
    ],
    faqIds: ["limite-courier", "carga-general", "productos", "inscripcion"],
    prefill: { need: "no-se" },
    media: {
      key: "carga",
      alt: "Persona revisando su operación desde la computadora",
      focus: "72% center",
    },
  },
  {
    key: "expo-priority",
    slug: "/exportar/courier-aereo-priority",
    direction: "exportar",
    name: "Courier Aéreo Priority",
    promise: "Para exportaciones urgentes.",
    seoTitle: "Exportar urgente por courier aéreo Priority",
    seoDescription:
      "Exportación aérea prioritaria puerta a puerta para muestras, repuestos y envíos con fecha comprometida en el exterior.",
    h1: "Tu cliente en el exterior no puede esperar.",
    lead: "Exportación aérea prioritaria para muestras, repuestos y envíos con fecha comprometida fuera del país.",
    situation: {
      title: "Una muestra tarde es una venta perdida",
      body: "En una negociación internacional los tiempos los marca el comprador. Si la muestra llega después de la decisión, la operación se cae aunque el producto sea el correcto.",
    },
    fitFor: [
      "Muestras comerciales en instancia de decisión",
      "Repuestos para clientes o equipos en el exterior",
      "Documentación con fecha límite",
      "Envíos comprometidos con un cliente internacional",
    ],
    includes: [
      "Retiro en tu domicilio en Argentina",
      "Transporte aéreo con prioridad de embarque",
      "Gestión documental del envío",
      "Entrega puerta a puerta en destino",
      "Seguimiento durante toda la operación",
    ],
    steps: [
      {
        title: "Contanos qué enviás y a dónde",
        body: "Producto, destino, peso y valor declarado.",
      },
      {
        title: "Confirmamos la modalidad",
        body: "Revisamos restricciones del destino y documentación necesaria.",
      },
      {
        title: "Retiramos en tu domicilio",
        body: "Coordinamos el retiro en Argentina el mismo día si la operación lo permite.",
      },
      {
        title: "Entrega en destino",
        body: "Te confirmamos la entrega al destinatario final.",
      },
    ],
    facts: EXPORT_FACTS,
    faqIds: ["priority-vs-standard", "exporta-simple", "limite-courier"],
    prefill: { need: "exportar", urgency: "asap" },
    media: {
      key: "priority",
      alt: "Avión de pasajeros visto desde abajo entre edificios",
    },
  },
  {
    key: "expo-standard",
    slug: "/exportar/courier-aereo-standard",
    direction: "exportar",
    name: "Courier Aéreo Standard",
    promise: "Para exportaciones aéreas sin urgencia prioritaria.",
    seoTitle: "Exportar por courier aéreo Standard",
    seoDescription:
      "Exportación aérea puerta a puerta para envíos que necesitan avión pero no prioridad máxima de embarque.",
    h1: "Exportar por avión, sin pagar la prioridad.",
    lead: "Para envíos al exterior que necesitan transporte aéreo pero pueden esperar unos días más en el embarque.",
    situation: {
      title: "No toda exportación es una urgencia",
      body: "Los envíos recurrentes a un mismo cliente, las reposiciones y los pedidos programados no necesitan prioridad de embarque. Standard mantiene la vía aérea y la entrega puerta a puerta con otro costo.",
    },
    fitFor: [
      "Envíos recurrentes a un mismo cliente en el exterior",
      "Pedidos programados con fecha conocida",
      "Muestras sin fecha límite inmediata",
      "Mercadería de bajo volumen",
    ],
    includes: [
      "Retiro en tu domicilio en Argentina",
      "Transporte aéreo en régimen courier",
      "Gestión documental",
      "Entrega puerta a puerta en destino",
      "Seguimiento de la operación",
    ],
    steps: [
      {
        title: "Contanos la operación",
        body: "Producto, destino, peso y frecuencia estimada.",
      },
      {
        title: "Definimos modalidad",
        body: "Comparamos Standard y Priority sobre tu caso concreto.",
      },
      {
        title: "Retiro y despacho",
        body: "Coordinamos el retiro y preparamos la documentación.",
      },
      {
        title: "Entrega en destino",
        body: "Confirmamos la entrega al destinatario.",
      },
    ],
    facts: EXPORT_FACTS,
    faqIds: ["priority-vs-standard", "exporta-simple", "cuanto-tarda"],
    prefill: { need: "exportar" },
    media: {
      key: "aereo-standard",
      alt: "Paquetes avanzando por una cinta de clasificación",
    },
  },
  {
    key: "expo-exporta-simple",
    slug: "/exportar/exporta-simple",
    direction: "exportar",
    name: "Exporta Simple",
    promise: "Cuando vendés al exterior.",
    seoTitle: "Exporta Simple: exportaciones comerciales para PyMEs",
    seoDescription:
      "Régimen simplificado para que PyMEs y emprendedores exporten hasta USD 15.000 por envío. Te acompañamos en la operación completa.",
    h1: "Vendés al exterior. Exportá como corresponde.",
    lead: "Un régimen simplificado pensado para PyMEs y emprendedores que necesitan hacer una exportación comercial sin montar una estructura de comercio exterior.",
    situation: {
      title: "Vender afuera y exportar no son lo mismo",
      body: "Muchas empresas ya tienen el comprador y el producto listo, y se frenan en el trámite. Exporta Simple existe justamente para eso: permite hacer la exportación comercial con un procedimiento más corto que el régimen general.",
    },
    fitFor: [
      "PyMEs y emprendedores con ventas al exterior",
      "Primeras exportaciones comerciales",
      "Envíos de valor medio a un comprador en el exterior",
      "Empresas que exportan de forma esporádica",
    ],
    notFor: {
      body: "Si el envío supera el tope por operación o necesitás una exportación bajo régimen general, la analizamos como carga internacional.",
      href: "/importar/carga-sin-limites",
      label: "Ver Carga sin Límites",
    },
    includes: [
      "Análisis de la operación y del producto",
      "Orientación sobre la documentación necesaria",
      "Retiro de la mercadería en Argentina",
      "Transporte internacional",
      "Entrega al comprador en el exterior",
    ],
    steps: [
      {
        title: "Contanos qué vendiste y a quién",
        body: "Producto, destino, valor de la operación y plazo comprometido.",
      },
      {
        title: "Revisamos el encuadre",
        body: "Confirmamos si la operación entra por Exporta Simple.",
      },
      {
        title: "Preparamos la documentación",
        body: "Te decimos exactamente qué necesitás y en qué orden.",
      },
      {
        title: "Despacho y entrega",
        body: "Coordinamos el transporte hasta el comprador.",
      },
    ],
    facts: [
      {
        label: "Valor máximo por envío",
        value: "USD 15.000",
        note: "Tope del régimen Exporta Simple",
      },
      {
        label: "Perfil",
        value: "PyMEs y emprendedores",
        note: "Exportación comercial simplificada",
      },
    ],
    faqIds: ["exporta-simple", "limite-courier", "carga-general"],
    prefill: { need: "exportar" },
    media: {
      key: "exporta-simple",
      alt: "Equipo revisando documentación de exportación en una oficina",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function servicesByDirection(direction: "importar" | "exportar") {
  return services.filter((service) => service.direction === direction);
}
