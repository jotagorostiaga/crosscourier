import type { QuotePrefill, QuoteState } from "@/lib/quote/types";
import { emptyQuoteState } from "@/lib/quote/types";

export type StepId =
  | "necesidad"
  | "ruta"
  | "mercaderia"
  | "operacion"
  | "intencion"
  | "contacto";

export type StepDefinition = {
  id: StepId;
  index: number;
  /** Título de la pantalla. Una pregunta por paso. */
  title: string;
  /** Qué gana el usuario respondiendo. */
  help?: string;
};

export const steps: StepDefinition[] = [
  {
    id: "necesidad",
    index: 1,
    title: "¿Qué necesitás hacer?",
    help: "Empezamos por lo que querés resolver, no por el nombre del servicio.",
  },
  {
    id: "ruta",
    index: 2,
    title: "¿Desde dónde hacia dónde?",
    help: "El origen y el destino definen qué modalidades están disponibles.",
  },
  {
    id: "mercaderia",
    index: 3,
    title: "¿Qué querés enviar?",
    help: "El producto define restricciones, documentación y modalidad posible.",
  },
  {
    id: "operacion",
    index: 4,
    title: "Características del envío",
    help: "Con peso, medidas y valor podemos ver si entra por régimen courier.",
  },
  {
    id: "intencion",
    index: 5,
    title: "Frecuencia y plazo",
    help: "Nos permite priorizar la operación y asignarla al equipo correcto.",
  },
  {
    id: "contacto",
    index: 6,
    title: "¿A dónde te enviamos la cotización?",
  },
];

export const totalSteps = steps.length;

export type Errors = Partial<Record<keyof QuoteState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(step: StepId, state: QuoteState): Errors {
  const errors: Errors = {};

  switch (step) {
    case "necesidad":
      if (!state.need) errors.need = "Elegí una opción para continuar.";
      break;

    case "ruta":
      if (!state.originCountry) errors.originCountry = "Indicá el país de origen.";
      if (!state.destinationCountry)
        errors.destinationCountry = "Indicá el país de destino.";
      if (
        state.originCountry &&
        state.originCountry === state.destinationCountry
      ) {
        errors.destinationCountry =
          "El origen y el destino no pueden ser el mismo país.";
      }
      break;

    case "mercaderia":
      if (!state.cargoKind) errors.cargoKind = "Elegí el tipo de mercadería.";
      if (state.cargoDescription.trim().length < 3) {
        errors.cargoDescription = "Contanos brevemente qué producto es.";
      }
      break;

    case "operacion": {
      if (state.packages < 1) errors.packages = "Tiene que haber al menos un bulto.";
      const weight = Number.parseFloat(state.weightPerPackage.replace(",", "."));
      if (!state.weightPerPackage.trim()) {
        errors.weightPerPackage = "Indicá un peso aproximado.";
      } else if (!Number.isFinite(weight) || weight <= 0) {
        errors.weightPerPackage = "Ingresá un peso válido en kilos.";
      }
      if (!state.valueBracket) errors.valueBracket = "Elegí un rango de valor.";
      break;
    }

    case "intencion":
      if (!state.frequency) errors.frequency = "Elegí una frecuencia.";
      if (!state.urgency) errors.urgency = "Indicá cuándo necesitás hacerlo.";
      break;

    case "contacto":
      if (state.fullName.trim().length < 3)
        errors.fullName = "Ingresá tu nombre y apellido.";
      if (!EMAIL_PATTERN.test(state.email.trim()))
        errors.email = "Ingresá un email válido.";
      if (state.whatsapp.replace(/\D/g, "").length < 8)
        errors.whatsapp = "Ingresá un número de WhatsApp con característica.";
      if (!state.acceptsContact)
        errors.acceptsContact = "Necesitamos tu confirmación para contactarte.";
      break;
  }

  return errors;
}

export function stepValue(step: StepId, state: QuoteState): string {
  switch (step) {
    case "necesidad":
      return state.need ?? "";
    case "ruta":
      return `${state.originCountry}>${state.destinationCountry}`;
    case "mercaderia":
      return state.cargoKind ?? "";
    case "operacion":
      return state.valueBracket ?? "";
    case "intencion":
      return `${state.frequency ?? ""}|${state.urgency ?? ""}`;
    case "contacto":
      return state.company ? "empresa" : "particular";
  }
}

/** Estado inicial con el contexto que trae la landing o la campaña. */
export function initialState(prefill?: QuotePrefill): QuoteState {
  if (!prefill) return { ...emptyQuoteState };
  const next: QuoteState = { ...emptyQuoteState, ...prefill };
  if (prefill.need === "exportar" && !prefill.originCountry) {
    next.originCountry = "AR";
    next.destinationCountry = "";
  }
  return next;
}

/** Primer paso incompleto. Permite entrar directo al paso 2 desde el hero. */
export function firstIncompleteStep(state: QuoteState): number {
  for (const step of steps) {
    if (Object.keys(validateStep(step.id, state)).length > 0) {
      return step.index;
    }
  }
  return totalSteps;
}

const PREFILL_NEEDS = new Set(["importar", "exportar", "muestras", "no-se"]);
const PREFILL_CARGO = new Set([
  "productos",
  "repuestos",
  "muestras",
  "documentacion",
  "equipamiento",
  "otro",
]);
const PREFILL_URGENCY = new Set(["asap", "semana", "mes", "evaluando"]);

/** Lee el contexto de campaña desde la URL: ?need=importar&origin=CN&cargo=repuestos */
export function prefillFromParams(
  params: URLSearchParams | Record<string, string | undefined>,
): QuotePrefill {
  const get = (key: string) =>
    params instanceof URLSearchParams ? (params.get(key) ?? "") : (params[key] ?? "");

  const prefill: QuotePrefill = {};
  const need = get("need");
  if (PREFILL_NEEDS.has(need)) prefill.need = need as QuotePrefill["need"];

  const origin = get("origin").toUpperCase();
  if (origin) prefill.originCountry = origin;

  const destination = get("destination").toUpperCase();
  if (destination) prefill.destinationCountry = destination;

  const cargo = get("cargo");
  if (PREFILL_CARGO.has(cargo)) prefill.cargoKind = cargo as QuotePrefill["cargoKind"];

  const urgency = get("urgency");
  if (PREFILL_URGENCY.has(urgency))
    prefill.urgency = urgency as QuotePrefill["urgency"];

  const what = get("what").slice(0, 160).trim();
  if (what) prefill.cargoDescription = what;

  return prefill;
}
