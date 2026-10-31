// Configuración del sitio. Publicado en GitHub Pages: https://manymetrics-ai.github.io/manymetrics-ai/
// Si algún día usas un dominio propio (p. ej. servicios.manymetrics.ai), cambia SITE y BASE.
import { defineConfig } from 'astro/config';

const SITE = 'https://manymetrics-ai.github.io';
const BASE = '/manymetrics-ai';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  trailingSlash: 'always',
});
