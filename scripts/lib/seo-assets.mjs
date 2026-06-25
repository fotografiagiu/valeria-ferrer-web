import fs from 'fs';
import path from 'path';

export const SITE_ORIGIN = 'https://www.valeriaferrer.com';
export const ROOT = process.cwd();
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const DIST_DIR = path.join(ROOT, 'dist');

/** Escribe en public/ y, si existe dist/ (post-vite build), replica ahí para producción. */
export function writeSeoOutputFile(relativePath, content) {
  const publicFile = path.join(PUBLIC_DIR, relativePath);
  fs.mkdirSync(path.dirname(publicFile), { recursive: true });
  fs.writeFileSync(publicFile, content);

  if (fs.existsSync(DIST_DIR)) {
    const distFile = path.join(DIST_DIR, relativePath);
    fs.mkdirSync(path.dirname(distFile), { recursive: true });
    fs.writeFileSync(distFile, content);
  }
}

export const MODELS_PATH = path.join(ROOT, 'data', 'models.json');
export const BLOG_PATH = path.join(ROOT, 'data', 'blog.json');
export const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
export const STRUCTURED_DATA_DIR = path.join(PUBLIC_DIR, 'structured-data');
export const ARCHIVE_DIR = path.join(ROOT, '_archive', 'structured-data');

export const ORPHAN_STRUCTURED_DATA = [
  'alba-vip',
  'andrea',
  'carlota',
  'emma',
  'gaby-vip',
  'tania',
  'maria',
];

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function toAbsoluteUrl(relativePath) {
  const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function publicPathFromUrl(url) {
  const prefix = `${SITE_ORIGIN}/`;
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length - 1);
}

export function fileExistsInPublic(relativePath) {
  if (!relativePath || !relativePath.startsWith('/')) return false;
  return fs.existsSync(path.join(PUBLIC_DIR, relativePath.slice(1)));
}

export function collectModelImagePaths(model) {
  const paths = [];
  for (const candidate of [model.coverImageUrl, ...(model.images || [])]) {
    if (candidate && !paths.includes(candidate)) {
      paths.push(candidate);
    }
  }
  return paths;
}

export function filterExistingImages(relativePaths, reportLabel = '') {
  const valid = [];
  const missing = [];

  for (const relativePath of relativePaths) {
    if (fileExistsInPublic(relativePath)) {
      valid.push(relativePath);
    } else {
      missing.push(relativePath);
      if (reportLabel) {
        console.warn(`⚠️  Missing image${reportLabel ? ` (${reportLabel})` : ''}: ${relativePath}`);
      }
    }
  }

  return { valid, missing };
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
