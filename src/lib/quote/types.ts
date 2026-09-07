export type Need = "importar" | "exportar" | "muestras" | "no-se";

export type CargoKind =
  | "productos"
  | "repuestos"
  | "muestras"
  | "documentacion"
  | "equipamiento"
  | "otro";

export type ValueBracket =
  | "lt500"
  | "500-1000"
  | "1000-3000"
  | "gt3000"
  | "no-se";

export type Frequency = "1-2" | "3-5" | "6-10" | "10+";

export type Urgency = "asap" | "semana" | "mes" | "evaluando";

export type LeadStatus = "HOT" | "COLD" | "ONE SHOT" | "ASESORIA";

export type QuoteState = {
  need: Need | null;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  cargoKind: CargoKind | null;
  cargoDescription: string;
  packages: number;
  weightPerPackage: string;
  length: string;
  width: string;
  height: string;
  valueBracket: ValueBracket | null;
  frequency: Frequency | null;
  urgency: Urgency | null;
  fullName: string;
  company: string;
  email: string;
  whatsapp: string;
  acceptsContact: boolean;
};

/** Contexto que una landing puede precargar en el cotizador. */
export type QuotePrefill = Partial<
  Pick<
    QuoteState,
    | "need"
    | "originCountry"
    | "originCity"
    | "destinationCountry"
    | "destinationCity"
    | "cargoKind"
    | "cargoDescription"
    | "urgency"
  >
>;

export type TrackingContext = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  landingPath: string;
  referrer: string;
};

export type LeadPayload = QuoteState & {
  status: LeadStatus;
  suggestedService: string;
  tracking: TrackingContext;
  submittedAt: string;
};

export const emptyQuoteState: QuoteState = {
  need: null,
  originCountry: "",
  originCity: "",
  destinationCountry: "AR",
  destinationCity: "",
  cargoKind: null,
  cargoDescription: "",
  packages: 1,
  weightPerPackage: "",
  length: "",
  width: "",
  height: "",
  valueBracket: null,
  frequency: null,
  urgency: null,
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  acceptsContact: false,
};
