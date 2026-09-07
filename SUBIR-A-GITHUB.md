# Subir CrossCourier a GitHub y publicar el preview

Todo está listo en `~/Documents/crosscourier-web`: el workflow de deploy, el
`.gitignore`, el README y el ajuste de rutas para Pages. Solo falta el push.

## 1. Crear el repo y subirlo

Abrí Terminal y pegá esto:

```bash
cd ~/Documents/crosscourier-web
git init -b main
git add -A
git commit -m "CrossCourier: sitio completo"
```

Si tenés la CLI de GitHub (`gh`), con un comando queda creado y subido:

```bash
gh repo create crosscourier --public --source=. --push
```

Si no la tenés, creá el repo vacío en https://github.com/new
(nombre `crosscourier`, **público**, sin README ni .gitignore) y después:

```bash
git remote add origin https://github.com/TU-USUARIO/crosscourier.git
git push -u origin main
```

## 2. Encender Pages

En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Con eso el workflow corre solo. Mirá el avance en la pestaña **Actions**; tarda
unos 2-3 minutos. Cuando termina, el link es:

```
https://TU-USUARIO.github.io/crosscourier/
```

Ese es el que le mandás al cliente. Cada push a `main` lo actualiza.

## Dos cosas para tener en cuenta

**El repo tiene que ser público.** GitHub Pages en repos privados requiere plan
pago. Si preferís mantenerlo privado, Vercel publica repos privados en su plan
gratuito y además hace funcionar el endpoint del cotizador.

**El cotizador va en modo demo.** Pages sirve archivos estáticos, así que no hay
backend: el formulario completa los 6 pasos y muestra la pantalla final, pero no
envía el lead a ningún lado. El workflow lo marca con `NEXT_PUBLIC_DEMO=true`.
Para que `/api/leads` funcione de verdad hay que deployar en un entorno con Node.

## Sobre la carpeta `_to_delete/`

Ahí están los PNG originales de las fotos (los que convertí a JPG) y un `.git` a
medias que quedó del intento de iniciar el repo. Se queda como backup en tu
computadora: está en el `.gitignore`, así que no se sube a GitHub y no molesta.

Lo único que conviene borrar cuando subas el repo es `_to_delete/git-parcial`,
porque un `.git` adentro del proyecto puede confundir a algunas herramientas.
Nada urgente.
