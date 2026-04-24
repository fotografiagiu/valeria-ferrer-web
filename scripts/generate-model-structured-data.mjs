#!/usr/bin/env node

// Script para generar structured data JSON-LD para cada modelo
import fs from 'fs';
import path from 'path';

// Leer models.json
const modelsPath = path.join(process.cwd(), 'data', 'models.json');
const modelsData = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));

// Generar structured data para cada modelo
function generateModelStructuredData(model) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": model.name,
    "description": model.description,
    "url": `https://valeriaferrer.com/model/${model.slug}`,
    "image": model.images.map(img => `https://valeriaferrer.com${img}`),
    "nationality": model.nationality,
    "jobTitle": "Modelo VIP",
    "knowsLanguage": model.languages || ["Español"],
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Acompañamiento Premium",
        "description": `Servicios exclusivos de acompañamiento con ${model.name} en Valencia`
      },
      "areaServed": {
        "@type": "City",
        "name": model.city
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "name": "Contacto Directo",
        "url": "https://valeriaferrer.com/contact"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://valeriaferrer.com/model/${model.slug}`
    }
  };
}

// Crear directorio para structured data si no existe
const structuredDataDir = path.join(process.cwd(), 'public', 'structured-data');
if (!fs.existsSync(structuredDataDir)) {
  fs.mkdirSync(structuredDataDir, { recursive: true });
}

// Generar archivo para cada modelo
modelsData.forEach(model => {
  const structuredData = generateModelStructuredData(model);
  const filePath = path.join(structuredDataDir, `${model.slug}.json`);
  
  fs.writeFileSync(filePath, JSON.stringify(structuredData, null, 2));
  console.log(`✅ Generated structured data for ${model.name}: ${filePath}`);
});

// Generar índice de todos los modelos
const indexData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Modelos VIP Valeria Ferrer",
  "description": "Catálogo completo de modelos exclusivas en Valencia",
  "url": "https://valeriaferrer.com/models",
  "numberOfItems": modelsData.length,
  "itemListElement": modelsData.map((model, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Person",
      "name": model.name,
      "url": `https://valeriaferrer.com/model/${model.slug}`,
      "image": `https://valeriaferrer.com${model.coverImageUrl}`
    }
  }))
};

const indexPath = path.join(structuredDataDir, 'models-index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
console.log(`✅ Generated models index: ${indexPath}`);

console.log(`\n🎯 Generated structured data for ${modelsData.length} models`);
console.log('📁 Files saved in: public/structured-data/');
