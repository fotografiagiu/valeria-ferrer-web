#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('📊 CALCULANDO TOTAL DE FOTOS EN TODAS LAS FICHAS');
console.log('='.repeat(60));

const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));
const chicasPath = './public/chicas';

let totalPhotos = 0;
let totalSizeKB = 0;
let modelsWithPhotos = [];
let modelsWithoutPhotos = [];

console.log('\n📸 ANÁLISIS POR MODELO:');
console.log('-'.repeat(40));

modelsData.forEach((model, index) => {
  let modelPhotos = 0;
  let modelSizeKB = 0;
  let modelDetails = [];
  
  // Verificar portada
  if (model.coverImageUrl) {
    const coverPath = path.join('./public', model.coverImageUrl);
    if (fs.existsSync(coverPath)) {
      const stats = fs.statSync(coverPath);
      modelDetails.push({
        type: 'Portada',
        path: model.coverImageUrl,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2)
      });
      modelPhotos++;
      modelSizeKB += stats.size / 1024;
    }
  }
  
  // Verificar imágenes de gallery
  if (model.images && Array.isArray(model.images)) {
    model.images.forEach(imageUrl => {
      const imagePath = path.join('./public', imageUrl);
      if (fs.existsSync(imagePath)) {
        const stats = fs.statSync(imagePath);
        modelDetails.push({
          type: 'Gallery',
          path: imageUrl,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2)
        });
        modelPhotos++;
        modelSizeKB += stats.size / 1024;
      }
    });
  }
  
  totalPhotos += modelPhotos;
  totalSizeKB += modelSizeKB;
  
  if (modelPhotos > 0) {
    modelsWithPhotos.push({
      name: model.name,
      position: index + 1,
      photos: modelPhotos,
      sizeKB: modelSizeKB.toFixed(2),
      sizeMB: (modelSizeKB / 1024).toFixed(2),
      details: modelDetails
    });
    
    console.log(`✅ ${model.name} (#${index + 1}):`);
    console.log(`   - Fotos: ${modelPhotos}`);
    console.log(`   - Tamaño: ${(modelSizeKB / 1024).toFixed(2)} MB`);
    
    // Mostrar detalles si son pocas fotos
    if (modelPhotos <= 10) {
      modelDetails.forEach(detail => {
        console.log(`     • ${detail.type}: ${detail.path.split('/').pop()} (${detail.sizeKB}KB)`);
      });
    }
  } else {
    modelsWithoutPhotos.push(model.name);
  }
});

// Resumen general
console.log('\n📊 RESUMEN GENERAL:');
console.log('-'.repeat(40));

console.log(`✅ Modelos con fotos: ${modelsWithPhotos.length}`);
console.log(`❌ Modelos sin fotos: ${modelsWithoutPhotos.length}`);
console.log(`📸 Total de fotos: ${totalPhotos}`);
console.log(`💾 Tamaño total: ${(totalSizeKB / 1024).toFixed(2)} MB`);
console.log(`📈 Promedio por foto: ${(totalSizeKB / totalPhotos).toFixed(2)} KB`);

// Top 5 modelos con más fotos
console.log('\n🏆 TOP 5 MODELOS CON MÁS FOTOS:');
console.log('-'.repeat(40));

modelsWithPhotos
  .sort((a, b) => b.photos - a.photos)
  .slice(0, 5)
  .forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}: ${model.photos} fotos (${model.sizeMB} MB)`);
  });

// Top 5 modelos con más peso
console.log('\n💾 TOP 5 MODELOS CON MÁS PESO:');
console.log('-'.repeat(40));

modelsWithPhotos
  .sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB))
  .slice(0, 5)
  .forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}: ${model.sizeMB} MB (${model.photos} fotos)`);
  });

// Modelos sin fotos
if (modelsWithoutPhotos.length > 0) {
  console.log('\n❌ MODELOS SIN FOTOS:');
  console.log('-'.repeat(40));
  modelsWithoutPhotos.forEach(model => {
    console.log(`   • ${model}`);
  });
}

// Distribución por tamaños
console.log('\n📏 DISTRIBUCIÓN POR TAMAÑOS:');
console.log('-'.repeat(40));

let smallPhotos = 0; // <100KB
let mediumPhotos = 0; // 100-300KB
let largePhotos = 0; // >300KB

modelsWithPhotos.forEach(model => {
  model.details.forEach(detail => {
    const sizeKB = parseFloat(detail.sizeKB);
    if (sizeKB < 100) smallPhotos++;
    else if (sizeKB <= 300) mediumPhotos++;
    else largePhotos++;
  });
});

console.log(`📏 Pequeñas (<100KB): ${smallPhotos} fotos (${(smallPhotos / totalPhotos * 100).toFixed(1)}%)`);
console.log(`📏 Medianas (100-300KB): ${mediumPhotos} fotos (${(mediumPhotos / totalPhotos * 100).toFixed(1)}%)`);
console.log(`📏 Grandes (>300KB): ${largePhotos} fotos (${(largePhotos / totalPhotos * 100).toFixed(1)}%)`);

console.log('\n✅ Análisis completado');
console.log('='.repeat(60));
