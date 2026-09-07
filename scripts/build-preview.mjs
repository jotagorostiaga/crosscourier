/**
 * Convierte el export estático de /out en una carpeta navegable sin servidor.
 *
 *   NEXT_OUTPUT=export npm run build && node scripts/build-preview.mjs
 *
 * Reescribe todas las rutas absolutas a rutas relativas y agrega un shim que
 * fuerza navegación dura entre archivos .html, para que la preview funcione
 * abriendo index.html con doble clic.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else found.push(full);
  }
  return found;
}

const files = await walk(OUT);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

// Todas las rutas de página que existen como archivo, de la más larga a la más
// corta para que /importar/courier-maritimo gane sobre /importar.
const routes = htmlFiles
  .map((file) => "/" + relative(OUT, file).split(sep).join("/").replace(/\.html$/, ""))
  .map((route) => (route === "/index" ? "/" : route))
  .sort((a, b) => b.length - a.length);

const NAV_SHIM = `<script>
/* Preview local: fuerza navegación dura entre archivos para no depender del
   router de Next, que necesita un servidor. */
document.addEventListener('click', function (event) {
  var link = event.target.closest && event.target.closest('a[href]');
  if (!link) return;
  var href = link.getAttribute('href');
  if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.href = href;
}, true);
</script>`;

let patched = 0;

for (const file of htmlFiles) {
  const depth = relative(OUT, file).split(sep).length - 1;
  const prefix = depth === 0 ? "" : "../".repeat(depth);

  let html = await readFile(file, "utf8");

  // 1. Links entre páginas: /importar -> ../importar.html
  for (const route of routes) {
    const target =
      route === "/" ? `${prefix}index.html` : `${prefix}${route.slice(1)}.html`;
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html
      .replaceAll(`href="${route}"`, `href="${target}"`)
      .replace(new RegExp(`\\\\"${escaped}\\\\"`, "g"), `\\"${target}\\"`);
  }

  // 2. Assets: /_next, /media, /brand, /icon.png
  for (const base of ["_next/", "media/", "brand/", "icon.png"]) {
    html = html
      .replaceAll(`"/${base}`, `"${prefix}${base}`)
      .replaceAll(`\\"/${base}`, `\\"${prefix}${base}`)
      .replaceAll(`(/${base}`, `(${prefix}${base}`);
  }

  // Las fuentes van embebidas en el CSS: el preload con crossorigin falla
  // sobre file:// en varios navegadores.
  html = html.replace(
    /<link rel="preload"[^>]*as="font"[^>]*>/g,
    "",
  );

  html = html.replace("</body>", `${NAV_SHIM}</body>`);
  await writeFile(file, html);
  patched += 1;
}

// 3. Fuentes embebidas en el CSS como data URI
for (const file of files.filter((f) => f.endsWith(".css"))) {
  let css = await readFile(file, "utf8");
  const fonts = [
    ...css.matchAll(/(?:\/_next\/static|\.\.)\/media\/([^)"']+\.woff2)/g),
  ];
  for (const [full, name] of new Set(fonts.map((m) => [m[0], m[1]]))) {
    const bytes = await readFile(join(OUT, "_next", "static", "media", name));
    css = css.replaceAll(
      full,
      `data:font/woff2;base64,${bytes.toString("base64")}`,
    );
  }
  await writeFile(file, css);
}

const total = (
  await Promise.all(files.map(async (f) => (await stat(f)).size))
).reduce((a, b) => a + b, 0);

console.log(
  `Preview lista: ${patched} páginas, ${(total / 1024 / 1024).toFixed(1)} MB en /out`,
);
console.log("Abrí out/index.html con doble clic.");
