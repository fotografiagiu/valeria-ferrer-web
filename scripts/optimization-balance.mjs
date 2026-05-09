#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 BALANCE DE OPTIMIZACIÓN - FICHAS Y GALERÍAS\n');
console.log('='.repeat(60));

// 1. Análisis de imágenes principales
console.log('\n📸 ANÁLISIS DE IMÁGENES PRINCIPALES:');
console.log('-'.repeat(40));

const mainImagesPath = './public/chicas';
const thumbnailsPath = './public/chicas-thumbnails';
const optimizedPath = './public/chicas-optimized';

function analyzeDirectory(dirPath, label) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`❌ ${label}: Directorio no existe`);
      return { count: 0, totalSize: 0, files: [] };
    }

    const files = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const modelDir = path.join(dirPath, dirent.name);
        const imageFiles = fs.readdirSync(modelDir)
          .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
          .map(file => {
            const filePath = path.join(modelDir, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              size: stats.size,
              sizeKB: (stats.size / 1024).toFixed(2)
            };
          });

        return {
          model: dirent.name,
          files: imageFiles,
          totalSize: imageFiles.reduce((sum, file) => sum + file.size, 0),
          count: imageFiles.length
        };
      });

    const totalSize = files.reduce((sum, model) => sum + model.totalSize, 0);
    const totalCount = files.reduce((sum, model) => sum + model.count, 0);

    console.log(`✅ ${label}:`);
    console.log(`   - Modelos: ${files.length}`);
    console.log(`   - Imágenes: ${totalCount}`);
    console.log(`   - Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    return { count: files.length, totalSize, files };
  } catch (error) {
    console.log(`❌ Error analizando ${label}:`, error.message);
    return { count: 0, totalSize: 0, files: [] };
  }
}

// Analizar cada directorio
const mainAnalysis = analyzeDirectory(mainImagesPath, 'Imágenes Principales (/chicas/)');
const thumbnailsAnalysis = analyzeDirectory(thumbnailsPath, 'Thumbnails (/chicas-thumbnails/)');
const optimizedAnalysis = analyzeDirectory(optimizedPath, 'Optimizadas (/chicas-optimized/)');

// 2. Análisis de modelos.json
console.log('\n📋 ANÁLISIS DE MODELS.JSON:');
console.log('-'.repeat(40));

try {
  const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));
  console.log(`✅ Modelos en JSON: ${modelsData.length}`);
  
  let totalImages = 0;
  let missingImages = 0;
  let oversizedImages = 0;
  
  modelsData.forEach((model, index) => {
    if (model.images && Array.isArray(model.images)) {
      totalImages += model.images.length;
      
      model.images.forEach(imageUrl => {
        const imagePath = path.join('./public', imageUrl);
        if (fs.existsSync(imagePath)) {
          const stats = fs.statSync(imagePath);
          const sizeKB = stats.size / 1024;
          if (sizeKB > 500) oversizedImages++;
        } else {
          missingImages++;
        }
      });
    }
  });
  
  console.log(`   - Total imágenes en JSON: ${totalImages}`);
  console.log(`   - Imágenes faltantes: ${missingImages}`);
  console.log(`   - Imágenes >500KB: ${oversizedImages}`);
  
} catch (error) {
  console.log(`❌ Error analizando models.json:`, error.message);
}

// 3. Análisis de rendimiento de componentes
console.log('\n⚡ ANÁLISIS DE RENDIMIENTO:');
console.log('-'.repeat(40));

// Verificar componentes clave
const components = [
  './components/GalleryModal.tsx',
  './components/LazyImage.tsx',
  './components/ModelsGrid.tsx',
  './pages/ModelDetail.tsx'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    const content = fs.readFileSync(component, 'utf8');
    console.log(`✅ ${component}:`);
    
    // Detectar optimizaciones
    if (content.includes('IntersectionObserver')) {
      console.log('   ✓ Lazy loading con IntersectionObserver');
    }
    if (content.includes('WebP')) {
      console.log('   ✓ Soporte WebP detectado');
    }
    if (content.includes('priority')) {
      console.log('   ✓ Priority loading para imágenes importantes');
    }
    if (content.includes('sizes')) {
      console.log('   ✓ Responsive sizes attribute');
    }
  } else {
    console.log(`❌ ${component}: No encontrado`);
  }
});

// 4. Recomendaciones
console.log('\n🎯 RECOMENDACIONES DE OPTIMIZACIÓN:');
console.log('-'.repeat(40));

console.log('\n📌 IMÁGENES:');
console.log('• Comprimir imágenes >500KB a 200-300KB');
console.log('• Convertir a WebP para mayor compresión');
console.log('• Generar thumbnails de 64x64px para galería');
console.log('• Implementar blur placeholders');

console.log('\n📌 RENDIMIENTO:');
console.log('• Implementar cache headers longer');
console.log('• Usar CDN para imágenes estáticas');
console.log('• Preload imágenes críticas');
console.log('• Optimizar bundle con code splitting');

console.log('\n📌 UX:');
console.log('• Skeleton loading para galerías');
console.log('• Zoom suave con Framer Motion');
console.log('• Touch gestures mejorados');
console.log('• Progress indicators');

console.log('\n✅ Balance completado');
