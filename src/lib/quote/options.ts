import type {
  CargoKind,
  Frequency,
  Need,
  Urgency,
  ValueBracket,
} from "@/lib/quote/types";

export type Option<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

export const needOptions: Option<Need>[] = [
  {
    value: "importar",
    label: "Traer mercadería a Argentina",
    hint: "Importación desde cualquier origen",
  },
  {
    value: "exportar",
    label: "Enviar mercadería al exterior",
    hint: "Exportación comercial o envío puntual",
  },
  {
    value: "muestras",
    label: "Enviar muestras o documentación",
    hint: "Envíos de bajo volumen",
  },
  {
    value: "no-se",
    label: "Todavía no sé qué servicio necesito",
    hint: "Te ayudamos a definirlo",
  },
];

export const cargoOptions: Option<CargoKind>[] = [
  { value: "productos", label: "Productos / mercadería" },
  { value: "repuestos", label: "Repuestos" },
  { value: "muestras", label: "Muestras" },
  { value: "documentacion", label: "Documentación" },
  { value: "equipamiento", label: "Equipamiento" },
  { value: "otro", label: "Otro" },
];

export const valueOptions: Option<ValueBracket>[] = [
  { value: "lt500", label: "Menos de USD 500" },
  { value: "500-1000", label: "USD 500 a 1.000" },
  { value: "1000-3000", label: "USD 1.000 a 3.000" },
  { value: "gt3000", label: "Más de USD 3.000" },
  { value: "no-se", label: "No lo sé" },
];

export const frequencyOptions: Option<Frequency>[] = [
  { value: "1-2", label: "1 a 2 por mes" },
  { value: "3-5", label: "3 a 5 por mes" },
  { value: "6-10", label: "6 a 10 por mes" },
  { value: "10+", label: "Más de 10 por mes" },
];

export const urgencyOptions: Option<Urgency>[] = [
  { value: "asap", label: "Lo antes posible" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "evaluando", label: "Estoy evaluando opciones" },
];

/** Orígenes y destinos frecuentes primero, después el resto. */
export const countries: Option<string>[] = [
  { value: "CN", label: "China" },
  { value: "US", label: "Estados Unidos" },
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brasil" },
  { value: "CL", label: "Chile" },
  { value: "UY", label: "Uruguay" },
  { value: "PY", label: "Paraguay" },
  { value: "MX", label: "México" },
  { value: "ES", label: "España" },
  { value: "IT", label: "Italia" },
  { value: "DE", label: "Alemania" },
  { value: "FR", label: "Francia" },
  { value: "GB", label: "Reino Unido" },
  { value: "NL", label: "Países Bajos" },
  { value: "JP", label: "Japón" },
  { value: "KR", label: "Corea del Sur" },
  { value: "IN", label: "India" },
  { value: "TW", label: "Taiwán" },
  { value: "HK", label: "Hong Kong" },
  { value: "CA", label: "Canadá" },
  { value: "AU", label: "Australia" },
  { value: "OTRO", label: "Otro país" },
];

export function countryLabel(code: string): string {
  return countries.find((country) => country.value === code)?.label ?? code;
}
