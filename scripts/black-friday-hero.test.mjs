import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const text = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const hero = text('components/NovemberNoirHome.tsx');
const css = text('styles/valeria-home-final.css');
const file = readFileSync(new URL('../public/images/black-friday-hero-trial.avif', import.meta.url));

test('Black Friday trial asset is valid AVIF and not a second drawn navigation', () => {
  assert.equal(file.toString('ascii', 4, 8), 'ftyp');
  assert.equal(file.toString('ascii', 8, 12), 'avif');
  assert.equal(file.length, 7020);
});

test('desktop uses trial image, but mobile keeps its original picture source', () => {
  assert.match(hero, /media="\(min-width: 1024px\)"[\s\S]*?srcSet="\/images\/black-friday-hero-trial\.avif"/);
  assert.match(hero, /media="\(max-width: 767px\)"[\s\S]*?srcSet="\/images\/valeria-premium-hero-mobile\.webp"/);
  assert.match(hero, /<h1 id="vf-lux-hero-title" className="vf-lux-hero__title">/);
  assert.match(hero, /<Link to="\/models"/);
  assert.match(hero, /<Link to="\/booking"/);
});

test('Black Friday overlay does not crop the woman's face or hide the promo at medium desktop widths', () => {
  assert.match(css, /\.vf-noir-home-page \.vf-lux-hero--black-friday \.vf-lux-hero__visual picture img\s*\{[\s\S]*?object-fit: contain/);
  assert.match(css, /\.vf-noir-home-page \.vf-lux-hero--black-friday \.vf-lux-hero__shade\s*\{[\s\S]*?linear-gradient\(90deg/);
  assert.match(css, /@media \(min-width: 1024px\)/);
  assert.match(css, /@media \(min-width: 1800px\)/);
});
