#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { BLOG_PATH, MODELS_PATH, SITE_ORIGIN, readJson } from './lib/seo-assets.mjs';

const file = path.join(process.cwd(), 'dist', 'sitemap.xml');
if (!fs.existsSync(file)) throw new Error('Missing dist/sitemap.xml');
const xml = fs.readFileSync(file, 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const urlBlocks = [...xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map(match => match[1]);
const active = readJson(MODELS_PATH).filter(m => m.active !== false);
const allModels = readJson(MODELS_PATH);
const blog = readJson(BLOG_PATH);
const staticCount = 16;
const expectedCount = staticCount + active.length + blog.length;
const errors = [];
if (urlBlocks.length !== expectedCount) errors.push(`Expected ${expectedCount} URL blocks, got ${urlBlocks.length}`);
if (new Set(locs).size !== locs.length) errors.push('Duplicate sitemap page URLs');
if (/<lastmod>|<changefreq>|<priority>/.test(xml)) errors.push('Unverified dates or ignored sitemap priority/changefreq present');
if (locs.some(loc => !loc.startsWith(SITE_ORIGIN + '/'))) errors.push('Non-canonical domain in page loc');
for (const model of active) {
  const url = `${SITE_ORIGIN}/models/${model.slug}`;
  if (!locs.includes(url)) errors.push(`Missing active model: ${model.slug}`);
}
for (const model of allModels.filter(m => m.active === false)) {
  if (locs.includes(`${SITE_ORIGIN}/models/${model.slug}`)) errors.push(`Inactive model indexed: ${model.slug}`);
}
if (!locs.includes(SITE_ORIGIN + '/')) errors.push('Homepage missing');
if (!locs.includes(SITE_ORIGIN + '/models')) errors.push('Model directory missing');
if (errors.length) {
  for (const error of errors) console.error('SEO sitemap error: ' + error);
  process.exit(1);
}
console.log(`Sitemap verified: ${urlBlocks.length} page URLs, ${active.length} active profiles, no bogus lastmod dates.`);
