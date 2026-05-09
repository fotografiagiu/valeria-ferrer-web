#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

console.log('🎯 OPTIMIZANDO MODELOS MÁS POPULARES');
console.log('='.repeat(50));

// Modelos más visitados según Vercel Analytics
const popularModels = ['kim', 'carla', 'teresa', 'paula-vip'];
const modelsData = JSON.parse(fs.readFileSync('./data/models.json', 'utf8'));

// Encontrar los datos de los modelos populares
const popularModelsData = modelsData.filter(model => 
  popularModels.includes(model.slug)
);

console.log('\n📊 MODELOS POPULARES ENCONTRADOS:');
popularModelsData.forEach(model => {
  console.log(`✅ ${model.name} (${model.slug})`);
});

// Función para crear thumbnails optimizados
const createOptimizedThumbnails = async (model) => {
  const modelDir = model.slug;
  const thumbnailsDir = path.join('./public/chicas-thumbnails', modelDir);
  
  // Crear directorio si no existe
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  console.log(`\n🔧 Optimizando ${model.name}:`);

  // Optimizar portada
  if (model.coverImageUrl) {
    const coverPath = path.join('./public', model.coverImageUrl);
    const thumbnailPath = path.join(thumbnailsDir, 'cover-thumbnail.jpg');
    
    if (fs.existsSync(coverPath)) {
      try {
        await sharp(coverPath)
          .resize(200, 300, { 
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(thumbnailPath);
        
        const originalSize = fs.statSync(coverPath).size;
        const thumbnailSize = fs.statSync(thumbnailPath).size;
        const savings = ((originalSize - thumbnailSize) / originalSize * 100).toFixed(1);
        
        console.log(`   ✅ Portada: ${(originalSize/1024).toFixed(1)}KB → ${(thumbnailSize/1024).toFixed(1)}KB (${savings}% reducción)`);
      } catch (error) {
        console.log(`   ❌ Error optimizando portada: ${error.message}`);
      }
    }
  }

  // Optimizar imágenes de galería
  if (model.images && Array.isArray(model.images)) {
    for (let i = 0; i < Math.min(model.images.length, 8); i++) { // Solo primeras 8 imágenes
      const imagePath = path.join('./public', model.images[i]);
      const thumbnailPath = path.join(thumbnailsDir, `gallery-${i + 1}-thumbnail.jpg`);
      
      if (fs.existsSync(imagePath)) {
        try {
          await sharp(imagePath)
            .resize(150, 200, { 
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: 80, progressive: true })
            .toFile(thumbnailPath);
          
          const originalSize = fs.statSync(imagePath).size;
          const thumbnailSize = fs.statSync(thumbnailPath).size;
          const savings = ((originalSize - thumbnailSize) / originalSize * 100).toFixed(1);
          
          console.log(`   ✅ Galería ${i + 1}: ${(originalSize/1024).toFixed(1)}KB → ${(thumbnailSize/1024).toFixed(1)}KB (${savings}% reducción)`);
        } catch (error) {
          console.log(`   ❌ Error optimizando galería ${i + 1}: ${error.message}`);
        }
      }
    }
  }
};

// Procesar todos los modelos populares
const optimizeAll = async () => {
  console.log('\n🚀 INICIANDO OPTIMIZACIÓN...');
  
  for (const model of popularModelsData) {
    await createOptimizedThumbnails(model);
  }
  
  console.log('\n✅ Optimización completada');
  console.log('📈 Los thumbnails optimizados reducirán significativamente la transferencia en móvil');
};

// Ejecutar optimización
optimizeAll().catch(console.error);
