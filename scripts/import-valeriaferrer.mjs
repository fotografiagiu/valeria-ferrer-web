#!/usr/bin/env node
/**
 * Importación desde https://www.valeriaferrer.com (fuera del runtime de la app).
 *
 * Fuente de datos prevista (por confirmar en el servidor real):
 * 1) WordPress REST API — https://www.valeriaferrer.com/wp-json/
 *    - Descubrimiento: GET /wp-json/ (índice de namespaces y rutas)
 *    - Típico: /wp-json/wp/v2/posts, /wp-json/wp/v2/pages, o CPT registrados
 *    - Medios: /wp-json/wp/v2/media?per_page=…
 * 2) Si la API no expone el CPT de fichas: parseo HTML de listado + detalle
 *    (fetch de URLs públicas, sin ejecutar JS del cliente).
 *
 * Por defecto este script NO hace red ni escribe archivos: solo documenta el flujo.
 * Cuando implementes la importación real:
 *   - Añade flags explícitos, p. ej. --fetch --write-json --download-assets
 *   - Nunca inventes campos: omite o deja [] / "" si no existen en origen
 *
 * Uso: node scripts/import-valeriaferrer.mjs
 */

const BASE = 'https://www.valeriaferrer.com';

function main() {
  console.log('Valeria Ferrer — importador (plantilla)\n');
  console.log('Base:', BASE);
  console.log('\nPasos recomendados:');
  console.log('1. Comprobar API: curl -s "' + BASE + '/wp-json/" | head');
  console.log('2. Localizar el tipo de contenido de las fichas (CPT) o las URLs HTML.');
  console.log('3. Mapear campos → objetos Model en data/models.json (ver data/example-model-entry.json).');
  console.log('4. Opcional: descargar assets a public/chicas/<slug>/ (ver public/chicas/README.md).');
  console.log('\nModo actual: sin red, sin escritura. Implementa la lógica cuando tengas la fuente exacta.');
}

main();
