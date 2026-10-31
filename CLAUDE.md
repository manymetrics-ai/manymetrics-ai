# Reglas para trabajar en este repositorio

Este repo es el perfil de GitHub de Gian (`README.md` y `assets/`) y contiene el catálogo web en `catalog/`.

El propietario (Gian) edita a mano los archivos de `catalog/content/` y a veces `catalog/src/`. Sus cambios manuales tienen prioridad.

1. Antes de modificar nada, haz `git pull` y lee el estado actual de los archivos. Nunca reescribas un archivo desde una copia anterior.
2. `catalog/content/` es contenido del propietario. Cambia solo las líneas que te pidan, con ediciones puntuales. No regeneres un YAML completo ni reordenes sus claves ni borres comentarios.
3. Los cambios de diseño van en `catalog/src/`. No metas textos visibles en `catalog/src/` si pueden ir en `catalog/content/`.
4. Si un cambio pedido choca con algo que el propietario editó a mano, pregunta antes.
5. Nada de cifras, clientes, testimonios o logos que el propietario no haya confirmado. Las demos llevan siempre el aviso de datos ficticios.
6. Estilo de texto: sin rayas largas (—), lenguaje concreto, sin jerga de marketing.
7. El README del perfil se apoya en los SVG de `assets/`; se regeneran con `node assets/build.mjs`. No edites los SVG a mano: cambia `assets/profile.json`.
8. Comprueba `npm run build` (dentro de `catalog/`) antes de cada commit.
