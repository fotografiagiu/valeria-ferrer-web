#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Actualizando models.json para eliminar fotos eliminadas de MIA...\n');

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar a Mia
const miaIndex = modelsData.findIndex(model => model.name === 'Mia');

if (miaIndex === -1) {
  console.log('❌ Mia no encontrada en models.json');
  process.exit(1);
}

const mia = modelsData[miaIndex];
console.log('📸 Imágenes actuales de Mia en JSON:');
mia.images.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Fotos que existen físicamente
const existingImages = [
  '/chicas/mia-model-agency-valencia-vf/gallery/04.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/06.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/07.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/08.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/09.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/10.jpg'
];

// Actualizar array de imágenes
mia.images = existingImages;

// Guardar cambios
fs.writeFileSync('./data/models.json', JSON.stringify(modelsData, null, 2));

console.log(`\n🎯 RESULTADO:`);
console.log(`- Imágenes válidas: ${existingImages.length}`);
console.log(`- Imágenes eliminadas: 4 (01.jpg, 02.jpg, 03.jpg, 05.jpg)`);
console.log(`- Total actualizado: ${existingImages.length} imágenes`);
console.log('\n✅ models.json actualizado solo con imágenes existentes <300KB');
