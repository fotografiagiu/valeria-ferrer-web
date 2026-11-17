#!/usr/bin/env node
/**
 * Sustituye fotos antiguas con cuño incrustado por originales limpios.
 * No intenta borrar marcas de agua con filtros: usa exclusivamente el original aportado.
 *
 * Estructura:
 *   originales-limpios/SLUG/gallery/01.jpg
 *   -> public/chicas/SLUG/gallery/01.jpg
 *
 * Uso:
 *   node scripts/restore-clean-model-photos.mjs --report
 *   node scripts/restore-clean-model-photos.mjs --apply --verified-originals
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOT = path.join(ROOT, 'originales-limpios');
const INVENTORY_PATH = path.join(ROOT, 'data/firma-skip-stamped.json');
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const report = args.has('--report') || !apply;
const verified = args.has('--verified-originals');
if (apply && !verified) {
  console.error('Para aplicar los cambios, usa --apply --verified-originals después de revisar visualmente los originales.');
  process.exit(2);
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
if (!Array.isArray(inventory.skipFirmaUrls)) throw new Error('Inventario de fotos inválido');
const stamped = new Set(inventory.skipFirmaUrls);
const isSafeRelativePath = (rel) =>
  !!rel && !rel.includes('..') && !rel.includes('\\') && /^[a-zA-Z0-9_\-/]+\.(?:jpe?g|webp|png)$/i.test(rel);
const fileFromUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith('/chicas/')) return null;
  const relative = url.slice('/chicas/'.length);
  return isSafeRelativePath(relative) ? relative : null;
};
const thumbUrl = (imageUrl) => {
  const base = imageUrl.replace('/chicas/', '/chicas-thumbnails/');
  return /\/(?:portada(?:-nueva)?|portada-[^/]+|cover)\.jpg$/i.test(base)
    ? base.replace(/\/(?:portada(?:-nueva)?|portada-[^/]+|cover)\.jpg$/i, '/cover-thumbnail.jpg')
    : base;
};
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const matchesMagic = (file) => {
  const head = fs.readFileSync(file).subarray(0, 16);
  if (/\.jpe?g$/i.test(file)) return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (/\.png$/i.test(file)) return head.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  if (/\.webp$/i.test(file)) return head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP';
  return false;
};
function writeFileAtomic(dest, original) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const temp = dest + '.clean-replacement-temp';
  try {
    fs.copyFileSync(original, temp);
    fs.renameSync(temp, dest);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}
function updateThumb(source, destination) {
  const suffix = path.extname(destination).toLowerCase();
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (process.platform === 'darwin' && (suffix === '.jpg' || suffix === '.jpeg')) {
    try {
      const temp = destination + '.clean-replacement-temp.jpg';
      try {
        fs.copyFileSync(source, temp);
        execFileSync('sips', ['-Z', '800', '-s', 'format', 'jpeg', '-s', 'formatOptions', '76', temp], { stdio: 'pipe' });
        fs.renameSync(temp, destination);
        return;
      } finally {
        if (fs.existsSync(temp)) fs.unlinkSync(temp);
      }
    } catch {
      console.warn('No se pudo optimizar miniatura con sips; se usa la foto limpia directamente.');
    }
  }
  writeFileAtomic(destination, source);
}

const paths = [...stamped].sort().filter((url) => fileFromUrl(url) !== null);
const items = [];
for (const url of paths) {
  const rel = fileFromUrl(url);
  const clean = path.join(SOURCE_ROOT, rel);
  const target = path.join(ROOT, 'public/chicas', rel);
  if (!fs.existsSync(clean)) continue;
  if (!fs.existsSync(target)) {
    throw new Error('No existe el destino en la web: ' + url);
  }
  if (!matchesMagic(clean)) throw new Error('No es una foto válida del tipo esperado: ' + clean);
  if (fs.statSync(clean).size < 15_000) throw new Error('Original demasiado pequeño: ' + clean);
  if (sha(clean) === sha(target)) {
    throw new Error('El archivo suministrado es idéntico al que lleva cuño; revisa el original: ' + url);
  }
  const thumb = thumbUrl(url);
  const thumbPath = path.join(ROOT, 'public', thumb.slice(1));
  items.push({ url, rel, clean, target, thumb, thumbPath, thumbExists: fs.existsSync(thumbPath) });
}
console.log('Fotos originales disponibles para sustituir: ' + items.length + ' / ' + paths.length);
for (const item of items) console.log('  ' + item.url + (item.thumbExists ? ' [miniatura también]' : ''));
const missingCount = paths.length - items.length;
console.log('Aún pendientes de originales: ' + missingCount);
if (report || !items.length) {
  if (apply && !items.length) console.log('No hay originales nuevos: no se ha modificado nada.');
  process.exit(0);
}
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = path.join(ROOT, '.photo-restoration-backups', stamp);
for (const item of items) {
  const originalBackup = path.join(backup, 'chicas', item.rel);
  fs.mkdirSync(path.dirname(originalBackup), { recursive: true });
  fs.copyFileSync(item.target, originalBackup);
  if (item.thumbExists) {
    const thumbBackup = path.join(backup, item.thumb.slice(1));
    fs.mkdirSync(path.dirname(thumbBackup), { recursive: true });
    fs.copyFileSync(item.thumbPath, thumbBackup);
  }
}
console.log('Copia de seguridad creada en ' + path.relative(ROOT, backup));
for (const item of items) {
  writeFileAtomic(item.target, item.clean);
  if (item.thumbExists) updateThumb(item.clean, item.thumbPath);
  stamped.delete(item.url);
  if (item.thumbExists) stamped.delete(item.thumb);
}
// Mantener la lista de URLs aún estampadas; no incluir como exentas las fotos ya limpias.
inventory.skipFirmaUrls = [...stamped].sort();
const invTemp = INVENTORY_PATH + '.clean-replacement-temp';
try {
  fs.writeFileSync(invTemp, JSON.stringify(inventory, null, 2) + '\n', 'utf8');
  fs.renameSync(invTemp, INVENTORY_PATH);
} finally {
  if (fs.existsSync(invTemp)) fs.unlinkSync(invTemp);
}
console.log('Hecho: ' + items.length + ' fotos limpias y miniaturas actualizadas.');
console.log('No se han cambiado rutas, orden de las fichas ni títulos SEO.');
console.log('Revisa las fotos y publica los cambios en GitHub. Conserva el respaldo hasta verificar la web.');
