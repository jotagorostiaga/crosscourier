/**
 * Descarga la fotografía del proyecto a /public/media.
 *
 *   npm run fetch:media
 *
 * Después definí NEXT_PUBLIC_MEDIA_LOCAL=true en tu .env.local y la app deja
 * de depender del CDN. Requiere Node 18+ (fetch nativo).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3AkSKw4SwXANWNtqCuqUcWavfvQ";

const files = {
  hero: "hf_20260906_135317_fb402087-c15c-4a4b-a114-48c3a2cba8bc.png",
  priority: "hf_20260906_135317_1bbe9463-08dc-4651-91a6-826cf58a8154.png",
  standard: "hf_20260906_135317_2afc6860-3cd5-4279-939e-400574b051b3.png",
  maritimo: "hf_20260906_135317_aea6c15e-f131-42c4-87f7-540bc0f1285a.png",
  china: "hf_20260906_135317_b80e270e-3b97-4a3b-8c79-98d94891161c.png",
  miami: "hf_20260906_135317_917ec449-f3ac-46af-969f-eb3ca2bfeb0d.png",
  consolidacion: "hf_20260906_135317_2841cf11-3a30-4d49-9dec-a72c77c32b0e.png",
  carga: "hf_20260906_135317_4f0525bc-45e5-488d-93b1-c60f176c0103.png",
  "expo-priority": "hf_20260906_135317_e64be23d-053d-44f9-9817-109e0f882e2b.png",
  "expo-standard": "hf_20260906_135317_709c2a87-e963-4631-b513-0eac21e9e477.png",
  "exporta-simple": "hf_20260906_135317_a70cc0eb-7e40-446f-bfaf-62447a695779.png",
  warehouse: "hf_20260906_135317_b6a62366-cb50-4bb2-833a-dccad89c1fba.png",
};

const outDir = join(process.cwd(), "public", "media");
await mkdir(outDir, { recursive: true });

let failed = 0;

for (const [name, file] of Object.entries(files)) {
  const url = `${CDN}/${file}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    // El manifiesto usa .jpg; el original es PNG y el optimizador de Next
    // lo reencodea igual, así que guardamos con la extensión esperada.
    await writeFile(join(outDir, `${name}.jpg`), buffer);
    console.log(`ok    ${name} (${(buffer.length / 1024).toFixed(0)} kB)`);
  } catch (error) {
    failed += 1;
    console.error(`fallo ${name}: ${error.message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} archivo(s) no se pudieron descargar.`);
  process.exit(1);
}

console.log("\nListo. Definí NEXT_PUBLIC_MEDIA_LOCAL=true en .env.local.");
