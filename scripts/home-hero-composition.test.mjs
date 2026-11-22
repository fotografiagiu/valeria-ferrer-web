import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = read('styles/valeria-home-final.css');
const home = read('pages/Home.tsx');
const hero = read('components/NovemberNoirHome.tsx');
const news = read('components/HomeNovedadesStrip.tsx');

test('home retains the single canonical hero image and SEO content', () => {
  assert.match(home, /<NovemberNoirHome models=\{homeModels\}/);
  assert.match(home, /<HomeNovedadesStrip models=\{homeModels\}/);
  assert.match(hero, /<h1 id="vf-lux-hero-title"/);
  assert.match(hero, /src="https:\/\/d2ol7oe51mr4n9\.cloudfront\.net\/[^"]+\.png"/);
  assert.match(hero, /vf-lux-hero--black-friday/);
  assert.match(css, /\.vf-noir-home-page \.vf-lux-hero--black-friday \.vf-lux-hero__shade/);
  const finalDesktop = css.slice(css.lastIndexOf('/* FINAL DESKTOP HERO:'));
  assert.ok(finalDesktop.length > 200);
  assert.doesNotMatch(finalDesktop, /url\(['"]\/images\/valeria-premium-hero.webp/);
  assert.match(finalDesktop, /\.vf-noir-home-page \.vf-lux-hero__visual\s*\{[\s\S]*?background:#190811/);
  assert.match(finalDesktop, /object-fit:contain;object-position:right center/);
});

test('Novedades hangs at the hero edge instead of over model body', () => {
  assert.match(css, /\.vf-noir-home-page > \.vf-lux-news\s*\{[\s\S]*?margin:-76px auto 0;/);
  assert.match(news, /className="vf-lux-news__rail"/);
  assert.match(news, /className="vf-lux-news__hanger"/);
});

test('mobile Black Friday uses the approved HD banner, clean layout and a sign below the hero', () => {
  assert.doesNotMatch(hero, /srcSet="\/images\/valeria-premium-hero-mobile.webp"/);
  assert.match(hero, /src="https:\/\/d2ol7oe51mr4n9\.cloudfront\.net\/[^"]+\.png"/);
  const mobile = css.slice(css.lastIndexOf('/* BLACK FRIDAY MÓVIL — portada inmersiva restaurada.'));
  assert.match(mobile, /@media \(max-width: 767px\)/);
  assert.match(mobile, /min-height: max\(920px, 112svh\)/);
  assert.match(mobile, /height: clamp\(340px, 51svh, 475px\)/);
  assert.match(mobile, /background-size: 200% auto/);
  assert.match(mobile, /background-position: right 46%/);
  assert.match(mobile, /object-fit: cover/);
  assert.match(hero, /vf-lux-hero__mobile-promo/);
  assert.match(mobile, /flex-direction: column;/);
  assert.match(mobile, /\.vf-noir-home-page > \.vf-lux-news \{margin: 4px auto 0;/);
});

test('desktop image feathers into the solid burgundy background without bottom hard cut', () => {
  const finalDesktop = css.slice(css.lastIndexOf('/* FINAL DESKTOP HERO:'));
  assert.match(finalDesktop, /mask-image:linear-gradient\(90deg,transparent 0%,rgba\(0,0,0,\.38\) 18%/);
  assert.match(finalDesktop, /linear-gradient\(0deg,rgba\(18,5,12,\.42\) 0%/);
});
