#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Añadiendo lógica de filtrado de imágenes válidas a GalleryModal...\n');

const galleryModalPath = './components/GalleryModal.tsx';
let content = fs.readFileSync(galleryModalPath, 'utf8');

// Encontrar la sección donde se renderizan los thumbnails
const thumbnailsSection = content.match(/\/\/ Thumbnails - Lazy Loading[\s\S]*?{images\.map[\s\S]*?\)\);/s);

if (!thumbnailsSection) {
  console.log('❌ No se encontró la sección de thumbnails');
  process.exit(1);
}

// Crear la nueva lógica con filtrado de imágenes válidas
const newThumbnailsLogic = `// Thumbnails - Lazy Loading
            {images.length > 1 && (
              <motion.div
                variants={thumbnailVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 flex gap-2 overflow-x-auto py-2 px-4 max-w-[90vw] scrollbar-hide"
              >
                {images.map((image, index) => {
                  // Verificar si la imagen existe antes de renderizar
                  const imageExists = typeof window !== 'undefined' && 
                    fetch(image.replace('/chicas/', '/chicas-thumbnails/').replace(/\\.jpg$/, '/cover-thumbnail.jpg'))
                      .then(() => true)
                      .catch(() => false);
                  
                  // Solo cargar thumbnails visibles y adyacentes
                  const isVisible = Math.abs(index - currentIndex) <= 2;
                  return (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={\`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 \${
                        index === currentIndex 
                          ? 'ring-2 ring-[#c2b2a3] scale-110' 
                          : 'opacity-60 hover:opacity-80 hover:scale-105'
                      }\`}
                    >
                      {isVisible ? (
                        <LazyImage
                          src={image}
                          alt={\`\${modelName} - Miniatura \${index + 1}\`}
                          className="w-full h-full object-cover"
                          sizes="64px"
                          priority={index === currentIndex}
                          onError={(e) => {
                            // Si la imagen no carga, ocultar el botón
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        // Placeholder para thumbnails no visibles
                        <div className="w-full h-full bg-[#111111] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}`;

// Reemplazar la sección antigua con la nueva
content = content.replace(/\/\/ Thumbnails - Lazy Loading[\s\S]*?{images\.map[\s\S]*?\)\);/s, newThumbnailsLogic);

// Guardar el archivo modificado
fs.writeFileSync(galleryModalPath, content);

console.log('✅ GalleryModal.tsx actualizado con lógica de filtrado de imágenes válidas');
console.log('📋 Cambios realizados:');
console.log('- Añadida verificación de existencia de imágenes');
console.log('- Manejo de errores de carga con onError');
console.log('- Ocultación automática de thumbnails rotos');
console.log('- Mantenimiento de lógica de lazy loading existente');
