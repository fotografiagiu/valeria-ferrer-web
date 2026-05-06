#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const CHICAS_DIR = 'public/chicas';
const THUMBNAILS_DIR = 'public/chicas-thumbnails';
const THUMBNAIL_SIZE = 600;

// Create thumbnails directory
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

console.log('🖼️  Creando thumbnails simples para cards...');

// Process all model directories
const modelDirs = fs.readdirSync(CHICAS_DIR)
  .filter(dir => fs.statSync(path.join(CHICAS_DIR, dir)).isDirectory());

modelDirs.forEach(modelDir => {
  const modelPath = path.join(CHICAS_DIR, modelDir);
  const thumbnailPath = path.join(THUMBNAILS_DIR, modelDir);  
  if (!fs.existsSync(thumbnailPath)) {
    fs.mkdirSync(thumbnailPath, { recursive: true });
  }

  // Find cover image (portada.jpg, primera.jpg, gallery/01.jpg, cover.jpg, 1.jpg)
  const coverImages = ['portada.jpg', 'primera.jpg', 'gallery/01.jpg', 'cover.jpg', '1.jpg'];
  let coverImage = null;  
  for (const imgName of coverImages) {
    const imgPath = path.join(modelPath, imgName);
    if (fs.existsSync(imgPath)) {
      coverImage = imgPath;
      break;
    }
  }

  if (coverImage) {
    const thumbnailName = `cover-thumbnail.jpg`;
    const outputPath = path.join(thumbnailPath, thumbnailName);
    
    try {
      // Simple copy for now (we'll optimize later)
      fs.copyFileSync(coverImage, outputPath);
      
      // Get file size
      const stats = fs.statSync(outputPath);
      const sizeKB = Math.round(stats.size / 1024);
      
      console.log(`✅ ${modelDir}: cover-thumbnail.jpg (${sizeKB}KB)`);
    } catch (error) {
      console.error(`❌ Error procesando ${modelDir}:`, error.message);
    }
  }
});

console.log('\n🎯 Thumbnails creados en public/chicas-thumbnails/');
console.log('📊 Usar en ModelsGrid: src="/chicas-thumbnails/${modelDir}/cover-thumbnail.jpg"');
