#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Corrigiendo array de imágenes de Maria para eliminar inexistentes...\n');

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar a Maria
const mariaIndex = modelsData.findIndex(model => model.name === 'Maria');

if (mariaIndex === -1) {
  console.log('❌ Maria no encontrada en models.json');
  process.exit(1);
}

const maria = modelsData[mariaIndex];
console.log('📸 Imágenes actuales de Maria en JSON:');
maria.images.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Verificar qué imágenes existen realmente
const validImages = [];
const missingImages = [];

maria.images.forEach(imageUrl => {
  const imagePath = path.join('./public', imageUrl);
  if (fs.existsSync(imagePath)) {
    validImages.push(imageUrl);
  } else {
    missingImages.push(imageUrl);
  }
});

console.log('\n✅ Imágenes válidas (existen):');
validImages.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

console.log('\n❌ Imágenes inválidas (no existen):');
missingImages.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Actualizar array solo con imágenes válidas
maria.images = validImages;

// Guardar cambios
fs.writeFileSync('./data/models.json', JSON.stringify(modelsData, null, 2));

console.log(`\n🎯 RESULTADO:`);
console.log(`- Imágenes válidas: ${validImages.length}`);
console.log(`- Imágenes eliminadas: ${missingImages.length}`);
console.log(`- Total actualizado: ${validImages.length} imágenes`);
console.log('\n✅ models.json actualizado solo con imágenes existentes');
