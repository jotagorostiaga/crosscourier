import type { LeadStatus, QuoteState } from "@/lib/quote/types";

const COURIER_WEIGHT_LIMIT_KG = 50;

export function totalWeight(state: QuoteState): number {
  const perPackage = Number.parseFloat(state.weightPerPackage.replace(",", "."));
  if (!Number.isFinite(perPackage)) return 0;
  return perPackage * Math.max(1, state.packages);
}

/** Señales que sacan la operación del régimen courier. */
export function exceedsCourierRegime(state: QuoteState): boolean {
  return (
    state.valueBracket === "gt3000" ||
    totalWeight(state) > COURIER_WEIGHT_LIMIT_KG
  );
}

const CORPORATE_FREE_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "live.com",
  "icloud.com",
];

export function hasCorporateEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return !CORPORATE_FREE_DOMAINS.includes(domain);
}

/**
 * Clasificación inicial del lead para el CRM.
 * HOT      empresa + operación inmediata + recurrencia relevante
 * COLD     operación futura o todavía evaluativa
 * ONE SHOT operación puntual claramente definida
 * ASESORIA operación especial, restricción o carga fuera de régimen
 */
export function leadStatus(state: QuoteState): LeadStatus {
  if (state.need === "no-se" || exceedsCourierRegime(state)) {
    return "ASESORIA";
  }

  const isCompany = state.company.trim().length > 1 || hasCorporateEmail(state.email);
  const recurring = state.frequency === "3-5" || state.frequency === "6-10" || state.frequency === "10+";
  const immediate = state.urgency === "asap" || state.urgency === "semana";
  const cargoDefined = Boolean(state.cargoKind) && totalWeight(state) > 0;

  if (isCompany && immediate && recurring) return "HOT";
  if (state.urgency === "evaluando") return "COLD";
  if (isCompany && !immediate && !recurring) return "COLD";
  if (cargoDefined) return "ONE SHOT";
  return "COLD";
}

export type Recommendation = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

/**
 * Orientación que se le devuelve al usuario antes de pedirle los datos.
 * Es una hipótesis de modalidad, no una cotización cerrada.
 */
export function recommendService(state: QuoteState): Recommendation {
  if (exceedsCourierRegime(state)) {
    return {
      title: "Tu operación probablemente exceda el régimen courier",
      body: "Por el valor o el peso declarado, la analizamos como carga internacional. No se cae: cambia de modalidad y la revisa un especialista.",
      href: "/importar/carga-sin-limites",
      linkLabel: "Ver Carga sin Límites",
    };
  }

  if (state.need === "no-se") {
    return {
      title: "Vamos a definir la modalidad con vos",
      body: "Con los datos que cargaste, un especialista revisa el encuadre y te propone la alternativa que corresponde a la operación.",
      href: "/crosscourier",
      linkLabel: "Conocer CrossCourier",
    };
  }

  if (state.need === "exportar") {
    if (state.urgency === "asap" || state.urgency === "semana") {
      return {
        title: "Apunta a Courier Aéreo Priority",
        body: "Por el plazo que marcaste, la vía aérea con prioridad de embarque es la alternativa que mejor se adapta.",
        href: "/exportar/courier-aereo-priority",
        linkLabel: "Conocer Priority",
      };
    }
    return {
      title: "Puede encuadrar en Exporta Simple",
      body: "Para exportaciones comerciales de PyMEs suele ser el camino más corto. Lo confirmamos según el valor y el destino de la operación.",
      href: "/exportar/exporta-simple",
      linkLabel: "Conocer Exporta Simple",
    };
  }

  if (state.need === "muestras") {
    return {
      title: "Apunta a Courier Aéreo",
      body: "Las muestras y la documentación viajan por vía aérea puerta a puerta. Definimos Priority o Standard según la fecha que tengas.",
      href: "/importar/courier-aereo-standard",
      linkLabel: "Ver courier aéreo",
    };
  }

  if (state.urgency === "asap" || state.urgency === "semana") {
    return {
      title: "Apunta a Courier Aéreo Priority",
      body: "Por la urgencia que marcaste, la prioridad de embarque es lo que mejor se adapta a la operación.",
      href: "/importar/courier-aereo-priority",
      linkLabel: "Conocer Priority",
    };
  }

  const maritimeOrigin =
    state.originCountry === "CN" || state.originCountry === "US";

  if (maritimeOrigin && (state.urgency === "evaluando" || state.urgency === "mes")) {
    return {
      title: "Puede convenirte Courier Marítimo",
      body: "El origen y el plazo que marcaste habilitan la vía marítima, que cambia bastante el costo por kilo frente al aéreo.",
      href:
        state.originCountry === "CN"
          ? "/importar/courier-maritimo/desde-china"
          : "/importar/courier-maritimo/desde-miami",
      linkLabel: "Conocer Courier Marítimo",
    };
  }

  return {
    title: "Apunta a Courier Aéreo Standard",
    body: "Mantiene la agilidad del transporte aéreo sin el costo de la prioridad de embarque.",
    href: "/importar/courier-aereo-standard",
    linkLabel: "Conocer Standard",
  };
}
