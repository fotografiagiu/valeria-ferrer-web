#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PUBLIC_DIR = 'public/chicas';
const THUMBNAILS_DIR = 'public/chicas-thumbnails';

console.log('🎯 Creando thumbnails optimizados con sips...');

// Asegurar que el directorio de thumbnails existe
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// Obtener todos los directorios de modelos
const modelDirs = fs.readdirSync(PUBLIC_DIR)
  .filter(item => {
    const itemPath = path.join(PUBLIC_DIR, item);
    return fs.statSync(itemPath).isDirectory() && item !== 'README.md';
  })
  .sort();

console.log(`📁 Procesando ${modelDirs.length} directorios de modelos...`);

let totalOptimized = 0;
let totalSizeSaved = 0;

modelDirs.forEach((modelDir, index) => {
  console.log(`\n📸 ${index + 1}/${modelDirs.length}: ${modelDir}`);
  
  const modelPath = path.join(PUBLIC_DIR, modelDir);
  const thumbnailDir = path.join(THUMBNAILS_DIR, modelDir);
  
  // Crear directorio de thumbnails si no existe
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }
  
  // Buscar imagen de portada (prioridad: portada.jpg > primera.jpg > 1.jpg > cover.jpg)
  const coverImages = ['portada.jpg', 'primera.jpg', '1.jpg', 'cover.jpg'];
  let coverImage = null;
  
  for (const imgName of coverImages) {
    const imgPath = path.join(modelPath, imgName);
    if (fs.existsSync(imgPath)) {
      coverImage = imgPath;
      break;
    }
  }
  
  // Buscar en gallery/ si no hay portada
  if (!coverImage) {
    const galleryDir = path.join(modelPath, 'gallery');
    if (fs.existsSync(galleryDir)) {
      const galleryImages = fs.readdirSync(galleryDir);
      if (galleryImages.includes('01.jpg')) {
        coverImage = path.join(galleryDir, '01.jpg');
      }
    }
  }
  
  if (!coverImage) {
    console.log(`  ⚠️  No se encontró imagen de portada para ${modelDir}`);
    return;
  }
  
  const thumbnailPath = path.join(thumbnailDir, 'cover-thumbnail.jpg');
  
  // Obtener tamaño original
  const originalSize = fs.statSync(coverImage).size;
  
  // Crear thumbnail optimizado con sips
  try {
    // Redimensionar a máximo 400px de ancho, manteniendo proporción
    execSync(`sips -Z 400 "${coverImage}" --out "${thumbnailPath}"`, { stdio: 'pipe' });
    
    const thumbnailSize = fs.statSync(thumbnailPath).size;
    const sizeSaved = originalSize - thumbnailSize;
    const percentSaved = ((sizeSaved / originalSize) * 100).toFixed(1);
    
    totalOptimized++;
    totalSizeSaved += sizeSaved;
    
    console.log(`  ✅ Thumbnail creado: ${thumbnailSize} bytes (ahorro: ${sizeSaved} bytes, ${percentSaved}%)`);
    
  } catch (error) {
    console.log(`  ❌ Error creando thumbnail: ${error.message}`);
  }
});

console.log(`\n🎉 Optimización completada!`);
console.log(`📊 Resumen:`);
console.log(`• Thumbnails optimizados: ${totalOptimized}/${modelDirs.length}`);
console.log(`• Espacio total ahorrado: ${(totalSizeSaved / 1024 / 1024).toFixed(2)}MB`);
console.log(`• Promedio de ahorro por imagen: ${((totalSizeSaved / totalOptimized) / 1024).toFixed(1)}KB`);
