import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./restore-clean-model-photos.mjs', import.meta.url));
const url = '/chicas/prueba/gallery/01.jpg';
const thumbnailUrl = '/chicas-thumbnails/prueba/gallery/01.jpg';

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vf-photos-'));
  const write = (p, data) => {
    const file = path.join(root, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, data);
    return file;
  };
  const jpg = (character) => {
    const b = Buffer.alloc(25_000, character);
    b[0] = 0xff; b[1] = 0xd8; b[2] = 0xff;
    return b;
  };
  const old = jpg(12);
  const clean = jpg(21);
  const target = write('public/chicas/prueba/gallery/01.jpg', old);
  const thumb = write('public/chicas-thumbnails/prueba/gallery/01.jpg', old);
  const original = write('originales-limpios/prueba/gallery/01.jpg', clean);
  const inventory = write('data/firma-skip-stamped.json', JSON.stringify({skipFirmaUrls: [url, thumbnailUrl]}));
  const run = (...args) => spawnSync(process.execPath, [script, ...args], {
    cwd: root, encoding: 'utf8', env: {...process.env, VF_PHOTO_RESTORE_ROOT: root}
  });
  return {root, old, clean, target, thumb, original, inventory, run};
}

test('dry-run informa sin modificar fotos ni exenciones', (t) => {
  const f = setup();
  t.after(() => fs.rmSync(f.root, {recursive:true, force:true}));
  const r = f.run('--report');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /1 \/ 1/);
  assert.deepEqual(fs.readFileSync(f.target), f.old);
  assert.deepEqual(JSON.parse(fs.readFileSync(f.inventory)).skipFirmaUrls, [url, thumbnailUrl]);
});

test('aplicar sin revisión explícita de originales está prohibido', (t) => {
  const f = setup();
  t.after(() => fs.rmSync(f.root, {recursive:true, force:true}));
  const r = f.run('--apply');
  assert.equal(r.status, 2);
  assert.deepEqual(fs.readFileSync(f.target), f.old);
});

test('restaura foto, miniatura, inventario y conserva copia de seguridad', (t) => {
  const f = setup();
  t.after(() => fs.rmSync(f.root, {recursive:true, force:true}));
  const r = f.run('--apply','--verified-originals');
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(fs.readFileSync(f.target), f.clean);
  assert.deepEqual(fs.readFileSync(f.thumb), f.clean);
  assert.deepEqual(JSON.parse(fs.readFileSync(f.inventory)).skipFirmaUrls, []);
  const runs = fs.readdirSync(path.join(f.root,'.photo-restoration-backups'));
  assert.equal(runs.length, 1);
  const backup = path.join(f.root,'.photo-restoration-backups',runs[0]);
  assert.deepEqual(fs.readFileSync(path.join(backup, 'chicas/prueba/gallery/01.jpg')), f.old);
  assert.deepEqual(fs.readFileSync(path.join(backup, 'chicas-thumbnails/prueba/gallery/01.jpg')), f.old);
});

test('impide reemplazar por la misma foto marcada', (t) => {
  const f = setup();
  t.after(() => fs.rmSync(f.root, {recursive:true, force:true}));
  fs.copyFileSync(f.target, f.original);
  const r = f.run('--apply','--verified-originals');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /idéntico/);
  assert.deepEqual(fs.readFileSync(f.target), f.old);
});
