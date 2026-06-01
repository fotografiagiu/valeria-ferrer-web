#!/usr/bin/env node
/**
 * Genera miniaturas de galería faltantes en public/chicas-thumbnails/
 * a partir de originales en public/chicas/ (sin modificar chicas/).
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const MODELS_JSON = path.join(ROOT, 'data', 'models.json');

const MAX_DIMENSION = 800;
const TARGET_MAX_KB = 75;
const TARGET_MIN_KB = 50;
const QUALITY_STEPS = [72, 68, 64, 60, 56];

/** Misma lógica que getGalleryImageThumbnail en lib/modelGridImage.ts */
function getGalleryImageThumbnailPath(imageUrl) {
  const normalized = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  if (!normalized || normalized.includes('/chicas-thumbnails/')) {
    return normalized;
  }

  const thumbBase = normalized.replace('/chicas/', '/chicas-thumbnails/');

  if (normalized.endsWith('/portada.jpg') || normalized.endsWith('/portada-nueva.jpg')) {
    return thumbBase.replace(/\/portada(-nueva)?\.jpg$/, '/cover-thumbnail.jpg');
  }

  if (normalized.endsWith('/cover.jpg')) {
    return thumbBase.replace('/cover.jpg', '/cover-thumbnail.jpg');
  }

  return thumbBase;
}

function collectSourceUrls(models) {
  const urls = new Set();
  for (const model of models) {
    for (const img of model.images || []) {
      if (img?.startsWith('/chicas/')) urls.add(img);
    }
    const cover = model.coverImageUrl;
    if (cover?.startsWith('/chicas/')) urls.add(cover);
  }
  return [...urls];
}

function optimizeWithSips(sourcePath, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(sourcePath, destPath);
  execSync(`sips -Z ${MAX_DIMENSION} "${destPath}"`, { stdio: 'pipe' });

  let bestPath = destPath;
  let bestSize = fs.statSync(destPath).size;

  for (const quality of QUALITY_STEPS) {
    execSync(
      `sips -s format jpeg -s formatOptions ${quality} "${destPath}"`,
      { stdio: 'pipe' }
    );
    const size = fs.statSync(destPath).size;
    bestSize = size;
    if (size <= TARGET_MAX_KB * 1024) break;
  }

  if (bestSize > TARGET_MAX_KB * 1024) {
    for (const z of [650, 533, 480]) {
      execSync(`sips -Z ${z} "${destPath}"`, { stdio: 'pipe' });
      for (const quality of [58, 54, 50, 46]) {
        execSync(
          `sips -s format jpeg -s formatOptions ${quality} "${destPath}"`,
          { stdio: 'pipe' }
        );
        bestSize = fs.statSync(destPath).size;
        if (bestSize <= TARGET_MAX_KB * 1024) break;
      }
      if (bestSize <= TARGET_MAX_KB * 1024) break;
    }
  }

  return bestSize;
}

function main() {
  const models = JSON.parse(fs.readFileSync(MODELS_JSON, 'utf8'));
  const sources = collectSourceUrls(models);

  let created = 0;
  let skipped = 0;
  let errors = 0;
  const sizes = [];
  const bySlug = {};

  for (const sourceUrl of sources) {
    const thumbUrl = getGalleryImageThumbnailPath(sourceUrl);
    const thumbPath = path.join(PUBLIC, thumbUrl.replace(/^\//, ''));
    const sourcePath = path.join(PUBLIC, sourceUrl.replace(/^\//, ''));

    if (fs.existsSync(thumbPath)) {
      skipped++;
      continue;
    }

    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Original no encontrado: ${sourceUrl}`);
      errors++;
      continue;
    }

    try {
      const bytes = optimizeWithSips(sourcePath, thumbPath);
      const kb = Math.round(bytes / 1024);
      sizes.push(bytes);
      created++;

      const slug = sourceUrl.split('/chicas/')[1]?.split('/')[0] ?? 'unknown';
      bySlug[slug] = (bySlug[slug] || 0) + 1;

      const flag = kb > TARGET_MAX_KB ? ' (>' + TARGET_MAX_KB + 'KB)' : '';
      console.log(`✅ ${thumbUrl} (${kb}KB)${flag}`);
    } catch (err) {
      console.error(`❌ ${sourceUrl}: ${err.message}`);
      errors++;
    }
  }

  const avgKb =
    sizes.length > 0
      ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024)
      : 0;
  const overTarget = sizes.filter((b) => b > TARGET_MAX_KB * 1024).length;

  console.log('\n--- Resumen ---');
  console.log(`Creadas: ${created}`);
  console.log(`Ya existían: ${skipped}`);
  console.log(`Errores: ${errors}`);
  console.log(`Peso medio: ${avgKb} KB`);
  console.log(`Por encima de ${TARGET_MAX_KB} KB: ${overTarget}`);
  console.log('Fichas con archivos nuevos:', Object.keys(bySlug).sort().join(', ') || '(ninguna)');
}

main();
