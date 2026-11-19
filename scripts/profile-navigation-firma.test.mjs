import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const detail = read('pages/ModelDetail.tsx');
const style = read('styles/model-detail-editorial-v2.css');
const modal = read('components/GalleryModal.tsx');
const firma = read('components/VfPhotoFirma.tsx');
const skip = JSON.parse(read('data/firma-skip-stamped.json'));

test('desktop profile navigation uses crawlable previous and next links, independent of hidden legacy toolbar', () => {
  assert.match(detail, /<nav className="vf-desktop-profile-nav"/);
  assert.match(detail, /to=\{\`\/models\/\$\{previousModel\.id\}\`\}/);
  assert.match(detail, /to=\{\`\/models\/\$\{nextModel\.id\}\`\}/);
  assert.match(style, /\.vf-profile-detail \.vf-desktop-profile-nav\s*\{\s*display: none;/);
  assert.match(style, /@media \(min-width: 1024px\)[\s\S]*?\.vf-desktop-profile-nav\s*\{[\s\S]*?display: flex;/);
});

test('large gallery images and viewer receive the brand overlay', () => {
  assert.match(detail, /className="vf-profile-gallery__firma"/);
  assert.match(detail, /photoSrc=\{\(model\.gallery \|\| \[\]\)\[0\]\}/);
  assert.match(detail, /photoSrc=\{img\}/);
  assert.match(modal, /<VfPhotoFirma className="vf-gallery-modal__firma" photoSrc=\{currentSrc\} priority \/>/);
  assert.match(firma, /loading=\{priority \? 'eager' : 'lazy'\}/);
});

test('Luna gallery originals are not excluded from display watermark', () => {
  assert.equal(skip.skipFirmaUrls.some((p) => p.includes('luna-model-agency-valencia-vf')), false);
});

test('metadata and canonical elements remain unchanged by profile navigation', () => {
  assert.match(detail, /<SEOHead model=\{seoModel\}/);
  assert.match(detail, /<EditorialProfileIntro model=\{model\} onOpenGallery=\{openGallery\}/);
});
