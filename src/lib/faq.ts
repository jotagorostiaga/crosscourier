export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Se muestra en Home. */
  featured?: boolean;
  topic: "regimen" | "operacion" | "servicios" | "exportacion";
};

export const faqs: FaqItem[] = [
  {
    id: "limite-courier",
    question: "¿Cuánto puedo importar por courier?",
    answer:
      "El régimen courier tiene topes de valor y de peso por envío: hasta USD 3.000 y 50 kg. Si tu operación supera alguno de los dos, todavía se puede resolver, pero se analiza bajo otra modalidad de carga internacional. Contanos los datos del envío y te confirmamos el encuadre antes de avanzar.",
    featured: true,
    topic: "regimen",
  },
  {
    id: "inscripcion",
    question: "¿Necesito estar inscripto como importador?",
    answer:
      "Depende del régimen bajo el que viaje la operación y de quién sea el destinatario. El régimen courier está pensado justamente para simplificar ese punto en envíos de bajo volumen. Antes de cotizar revisamos tu caso y te decimos qué necesitás, para que no arranques un trámite que no corresponde.",
    featured: true,
    topic: "regimen",
  },
  {
    id: "priority-vs-standard",
    question: "¿Qué diferencia hay entre Priority y Standard?",
    answer:
      "Las dos son modalidades aéreas puerta a puerta. Priority tiene prioridad de embarque y se usa cuando el tiempo define la operación: un repuesto que frena una producción, una muestra en instancia de decisión. Standard mantiene la vía aérea con una prioridad menor y un costo más bajo, para envíos que se pueden planificar.",
    featured: true,
    topic: "servicios",
  },
  {
    id: "cuando-maritimo",
    question: "¿Cuándo conviene Courier Marítimo?",
    answer:
      "Cuando la compra se puede planificar y la mercadería pesa o tiene volumen. El tránsito es bastante más largo que el aéreo, pero el costo por kilo cambia por completo. Es la alternativa que más usamos para compras desde China y desde Miami.",
    featured: true,
    topic: "servicios",
  },
  {
    id: "productos",
    question: "¿Qué productos puedo importar?",
    answer:
      "La mayoría de la mercadería comercial se puede importar, pero hay categorías con restricciones o con requisitos adicionales: baterías de litio, líquidos, alimentos, productos con certificación obligatoria y mercadería con documentación especial. Contanos qué producto es y te confirmamos si se puede y bajo qué condiciones.",
    featured: true,
    topic: "operacion",
  },
  {
    id: "exporta-simple",
    question: "¿Cuándo puedo usar Exporta Simple?",
    answer:
      "Exporta Simple es un régimen pensado para PyMEs y emprendedores que necesitan hacer una exportación comercial sin la estructura del régimen general. Permite operaciones de hasta USD 15.000 por envío. Si tu venta supera ese monto, la analizamos como carga internacional.",
    featured: true,
    topic: "exportacion",
  },
  {
    id: "consolidar",
    question: "¿Puedo juntar compras de varios proveedores?",
    answer:
      "Sí, y en general conviene. Te damos una dirección de recepción en nuestro warehouse de Miami, Shanghái o Shenzhen. Cada proveedor entrega ahí cuando puede, nosotros registramos los bultos, y cuando la compra está completa la consolidamos en una sola operación internacional.",
    topic: "operacion",
  },
  {
    id: "cuanto-tarda",
    question: "¿Cuánto tarda una operación?",
    answer:
      "Depende de la modalidad, del origen y del tipo de mercadería. El aéreo Priority es la alternativa más rápida y el marítimo la más económica, con un tránsito bastante mayor. Cuando analizamos tu operación te damos un plazo estimado concreto, no un rango genérico.",
    topic: "operacion",
  },
  {
    id: "carga-general",
    question: "¿Qué pasa si mi carga excede el régimen courier?",
    answer:
      "La operación no se cae: cambia de modalidad. Cuando el peso, el valor, el volumen o el tipo de mercadería requieren otra vía, la analizamos como carga internacional con el respaldo de SouthCross Logistics y te proponemos cómo resolverla.",
    topic: "regimen",
  },
  {
    id: "seguimiento",
    question: "¿Cómo sigo mi envío?",
    answer:
      "Si ya tenés una operación en curso, podés consultarla desde la sección Seguir mi envío con el número de operación que te entregamos. Además tenés un contacto directo del equipo que está coordinando el envío.",
    topic: "operacion",
  },
  {
    id: "warehouse-uso",
    question: "¿Puedo usar el warehouse sin importar con ustedes?",
    answer:
      "Sí. El warehouse funciona también como servicio en sí mismo: recepción, almacenamiento, consolidación y preparación de mercadería. Muchas empresas lo usan para administrar stock o para preparar la mercadería antes de una distribución nacional.",
    topic: "servicios",
  },
  {
    id: "seguro",
    question: "¿La mercadería viaja asegurada?",
    answer:
      "Se puede contratar cobertura sobre el valor declarado de la mercadería. Conviene definirlo antes del embarque, junto con el valor de la operación, porque impacta en la documentación.",
    topic: "operacion",
  },
];

export const featuredFaqs = faqs.filter((faq) => faq.featured);

export function getFaqs(ids: string[]): FaqItem[] {
  return ids
    .map((id) => faqs.find((faq) => faq.id === id))
    .filter((faq): faq is FaqItem => Boolean(faq));
}
