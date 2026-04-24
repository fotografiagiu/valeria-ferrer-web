import fs from 'fs';
import path from 'path';

// Leer la lista de imágenes no utilizadas
const unusedImagesPath = path.join(process.cwd(), 'unused-images.txt');
const unusedImages = fs.readFileSync(unusedImagesPath, 'utf8')
  .split('\n')
  .filter(line => line.trim() !== '');

console.log(`=== ELIMINANDO ${unusedImages.length} IMÁGENES NO UTILIZADAS ===`);

let deletedCount = 0;
let errorCount = 0;

unusedImages.forEach((imagePath, index) => {
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      deletedCount++;
      console.log(`[${index + 1}/${unusedImages.length}] ✓ Eliminado: ${imagePath}`);
    } else {
      console.log(`[${index + 1}/${unusedImages.length}] ⚠ No existe: ${imagePath}`);
    }
  } catch (error) {
    errorCount++;
    console.log(`[${index + 1}/${unusedImages.length}] ✗ Error eliminando ${imagePath}: ${error.message}`);
  }
});

console.log(`\n=== RESUMEN ===`);
console.log(`✓ Imágenes eliminadas: ${deletedCount}`);
console.log(`✗ Errores: ${errorCount}`);
console.log(`📁 Total procesadas: ${unusedImages.length}`);

// Eliminar directorios vacíos
function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  let hasFiles = false;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removeEmptyDirs(filePath);
      if (fs.existsSync(filePath) && fs.readdirSync(filePath).length === 0) {
        fs.rmdirSync(filePath);
        console.log(`📁 Directorio vacío eliminado: ${filePath}`);
      } else if (fs.existsSync(filePath)) {
        hasFiles = true;
      }
    } else {
      hasFiles = true;
    }
  });
  
  if (!hasFiles && fs.existsSync(dir)) {
    fs.rmdirSync(dir);
    console.log(`📁 Directorio vacío eliminado: ${dir}`);
  }
}

console.log(`\n=== LIMPIANDO DIRECTORIOS VACÍOS ===`);
removeEmptyDirs(path.join(process.cwd(), 'public/chicas'));

console.log(`\n✅ Limpieza completada!`);
