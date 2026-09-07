/**
 * Captura el markup real que renderiza la aplicación, para armar la preview
 * de un solo archivo. Levanta un servidor estático sobre /out, recorre todas
 * las rutas y guarda el resultado en .preview-capture.json.
 */
import { chromium } from 'playwright';
import { writeFile, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';

const OUT = new URL('../out/', import.meta.url).pathname;
const PORT = 4310;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml' };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  try {
    const body = await readFile(join(OUT, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

const BASE = `http://localhost:${PORT}`;
const routes = [
  ['/', 'index'],
  ['/importar', 'importar'],
  ['/importar/courier-aereo-priority', 'importar/courier-aereo-priority'],
  ['/importar/courier-aereo-standard', 'importar/courier-aereo-standard'],
  ['/importar/courier-maritimo', 'importar/courier-maritimo'],
  ['/importar/courier-maritimo/desde-china', 'importar/courier-maritimo/desde-china'],
  ['/importar/courier-maritimo/desde-miami', 'importar/courier-maritimo/desde-miami'],
  ['/importar/consolidacion-de-compras', 'importar/consolidacion-de-compras'],
  ['/importar/carga-sin-limites', 'importar/carga-sin-limites'],
  ['/exportar', 'exportar'],
  ['/exportar/courier-aereo-priority', 'exportar/courier-aereo-priority'],
  ['/exportar/courier-aereo-standard', 'exportar/courier-aereo-standard'],
  ['/exportar/exporta-simple', 'exportar/exporta-simple'],
  ['/warehouse', 'warehouse'],
  ['/crosscourier', 'crosscourier'],
  ['/preguntas-frecuentes', 'preguntas-frecuentes'],
  ['/seguir-mi-envio', 'seguir-mi-envio'],
  ['/cotizar', 'cotizar'],
  ['/lp/importar-repuestos', 'lp/importar-repuestos'],
  ['/lp/importar-desde-china', 'lp/importar-desde-china'],
  ['/lp/importar-tecnologia', 'lp/importar-tecnologia'],
  ['/lp/courier-internacional', 'lp/courier-internacional'],
  ['/lp/enviar-muestras-al-exterior', 'lp/enviar-muestras-al-exterior'],
  ['/lp/exporta-simple', 'lp/exporta-simple'],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

const grab = () => page.evaluate(() => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, link[rel="preload"], next-route-announcer, .cc-grain').forEach(n => n.remove());
  // Motion deja estilos inline de la animación de entrada: los fijamos en estado final.
  clone.querySelectorAll('[style*="opacity"]').forEach(n => {
    n.style.opacity = '';
    n.style.transform = '';
    if (!n.getAttribute('style')) n.removeAttribute('style');
  });
  return clone.innerHTML;
});

const pages = {};

for (const [, slug] of routes) {
  await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  pages[slug] = await grab();
  process.stdout.write('.');
}

// Los 6 pasos del cotizador, con el markup real que produce React.
await page.goto(BASE + '/cotizar.html', { waitUntil: 'load' });
await page.waitForSelector('[data-quote-flow] fieldset', { timeout: 20000 });
await page.waitForTimeout(600);
const steps = [];
const fillers = [
  async () => { await page.getByText('Traer mercadería a Argentina').click(); },
  async () => {
    await page.locator('select').first().selectOption('CN');
    await page.getByLabel('Ciudad o código postal').first().fill('Shenzhen');
    await page.locator('select').nth(1).selectOption('AR');
    await page.getByLabel('Ciudad o código postal').nth(1).fill('Buenos Aires');
  },
  async () => {
    await page.getByText('Repuestos', { exact: true }).click();
    await page.getByLabel(/Contanos brevemente/).fill('20 repuestos electrónicos para una línea de envasado');
  },
  async () => {
    await page.getByLabel(/Peso aproximado/).fill('12');
    await page.getByLabel('Largo').fill('40');
    await page.getByLabel('Ancho').fill('30');
    await page.getByLabel('Alto').fill('25');
    await page.getByText('USD 1.000 a 3.000').click();
  },
  async () => {
    await page.getByText('3 a 5 por mes').click();
    await page.getByText('Lo antes posible').click();
  },
  async () => {},
];

for (let i = 0; i < 6; i += 1) {
  await page.waitForTimeout(500);
  steps.push(await page.evaluate(() => {
    const root = document.querySelector('[data-quote-flow]');
    const clone = root.cloneNode(true);
    clone.querySelectorAll('[style*="opacity"]').forEach(n => { n.style.opacity=''; n.style.transform=''; });
    return clone.innerHTML;
  }));
  if (i < 5) {
    await fillers[i]();
    await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Continuar' }).click();
  }
  process.stdout.write('+');
}

// Menú mobile abierto
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
await mp.goto(BASE + '/index.html', { waitUntil: 'load' });
await mp.waitForTimeout(1500);
await mp.click('[aria-label="Abrir menú"]');
await mp.waitForTimeout(700);
const mobileMenu = await mp.evaluate(() => {
  const el = document.querySelector('[role="dialog"]');
  if (!el) return '';
  const clone = el.cloneNode(true);
  clone.querySelectorAll('[style*="opacity"]').forEach(n => { n.style.opacity=''; n.style.transform=''; });
  return clone.outerHTML;
});

await writeFile(new URL('../.preview-capture.json', import.meta.url).pathname, JSON.stringify({ pages, steps, mobileMenu }));
console.log('\ncapturado', Object.keys(pages).length, 'páginas,', steps.length, 'pasos, menú:', mobileMenu.length);
await browser.close();
server.close();
