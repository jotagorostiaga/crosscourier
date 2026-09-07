/**
 * Genera el mapa punteado de la sección de red operativa.
 *
 *   node scripts/build-world-dots.mjs
 *
 * Toma la geometría de tierra de world-atlas (Natural Earth 110m), la recorta
 * a la ventana que necesitamos y la convierte en una grilla de puntos. Sale un
 * único `path` con subtrazos de longitud cero y `stroke-linecap: round`: pesa
 * una fracción de lo que pesarían miles de <circle>.
 */
import { readFile, writeFile } from "node:fs/promises";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const LON = [-126, 136];
const LAT = [-56, 60];
const STEP = 2.1; // grados entre puntos
const SCALE = 3.4; // unidades de viewBox por grado

const topo = JSON.parse(
  await readFile(new URL("../node_modules/world-atlas/land-110m.json", import.meta.url)),
);
const land = feature(topo, topo.objects.land);

const width = Math.round((LON[1] - LON[0]) * SCALE);
const height = Math.round((LAT[1] - LAT[0]) * SCALE);

const project = (lon, lat) => [
  Math.round((lon - LON[0]) * SCALE * 10) / 10,
  Math.round((LAT[1] - lat) * SCALE * 10) / 10,
];

const dots = [];
for (let lat = LAT[0]; lat <= LAT[1]; lat += STEP) {
  for (let lon = LON[0]; lon <= LON[1]; lon += STEP) {
    if (!geoContains(land, [lon, lat])) continue;
    const [x, y] = project(lon, lat);
    dots.push(`M${x} ${y}l0 0`);
  }
}

const hubs = {
  "buenos-aires": [-58.38, -34.6],
  miami: [-80.19, 25.76],
  shanghai: [121.47, 31.23],
  shenzhen: [114.06, 22.54],
};

const projected = Object.fromEntries(
  Object.entries(hubs).map(([key, [lon, lat]]) => [key, project(lon, lat)]),
);

const file = `// Generado por scripts/build-world-dots.mjs. No editar a mano.
// Grilla de ${dots.length} puntos sobre la geometría de tierra de Natural Earth,
// recortada a la ventana que contiene nuestras cuatro plazas.

export const mapViewBox = { width: ${width}, height: ${height} };

export const mapDots =
  "${dots.join("")}";

export const hubPoints: Record<string, { x: number; y: number }> = {
${Object.entries(projected)
  .map(([key, [x, y]]) => `  "${key}": { x: ${x}, y: ${y} },`)
  .join("\n")}
};
`;

await writeFile(new URL("../src/components/blocks/world-dots.ts", import.meta.url), file);
console.log(`world-dots.ts · ${dots.length} puntos · viewBox ${width}x${height} · ${(file.length / 1024).toFixed(0)} kB`);
