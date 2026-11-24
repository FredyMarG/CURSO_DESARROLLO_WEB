/**
 * ============================================================================
 * GENERADOR AUTOMÁTICO DE docs-data.js PARA CUALQUIER CURSO
 * Uso: node "RESOURCES COURSE/plantilla/docs-data-generator.js" <carpeta-Documentacion>
 * Ejemplo: node "RESOURCES COURSE/plantilla/docs-data-generator.js" NODE/Documentacion
 * ============================================================================
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Uso: node "RESOURCES COURSE/plantilla/docs-data-generator.js" <carpeta-Documentacion>');
  process.exit(1);
}

const docsRoot = path.resolve(targetDir);
const apuntesDir = path.join(docsRoot, 'apuntes');
const outPath = path.join(docsRoot, 'docs-data.js');

if (!fs.existsSync(apuntesDir)) {
  console.error(`No se encontró la carpeta de apuntes: ${apuntesDir}`);
  process.exit(1);
}

// Lee todos los archivos .md en orden alfabético y construye el mapa JSON
const mdFiles = fs.readdirSync(apuntesDir).filter(f => f.toLowerCase().endsWith('.md')).sort();
const contentMap = {};

for (const file of mdFiles) {
  contentMap[file] = fs.readFileSync(path.join(apuntesDir, file), 'utf8');
}

fs.writeFileSync(outPath, `window.DOCS_CONTENT = ${JSON.stringify(contentMap)};\n`, 'utf8');
console.log(`✅ docs-data.js generado en ${outPath} (${mdFiles.length} guías .md)`);
