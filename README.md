# CrossCourier

Sitio de CrossCourier — courier internacional, importación, exportación,
consolidación de compras y warehouse.

## Stack

- Next.js (App Router) + TypeScript estricto
- Tailwind v4 con tokens de marca en `src/app/globals.css`
- Tipografías self-hosted: Coolvetica (titulares) y Geist (texto)
- `motion` para las animaciones, Phosphor para los íconos

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
```

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/app` | Rutas del App Router, una carpeta por página |
| `src/components/blocks` | Bloques de página (hero, servicios, mapa, testimonios…) |
| `src/components/ui` | Primitivas del sistema (botón, contenedor, riel, acordeón…) |
| `src/components/quote` | Cotizador progresivo de 6 pasos |
| `src/lib` | Fuente de verdad: navegación, servicios, FAQs, oficinas, media |
| `public/media` | Fotografía del sitio, un archivo por clave de `src/lib/media.ts` |
| `scripts` | Generación de la preview estática navegable |

## Cotizador

El flujo vive en `src/lib/quote`: `machine.ts` (pasos y validación),
`scoring.ts` (clasificación HOT / COLD / ONE SHOT / ASESORÍA y recomendación de
modalidad) y `analytics.ts` (eventos por etapa para GA4/GTM).

Los datos de contacto se piden al final, después de conocer la operación. El
lead se envía a `src/app/api/leads/route.ts`, que hoy valida el payload y lo
reenvía a `CRM_WEBHOOK_URL` si está configurada. Ese archivo es el único punto
a tocar cuando se defina el CRM.

Las landings de campaña (`/lp/...`) precargan el cotizador por querystring
(`?need=importar&origin=CN&cargo=repuestos`), así el contexto del anuncio no se
pierde.

## Preview estática

```bash
npm run preview
```

Exporta el sitio, captura el markup real con Playwright y arma un único HTML
navegable en `preview/`. Sirve para revisar el diseño sin levantar el proyecto.

## Deploy en GitHub Pages

`.github/workflows/deploy-pages.yml` publica en cada push a `main`. La build usa
`NEXT_OUTPUT=export` y `NEXT_BASE_PATH=/<repositorio>`, porque Pages sirve el
sitio desde una subcarpeta.

En Pages no hay backend, así que el workflow define `NEXT_PUBLIC_DEMO=true`: el
cotizador completa el recorrido y muestra la pantalla final sin llamar al
endpoint de leads. Para el sitio productivo hay que deployar en un entorno con
Node (Vercel u otro) para que `/api/leads` funcione.

## Variables de entorno

Ver `.env.example`.
