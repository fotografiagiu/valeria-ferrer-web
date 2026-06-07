#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  ARCHIVE_DIR,
  MODELS_PATH,
  ORPHAN_STRUCTURED_DATA,
  STRUCTURED_DATA_DIR,
  SITE_ORIGIN,
  collectModelImagePaths,
  filterExistingImages,
  readJson,
  toAbsoluteUrl,
} from './lib/seo-assets.mjs';

function generateModelStructuredData(model, imagePaths) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: model.name,
    description: model.description,
    url: `${SITE_ORIGIN}/models/${model.slug}`,
    image: imagePaths.map(toAbsoluteUrl),
    nationality: model.nationality,
    jobTitle: 'Modelo VIP',
    knowsLanguage: model.languages || ['Español'],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Acompañamiento Premium',
        description: `Servicios exclusivos de acompañamiento con ${model.name} en Valencia`,
      },
      areaServed: {
        '@type': 'City',
        name: model.city,
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        name: 'Contacto Directo',
        url: `${SITE_ORIGIN}/contact`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}/models/${model.slug}`,
    },
  };
}

function archiveOrphanFiles(activeSlugs) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  const toArchive = new Set(ORPHAN_STRUCTURED_DATA);

  if (fs.existsSync(STRUCTURED_DATA_DIR)) {
    for (const file of fs.readdirSync(STRUCTURED_DATA_DIR)) {
      if (!file.endsWith('.json')) continue;
      const slug = file.replace(/\.json$/, '');
      if (slug === 'models-index') continue;
      if (!activeSlugs.has(slug)) {
        toArchive.add(slug);
      }
    }
  }

  const moved = [];
  for (const slug of toArchive) {
    const source = path.join(STRUCTURED_DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(source)) continue;

    const destination = path.join(ARCHIVE_DIR, `${slug}.json`);
    fs.renameSync(source, destination);
    moved.push(slug);
    console.log(`📦 Archived orphan structured data: ${slug}.json`);
  }

  return moved;
}

const models = readJson(MODELS_PATH);
const activeSlugs = new Set(models.map((model) => model.slug));

fs.mkdirSync(STRUCTURED_DATA_DIR, { recursive: true });

const generated = [];

for (const model of models) {
  const { valid, missing } = filterExistingImages(
    collectModelImagePaths(model),
    model.slug
  );

  if (missing.length) {
    console.warn(`⚠️  ${model.slug}: skipped ${missing.length} missing image(s) in structured data`);
  }

  const structuredData = generateModelStructuredData(model, valid);
  const filePath = path.join(STRUCTURED_DATA_DIR, `${model.slug}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(structuredData, null, 2)}\n`);
  generated.push(model.slug);
  console.log(`✅ Generated structured data for ${model.name}: ${filePath}`);
}

const indexData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Modelos VIP Valeria Ferrer',
  description: 'Catálogo completo de modelos exclusivas en Valencia',
  url: `${SITE_ORIGIN}/models`,
  numberOfItems: models.length,
  itemListElement: models.map((model, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Person',
      name: model.name,
      url: `${SITE_ORIGIN}/models/${model.slug}`,
      image: toAbsoluteUrl(model.coverImageUrl),
    },
  })),
};

const indexPath = path.join(STRUCTURED_DATA_DIR, 'models-index.json');
fs.writeFileSync(indexPath, `${JSON.stringify(indexData, null, 2)}\n`);
console.log(`✅ Generated models index: ${indexPath}`);

const moved = archiveOrphanFiles(activeSlugs);

console.log(`\n🎯 Generated structured data for ${generated.length} models`);
console.log(`📁 Active files: public/structured-data/*.json (${generated.length + 1} including index)`);
console.log(`📦 Archived: ${moved.length} orphan file(s)`);

export { generated, moved };
