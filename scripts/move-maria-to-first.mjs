#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Moviendo a Maria a la posición número uno...\n');

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar a Maria
const mariaIndex = modelsData.findIndex(model => model.name === 'Maria');

if (mariaIndex === -1) {
  console.log('❌ Maria no encontrada en models.json');
  process.exit(1);
}

console.log(`📍 Posición actual de Maria: ${mariaIndex + 1}`);

// Extraer a Maria del array
const maria = modelsData[mariaIndex];
modelsData.splice(mariaIndex, 1);

// Insertar a Maria al principio del array
modelsData.unshift(maria);

// Guardar cambios
fs.writeFileSync('./data/models.json', JSON.stringify(modelsData, null, 2));

console.log('\n🎯 RESULTADO:');
console.log(`✅ Maria movida a la posición #1`);
console.log(`📊 Total de modelos: ${modelsData.length}`);
console.log('\n📋 Nuevo orden (primeros 5):');
modelsData.slice(0, 5).forEach((model, index) => {
  console.log(`${index + 1}. ${model.name}`);
});

console.log('\n✅ models.json actualizado correctamente');
