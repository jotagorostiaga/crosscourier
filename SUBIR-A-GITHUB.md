# Subir CrossCourier a GitHub y publicar el preview

**Buena noticia:** la carpeta de tu Mac ya está lista. Revisé
`~/Documents/crosscourier-web` y tiene:

- el repo de git inicializado, en la rama `main`;
- los 120 archivos del proyecto ya commiteados;
- el remote apuntando a `https://github.com/jotagorostiaga/crosscourier.git`;
- el workflow de deploy (`.github/workflows/deploy-pages.yml`) incluido.

Falta una sola cosa: **autorizar tu Mac contra GitHub y hacer el push.**
Eso no lo puedo hacer yo, porque requiere tu cuenta.

Elegí una de las dos rutas. La A no usa Terminal.

---

## Paso 1 — Confirmar que el repo existe en GitHub

Abrí https://github.com/jotagorostiaga/crosscourier

- Si ves el repo (aunque esté vacío, con la pantalla de "Quick setup"): listo, seguí.
- Si da **404**: crealo en https://github.com/new
  - Repository name: `crosscourier`
  - Visibilidad: **Public** ← importante, Pages en repos privados es plan pago
  - **NO** tildes "Add a README" ni "Add .gitignore"
  - Create repository

---

# Ruta A — GitHub Desktop (recomendada, sin Terminal)

## Paso 2A — Instalar y loguearte

1. Descargá GitHub Desktop: https://desktop.github.com
2. Abrilo y elegí **Sign in to GitHub.com**. Se abre el navegador, autorizás
   con tu cuenta, y vuelve solo a la app.

## Paso 3A — Agregar la carpeta y publicar

1. En el menú de arriba: **File → Add Local Repository…**
2. Elegí la carpeta `Documents / crosscourier-web` y **Add Repository**.
   La app la reconoce sola (ya es un repo de git).
3. Arriba te va a aparecer un botón **Publish repository** o **Push origin**.
   - Si dice **Push origin** → clic y listo.
   - Si dice **Publish repository** → clic, dejá el nombre `crosscourier`,
     **destildá** "Keep this code private", y publicá.

Cuando termina, refrescá el repo en GitHub: tienen que aparecer las carpetas
`src`, `public`, `scripts`.

Saltá al **Paso 4**.

---

# Ruta B — Terminal con token

Si preferís Terminal. No hace falta instalar nada.

## Paso 2B — Crear un token

1. Abrí https://github.com/settings/tokens
2. **Generate new token → Generate new token (classic)**
3. Note: `mac-crosscourier` · Expiration: 90 days
4. Tildá el scope **`repo`** (el primero de la lista, con todos sus hijos)
5. **Generate token** y **copiá el token** (empieza con `ghp_`).
   Solo se muestra una vez.

## Paso 3B — Push

Abrí Terminal y pegá esto tal cual, línea por línea:

```bash
cd ~/Documents/crosscourier-web
git push -u origin main
```

Va a pedir dos cosas:

| Prompt | Qué poner |
|---|---|
| `Username for 'https://github.com'` | `jotagorostiaga` |
| `Password for 'https://...'` | **el token `ghp_...`** (no tu contraseña) |

El token no se ve mientras lo pegás — es normal, apretá Enter igual.

> La contraseña de la cuenta **no funciona**: GitHub la dejó de aceptar para git
> por HTTPS. Tiene que ser el token.

Para no volver a pegarlo nunca más:

```bash
git config --global credential.helper osxkeychain
```

(corrélo antes del push y macOS lo guarda en el Llavero)

---

## Paso 4 — Encender Pages

En el repo, en GitHub: **Settings → Pages → Build and deployment → Source**

Ese desplegable hoy dice *"Deploy from a branch"*. Cambialo a **GitHub Actions**.

No hay que elegir branch ni carpeta. El workflow ya está en el repo y se
encarga del build y del deploy.

---

## Paso 5 — Esperar el deploy y copiar el link

Andá a la pestaña **Actions** del repo. Vas a ver la corrida
*Deploy a GitHub Pages*. Tarda 2–3 minutos.

Cuando queda en verde, el link es:

```
https://jotagorostiaga.github.io/crosscourier/
```

Ese es el que le mandás al cliente. De ahí en adelante, cada push a `main`
actualiza el sitio solo.

---

## Si algo falla

**"Repository not found" en el push** — el repo no existe todavía o está con
otro nombre. Volvé al paso 1.

**"Authentication failed"** — pusiste la contraseña en lugar del token. Repetí
el paso 2B.

**El build falla en Actions** — abrí la corrida, mirá qué paso quedó en rojo y
mandame la captura.

**El sitio carga sin estilos** — es el prefijo de rutas. Verificá que el repo se
llame exactamente `crosscourier`: el workflow arma las rutas con ese nombre.

---

## Dos cosas del preview que conviene saber

**El cotizador va en modo demo.** Pages sirve archivos estáticos, sin backend:
el formulario recorre los 6 pasos y muestra la pantalla final, pero no manda el
lead a ningún lado. Para que `/api/leads` funcione de verdad hay que deployar en
un entorno con Node (Vercel u otro). Para mostrarle el sitio al cliente alcanza.

**La carpeta `_to_delete/`** queda como backup en tu Mac, con los PNG originales
de las fotos. Está en el `.gitignore`, así que no se sube.
