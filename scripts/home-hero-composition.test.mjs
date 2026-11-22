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

test('mobile Black Friday follows approved layout: one model, visible original promo and readable H1', () => {
  assert.doesNotMatch(hero, /srcSet="\/images\/valeria-premium-hero-mobile.webp"/);
  assert.match(hero, /src="https:\/\/d2ol7oe51mr4n9\.cloudfront\.net\/[^"]+\.png"/);
  const mobile = css.slice(css.lastIndexOf('/* BLACK FRIDAY MÓVIL — composición aprobada de la derecha.'));
  assert.match(mobile, /@media \(max-width: 767px\)/);
  assert.match(mobile, /min-height: max\(750px, 100svh\)/);
  assert.match(mobile, /height: clamp\(430px, 64svh, 565px\)/);
  assert.match(mobile, /object-position: left center/);
  assert.match(mobile, /background-size: auto 100%/);
  assert.match(mobile, /width: 62%/);
  assert.match(mobile, /flex-direction: row/);
  assert.match(hero, /vf-lux-hero__mobile-promo/);
  assert.match(mobile, /\.vf-noir-home-page > \.vf-lux-news \{\s*margin: 12px auto 0;/);
});

test('desktop image feathers into the solid burgundy background without bottom hard cut', () => {
  const finalDesktop = css.slice(css.lastIndexOf('/* FINAL DESKTOP HERO:'));
  assert.match(finalDesktop, /mask-image:linear-gradient\(90deg,transparent 0%,rgba\(0,0,0,\.38\) 18%/);
  assert.match(finalDesktop, /linear-gradient\(0deg,rgba\(18,5,12,\.42\) 0%/);
});
