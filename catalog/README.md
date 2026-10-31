# Catálogo de servicios · Giancarlo Peralta Cruzatt

Catálogo de servicios freelance de **manymetrics.ai**, en español e inglés.
Publicado en GitHub Pages: https://manymetrics-ai.github.io/manymetrics-ai/

## Dónde está cada cosa

| Quieres cambiar... | Edita este archivo |
|---|---|
| Titular, presentación, email, enlaces | `content/site.yml` |
| Un servicio (textos, pasos, entregables) | `content/services/<servicio>.yml` |
| Datos de una demo | `content/demos/<demo>.yml` |
| Colores y tipografía | `src/styles/global.css` (bloque `:root`) |
| Banner | `public/img/banner.png` |

Todo lo que está en `content/` es contenido: puedes editarlo a mano desde GitHub (botón del lápiz)
y el sitio se vuelve a publicar solo en uno o dos minutos. El diseño vive en `src/` y lee el
contenido de esos archivos, así que cambiar uno no rompe el otro.

## Añadir un servicio nuevo
1. Copia cualquier archivo de `content/services/` con un nombre nuevo, por ejemplo `data-strategy.yml`.
2. Cambia `order`, `phase` (`assess`, `architect`, `govern` o `scale`) y los textos de `es` y `en`.
3. Guarda. La ficha aparece en el catálogo y tiene su propia página.

## Uso local
```bash
npm install
npm run dev      # http://localhost:4321/manymetrics-ai/
npm run build    # genera dist/
```
