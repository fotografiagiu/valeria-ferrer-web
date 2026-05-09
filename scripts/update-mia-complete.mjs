#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Actualizando models.json con las nuevas fotos de MIA...\n');

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar a Mia
const miaIndex = modelsData.findIndex(model => model.name === 'Mia');

if (miaIndex === -1) {
  console.log('❌ Mia no encontrada en models.json');
  process.exit(1);
}

const mia = modelsData[miaIndex];
console.log('📸 Fotos nuevas de MIA a configurar:');

// Nuevas fotos (sin repetidas)
const newImages = [
  '/chicas/mia-model-agency-valencia-vf/portada.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/01.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/02.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/03.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/04.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/05.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/06.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/07.jpg',
  '/chicas/mia-model-agency-valencia-vf/gallery/08.jpg'
];

// Actualizar array de imágenes
mia.images = newImages;

// También actualizar coverImageUrl
mia.coverImageUrl = '/chicas/mia-model-agency-valencia-vf/portada.jpg';

// Guardar cambios
fs.writeFileSync('./data/models.json', JSON.stringify(modelsData, null, 2));

console.log('✅ Configuración completada:');
console.log(`- Portada: ${mia.coverImageUrl}`);
console.log(`- Galería: ${newImages.length} fotos`);
console.log('- Sin repetidas');
console.log('- Solo fotos de la ruta especificada');

console.log('\n📋 Lista de fotos:');
newImages.forEach((img, index) => {
  const filename = img.split('/').pop();
  console.log(`${index + 1}. ${filename}`);
});

console.log('\n✅ models.json actualizado con las nuevas fotos de MIA');
