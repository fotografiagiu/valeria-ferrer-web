import fs from 'fs';
import path from 'path';

// Leer el archivo models.json
const modelsPath = path.join(process.cwd(), 'data/models.json');
const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));

// Recolectar todas las imágenes utilizadas en los perfiles
const usedImages = new Set();

models.forEach(model => {
  // Agregar coverImageUrl
  if (model.coverImageUrl) {
    usedImages.add(model.coverImageUrl);
  }
  
  // Agregar imágenes del array images
  if (model.images && Array.isArray(model.images)) {
    model.images.forEach(image => {
      usedImages.add(image);
    });
  }
});

console.log('=== IMÁGENES UTILIZADAS EN PERFILES ===');
console.log(`Total de imágenes utilizadas: ${usedImages.size}`);
usedImages.forEach(image => console.log(`- ${image}`));

// Función para encontrar todos los archivos de imágenes en el directorio chicas
function findAllImages(dir) {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    return images;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      images.push(...findAllImages(filePath));
    } else if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      // Convertir a ruta relativa desde /public/chicas/
      const relativePath = filePath.replace(/.*\/public\//, '/');
      images.push(relativePath);
    }
  });
  
  return images;
}

// Encontrar todas las imágenes en el directorio chicas
const chicasDir = path.join(process.cwd(), 'public/chicas');
const allImages = findAllImages(chicasDir);

console.log('\n=== TODAS LAS IMÁGENES EN /PUBLIC/CHICAS ===');
console.log(`Total de imágenes en el directorio: ${allImages.length}`);
allImages.forEach(image => console.log(`- ${image}`));

// Encontrar imágenes no utilizadas
const unusedImages = allImages.filter(image => !usedImages.has(image));

console.log('\n=== IMÁGENES NO UTILIZADAS ===');
console.log(`Total de imágenes no utilizadas: ${unusedImages.length}`);
unusedImages.forEach(image => console.log(`- ${image}`));

// Generar comandos para eliminar imágenes no utilizadas
console.log('\n=== COMANDOS PARA ELIMINAR IMÁGENES NO UTILIZADAS ===');
unusedImages.forEach(image => {
  const fullPath = path.join(process.cwd(), 'public', image);
  console.log(`rm "${fullPath}"`);
});

// Guardar lista de imágenes no utilizadas en un archivo
const unusedImagesPath = path.join(process.cwd(), 'unused-images.txt');
fs.writeFileSync(unusedImagesPath, unusedImages.join('\n'));
console.log(`\nLista de imágenes no utilizadas guardada en: ${unusedImagesPath}`);
