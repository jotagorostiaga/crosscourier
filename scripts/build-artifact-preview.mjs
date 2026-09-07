/**
 * Arma una preview navegable del sitio en un único archivo HTML.
 *
 *   npm run preview
 *
 * Toma el markup real que renderiza la aplicación, le embebe CSS, tipografías
 * y fotografía, y le agrega un router mínimo. No es la app: es una maqueta
 * navegable del resultado, pensada para revisar diseño sin levantar nada.
 */
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = join(ROOT, "out");

const capture = JSON.parse(
  await readFile(join(ROOT, ".preview-capture.json"), "utf8"),
);

/* ---------- CSS + tipografías ---------- */
const chunkDir = join(OUT, "_next", "static", "chunks");
const cssFile = (await readdir(chunkDir)).find((f) => f.endsWith(".css"));
let css = await readFile(join(chunkDir, cssFile), "utf8");

// Next emite las tipografías con rutas relativas al CSS (../media/...) o
// absolutas (/_next/static/media/...): hay que cubrir las dos formas.
for (const match of new Set(
  [
    ...css.matchAll(
      /(?:\/_next\/static\/media\/|\.\.\/media\/)[^)"']+\.woff2/g,
    ),
  ].map((m) => m[0]),
)) {
  const name = match.split("/").pop();
  const bytes = await readFile(join(OUT, "_next", "static", "media", name));
  css = css.replaceAll(match, `data:font/woff2;base64,${bytes.toString("base64")}`);
}

/*
 * Next declara las variables de tipografía en una clase que aplica al <html>,
 * y el preview captura sólo el markup interno: sin esa clase las variables
 * quedan sin definir y los titulares caen a la tipografía del sistema. Se
 * extraen del CSS y se vuelven a declarar en :root.
 */
const fontVars = [
  ...new Set(
    [...css.matchAll(/(--font-[a-z0-9-]+)\s*:\s*("[^;{}]+")/gi)].map(
      (m) => `${m[1]}: ${m[2]};`,
    ),
  ),
];
if (!fontVars.length) throw new Error("No se encontraron variables de tipografía");
css += `\n:root{${fontVars.join("")}}\n`;

/* ---------- fotografía ---------- */
const media = {};
for (const file of await readdir(join(OUT, "media"))) {
  const bytes = await readFile(join(OUT, "media", file));
  media[`/media/${file}`] = `data:image/jpeg;base64,${bytes.toString("base64")}`;
}
// La marca incluye PNG y SVG: el tipo se deduce de la extensión.
for (const file of await readdir(join(OUT, "brand"))) {
  const bytes = await readFile(join(OUT, "brand", file));
  const type = file.endsWith(".svg") ? "image/svg+xml" : "image/png";
  media[`/brand/${file}`] = `data:${type};base64,${bytes.toString("base64")}`;
}

/* ---------- clases de fuente que estaban en <html> ---------- */
const indexHtml = await readFile(join(OUT, "index.html"), "utf8");
const htmlClass = (indexHtml.match(/<html[^>]*class="([^"]+)"/) || [, ""])[1]
  .replace("h-full", "")
  .trim();

/* ---------- páginas ---------- */
const routeToSlug = new Map();
for (const slug of Object.keys(capture.pages)) {
  routeToSlug.set(slug === "index" ? "/" : `/${slug}`, slug);
}

const cleanup = (html) =>
  html
    // sentinels que los observers crean en runtime
    .replace(/<div style="position: absolute; top: 0px; height: 1px; width: 1px;"><\/div>/g, "")
    .replace(/<div hidden=""><!--\$--><!--\/\$--><\/div>/g, "")
    // links internos al router de la preview
    // Enlaces con ancla (/warehouse#red): el hash lo usa el router, así que el
    // destino interno viaja en data-anchor y el runtime lo resuelve al llegar.
    .replace(
      /href="(\/[^"#?]*)(?:\?[^"#]*)?#([A-Za-z0-9_-]+)"/g,
      (full, route, anchor) => {
        const slug = routeToSlug.get(route);
        return slug
          ? `href="#/${slug === "index" ? "" : slug}" data-anchor="${anchor}"`
          : full;
      },
    )
    .replace(/href="(\/[^"#?]*)(\?[^"]*)?"/g, (full, route) => {
      const slug = routeToSlug.get(route);
      return slug ? `href="#/${slug === "index" ? "" : slug}"` : full;
    });

const pages = Object.fromEntries(
  Object.entries(capture.pages).map(([slug, html]) => [slug, cleanup(html)]),
);
const steps = capture.steps.map(cleanup);
const mobileMenu = cleanup(capture.mobileMenu);

// El header ya no se reemplaza: cambia de forma por CSS según data-scrolled.
const data = {
  pages,
  steps,
  mobileMenu,
  media,
};

const runtime = await readFile(join(ROOT, "scripts", "preview-runtime.js"), "utf8");

const html = `<title>CrossCourier</title>
<style>
${css}
/* Ajustes propios de la preview: en el archivo publicado no hay <html> ni
   <body> propios, así que el layout base va sobre el contenedor. */
#cc-app { display: flex; min-height: 100vh; flex-direction: column; }
body { margin: 0; background: var(--cc-bg); }
#cc-app > .cc-page { animation: cc-in .35s var(--cc-ease) both; }
@keyframes cc-in { from { opacity: 0 } to { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { #cc-app > .cc-page { animation: none } }
.cc-note {
  position: fixed; left: 50%; bottom: 18px; z-index: 70; transform: translateX(-50%);
  background: var(--cc-ink); color: var(--cc-text-on-ink);
  padding: 10px 16px; border-radius: var(--cc-radius-ui);
  font: 500 13px/1.4 var(--font-sans); box-shadow: var(--cc-shadow-lg);
}
</style>
<div id="cc-app" class="${htmlClass}"></div>
<script id="cc-data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>${runtime}</script>
`;

await mkdir(join(ROOT, "preview"), { recursive: true });
await writeFile(join(ROOT, "preview", "crosscourier-preview.html"), html);

// Versión standalone: se abre con doble clic, sin servidor.
const standalone = `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${html}
</body>
</html>`;
await writeFile(join(ROOT, "preview", "index.html"), standalone);
console.log(
  `preview/crosscourier-preview.html · ${(html.length / 1024 / 1024).toFixed(1)} MB · ${
    Object.keys(pages).length
  } páginas`,
);
