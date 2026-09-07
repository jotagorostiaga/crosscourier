/**
 * Oficinas de la red SouthCross Logistics, el respaldo operativo de
 * CrossCourier. Es una credencial verificable: se listan tal cual las informa
 * la empresa, sin agregar plazas ni redondear datos.
 */
export type Office = {
  country: string;
  city: string;
  address: string;
  phones?: string[];
  email: string;
};

export const offices: Office[] = [
  {
    country: "Argentina",
    city: "Ciudad Autónoma de Buenos Aires",
    address: "Av. Leandro N. Alem 449, 1°",
    phones: ["+54 11 5218 8188"],
    email: "argentina@southcrosslog.com",
  },
  {
    country: "Argentina",
    city: "Ezeiza",
    address: "Aeropuerto Internacional Ezeiza, Buenos Aires",
    phones: ["+54 11 5218 8188"],
    email: "argentina@southcrosslog.com",
  },
  {
    country: "Argentina",
    city: "Salta",
    address: "Zuviría 2475",
    phones: ["+54 11 5236 9690"],
    email: "argentina@southcrosslog.com",
  },
  {
    country: "Argentina",
    city: "Mar del Plata",
    address: "Bernardo de Irigoyen 3918",
    phones: ["+54 11 2173 7626"],
    email: "mdq@southcrosslog.com",
  },
  {
    country: "Bolivia",
    city: "Santa Cruz de la Sierra",
    address: "Manzana 40, Torre 1, Piso 26, Oficina 2601",
    phones: ["+591 3344 4963", "+591 3344 4342"],
    email: "bolivia@southcrosslog.com",
  },
  {
    country: "Bolivia",
    city: "La Paz",
    address: "Av. de la Fuerza Naval 836, Edif. Majestad, Oficina 1",
    phones: ["+591 6988 2090"],
    email: "bolivia@southcrosslog.com",
  },
  {
    country: "Chile",
    city: "Santiago de Chile",
    address: "Enrique Foster 39, Oficina 309, Las Condes",
    email: "chile@alfasouthcrosslog.com",
  },
  {
    country: "El Salvador",
    city: "San Salvador",
    address: "San Salvador",
    phones: ["+54 11 5218 8188"],
    email: "salvador@southcrosslog.com",
  },
  {
    country: "España",
    city: "Madrid",
    address: "Paseo de la Castellana 200, Piso 5, Oficina 516",
    phones: ["+34 617 557 038"],
    email: "spain@southcrosslog.com",
  },
  {
    country: "Guatemala",
    city: "Ciudad de Guatemala",
    address:
      "Diagonal 6, 11-97 zona 10, Edif. Centro Internaciones, Torre I, Of. 701, nivel 7",
    phones: ["+502 2372 4573", "+502 3825 3904"],
    email: "guatemala@southcrosslog.com",
  },
  {
    country: "Paraguay",
    city: "Asunción",
    address: "Av. Artigas 2025, Edif. Automotor, Piso 3",
    phones: ["+595 21 491135", "+595 21 442179", "+595 21 442158"],
    email: "paraguay@southcrosslog.com",
  },
  {
    country: "Uruguay",
    city: "Montevideo",
    address: "Juncal 1378, Oficina 801",
    phones: ["+598 2908 1977"],
    email: "uruguay@southcrosslog.com",
  },
  {
    country: "Venezuela",
    city: "Caracas",
    address:
      "Torre Credicard, Piso 15, Of. 152. Av. Principal El Bosque, Chacaíto",
    phones: ["+58 412 1086339"],
    email: "venezuela@southcrosslog.com",
  },
];

/** Cuántos países cubre la red, para no repetir el número a mano. */
export const officeCountries = [
  ...new Set(offices.map((office) => office.country)),
];

/** El href de un teléfono: sin espacios, para que marque desde el celular. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
