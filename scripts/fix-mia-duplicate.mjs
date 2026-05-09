#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Eliminando duplicado de portada.jpg en MIA...\n');

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar a Mia
const miaIndex = modelsData.findIndex(model => model.name === 'Mia');

if (miaIndex === -1) {
  console.log('❌ Mia no encontrada en models.json');
  process.exit(1);
}

const mia = modelsData[miaIndex];

console.log('📸 Referencias actuales de MIA:');
console.log(`- coverImageUrl: ${mia.coverImageUrl}`);
console.log(`- images[0]: ${mia.images[0]}`);

// Eliminar portada.jpg del array images[] (mantener solo en coverImageUrl)
if (mia.images && mia.images.length > 0 && mia.images[0].includes('portada.jpg')) {
  console.log('\n🗑️ Eliminando portada.jpg duplicada del array images[]...');
  mia.images.shift(); // Eliminar primer elemento (portada.jpg duplicada)
  
  // Guardar cambios
  fs.writeFileSync('./data/models.json', JSON.stringify(modelsData, null, 2));
  
  console.log('✅ Duplicado eliminado correctamente');
  console.log(`📊 Array actualizado: ${mia.images.length} imágenes en gallery`);
  console.log('📋 Nueva lista:');
  mia.images.forEach((img, index) => {
    console.log(`${index + 1}. ${img.split('/').pop()}`);
  });
} else {
  console.log('❌ No se encontró duplicado de portada.jpg en el array images[]');
}

console.log('\n✅ Corrección completada');
