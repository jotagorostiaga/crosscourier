/**
 * Manifiesto de fotografía.
 *
 * Por defecto se sirven los archivos de /public/media, que ya vienen en el
 * repositorio. `npm run fetch:media` los vuelve a bajar del CDN en su
 * resolución original si hiciera falta; con NEXT_PUBLIC_MEDIA_LOCAL=false la
 * app pasa a consumirlos directamente desde el CDN.
 */
const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3AkSKw4SwXANWNtqCuqUcWavfvQ";

export const mediaManifest = {
  hero: `${CDN}/hf_20260906_135317_fb402087-c15c-4a4b-a114-48c3a2cba8bc.png`,
  priority: `${CDN}/hf_20260906_135317_1bbe9463-08dc-4651-91a6-826cf58a8154.png`,
  standard: `${CDN}/hf_20260906_135317_2afc6860-3cd5-4279-939e-400574b051b3.png`,
  maritimo: `${CDN}/hf_20260906_135317_aea6c15e-f131-42c4-87f7-540bc0f1285a.png`,
  china: `${CDN}/hf_20260906_135317_b80e270e-3b97-4a3b-8c79-98d94891161c.png`,
  miami: `${CDN}/hf_20260906_135317_917ec449-f3ac-46af-969f-eb3ca2bfeb0d.png`,
  consolidacion: `${CDN}/hf_20260906_135317_2841cf11-3a30-4d49-9dec-a72c77c32b0e.png`,
  carga: `${CDN}/hf_20260906_135317_4f0525bc-45e5-488d-93b1-c60f176c0103.png`,
  "expo-priority": `${CDN}/hf_20260906_135317_e64be23d-053d-44f9-9817-109e0f882e2b.png`,
  "expo-standard": `${CDN}/hf_20260906_135317_709c2a87-e963-4631-b513-0eac21e9e477.png`,
  "exporta-simple": `${CDN}/hf_20260906_135317_a70cc0eb-7e40-446f-bfaf-62447a695779.png`,
  warehouse: `${CDN}/hf_20260906_135317_b6a62366-cb50-4bb2-833a-dccad89c1fba.png`,

  /* Fotos propias del cliente: sólo existen en /public/media. */
  "maritimo-china": "/media/maritimo-china.jpg",
  "aereo-standard": "/media/aereo-standard.jpg",
  "maritimo-miami": "/media/maritimo-miami.jpg",

  /* Testimonios: retratos verticales 9:16 de clientes con su compra. */
  "story-guitarra": `${CDN}/hf_20260907_114112_8b3e2374-6b7e-4eb1-b435-0802aeaee0bb.png`,
  "story-vehiculo": `${CDN}/hf_20260907_114112_d7661a0b-89fa-4fb7-9956-6c3342a2127c.png`,
  "story-repuesto": `${CDN}/hf_20260907_114112_afdecaaf-c95d-4c74-8d3b-29b2fbca2a41.png`,
  "story-consolidacion": `${CDN}/hf_20260907_114112_17c89950-20c5-4427-99c5-89252d68d0a8.png`,
  "story-exporta": `${CDN}/hf_20260907_114112_d76a8daa-3056-4494-b5b4-9917da48e298.png`,
} as const;

export type MediaKey = keyof typeof mediaManifest;

const useLocal = process.env.NEXT_PUBLIC_MEDIA_LOCAL !== "false";

/**
 * Prefijo de rutas cuando el sitio no se sirve desde la raíz del dominio
 * (GitHub Pages lo publica en /<repositorio>). En una exportación estática
 * `next/image` no optimiza y deja el `src` tal cual, así que el prefijo hay
 * que ponerlo acá. En local y en un deploy en la raíz queda vacío.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** La ruta de un archivo de /public, con el prefijo del deploy si hace falta. */
export function asset(path: string): string {
  return `${basePath}${path}`;
}

export function media(key: MediaKey): string {
  return useLocal ? asset(`/media/${key}.jpg`) : mediaManifest[key];
}
