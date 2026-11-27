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
  assert.match(hero, /d2ol7oe51mr4n9\.cloudfront\.net\/[^'"\s]+\.png/);
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

test('Black Friday 2026 uses approved desktop + mobile artwork without cropping, date-gated', () => {
  assert.match(hero, /isBlackFridayDayInMadrid/);
  assert.match(hero, /2026-11-27/);
  assert.match(hero, /3927befb-4a3c-4d2c-922f-cab0b747bd7f\.png/);
  assert.match(hero, /3a31abcc-04bb-4a95-9ed7-04f4a120d851\.png/);
  assert.match(hero, /srcSet=\{BF_2026_MOBILE\}/);
  assert.match(hero, /blackFridayLive \? BF_2026_DESKTOP : EDITORIAL_DESKTOP/);
  assert.match(hero, /vf-lux-hero--bf-2026/);
  assert.match(hero, /<h1 id="vf-lux-hero-title">Escorts en Valencia<\/h1>/);
  assert.match(hero, /menciona la promoción al llegar/);
  assert.match(hero, /\/booking/);
  assert.doesNotMatch(hero, /vf-lux-hero__mobile-promo/);
  const campaign = css.slice(css.lastIndexOf('/* BLACK FRIDAY 27 NOV 2026'));
  assert.match(campaign, /\.vf-lux-hero--bf-2026/);
  assert.match(campaign, /object-fit: contain/);
  assert.match(campaign, /mask-image: none/);
  assert.match(campaign, /@media \(max-width: 767px\)/);
  assert.match(campaign, /height: auto/);
});

test('desktop image feathers into the solid burgundy background without bottom hard cut', () => {
  const finalDesktop = css.slice(css.lastIndexOf('/* FINAL DESKTOP HERO:'));
  assert.match(finalDesktop, /mask-image:linear-gradient\(90deg,transparent 0%,rgba\(0,0,0,\.38\) 18%/);
  assert.match(finalDesktop, /linear-gradient\(0deg,rgba\(18,5,12,\.42\) 0%/);
});
