#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  ARCHIVE_DIR,
  MODELS_PATH,
  PUBLIC_DIR,
  SITE_ORIGIN,
  SITEMAP_PATH,
  STRUCTURED_DATA_DIR,
  ORPHAN_STRUCTURED_DATA,
  publicPathFromUrl,
  readJson,
} from './lib/seo-assets.mjs';

const errors = [];
const checks = [];

function pass(message) {
  checks.push({ ok: true, message });
}

function fail(message) {
  errors.push(message);
  checks.push({ ok: false, message });
}

function verifyFileExistsFromUrl(url, context) {
  const publicPath = publicPathFromUrl(url);
  if (!publicPath) {
    fail(`${context}: URL outside site origin: ${url}`);
    return;
  }
  const diskPath = path.join(PUBLIC_DIR, publicPath.slice(1));
  if (!fs.existsSync(diskPath)) {
    fail(`${context}: missing file for ${url}`);
  }
}

const IMAGE_PATH_PREFIXES = ['/chicas/', '/chicas-optimized/', '/blog/', '/og-image'];

function isImageAssetUrl(url) {
  if (!url.startsWith(`${SITE_ORIGIN}/`)) return false;
  const publicPath = publicPathFromUrl(url);
  if (!publicPath) return false;
  return IMAGE_PATH_PREFIXES.some((prefix) => publicPath.startsWith(prefix));
}

function collectStructuredDataImageUrls(json) {
  const urls = [];

  if (Array.isArray(json.image)) {
    urls.push(...json.image.filter(isImageAssetUrl));
  } else if (typeof json.image === 'string' && isImageAssetUrl(json.image)) {
    urls.push(json.image);
  }

  if (Array.isArray(json.itemListElement)) {
    for (const entry of json.itemListElement) {
      const image = entry?.item?.image;
      if (typeof image === 'string' && isImageAssetUrl(image)) {
        urls.push(image);
      }
    }
  }

  return urls;
}

const models = readJson(MODELS_PATH);
const activeSlugs = new Set(models.map((model) => model.slug));

if (!fs.existsSync(SITEMAP_PATH)) {
  fail('sitemap.xml not found');
} else {
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const imageLocs = [...sitemap.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map((match) => match[1]);

  let brokenSitemapImages = 0;
  for (const imageUrl of imageLocs) {
    const publicPath = publicPathFromUrl(imageUrl);
    if (!publicPath || !fs.existsSync(path.join(PUBLIC_DIR, publicPath.slice(1)))) {
      brokenSitemapImages += 1;
      fail(`Broken sitemap image:loc: ${imageUrl}`);
    }
  }

  if (brokenSitemapImages === 0) {
    pass(`sitemap image:loc broken = 0 (${imageLocs.length} checked)`);
  }

  const nonWww = locs.filter((url) => !url.startsWith(`${SITE_ORIGIN}/`) && !url.endsWith(SITE_ORIGIN));
  if (nonWww.length) {
    fail(`Non-www sitemap URLs found: ${nonWww.join(', ')}`);
  } else {
    pass('All sitemap page URLs use https://www.valeriaferrer.com');
  }

  const typoMatches = [...sitemap.matchAll(/model-agencia/gi)];
  if (typoMatches.length) {
    fail(`Found model-agencia typo ${typoMatches.length} time(s) in sitemap`);
  } else {
    pass('No model-agencia typos in sitemap');
  }
}

const indexPath = path.join(STRUCTURED_DATA_DIR, 'models-index.json');
if (!fs.existsSync(indexPath)) {
  fail('models-index.json not found');
} else {
  const index = readJson(indexPath);
  if (index.numberOfItems !== models.length) {
    fail(`models-index numberOfItems=${index.numberOfItems}, expected ${models.length}`);
  } else {
    pass(`models-index numberOfItems = ${models.length}`);
  }

  const indexSlugs = index.itemListElement.map((item) => {
    const url = item.item.url;
    return url.replace(`${SITE_ORIGIN}/models/`, '');
  });

  const expectedOrder = models.map((model) => model.slug);
  if (JSON.stringify(indexSlugs) !== JSON.stringify(expectedOrder)) {
    fail('models-index order does not match data/models.json');
  } else {
    pass('models-index order matches data/models.json');
  }

  if (!indexSlugs.includes('kim')) {
    fail('Kim missing from models-index');
  } else {
    pass('Kim appears in models-index');
  }

  for (const slug of ['luna', 'naty', 'flor']) {
    const filePath = path.join(STRUCTURED_DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      fail(`${slug}.json missing`);
      continue;
    }
    const json = readJson(filePath);
    const imageUrls = Array.isArray(json.image) ? json.image : [json.image];
    const usesOptimized = imageUrls.every((url) => url.includes('/chicas-optimized/'));
    if (!usesOptimized) {
      fail(`${slug} structured-data does not use /chicas-optimized/ routes`);
    } else {
      pass(`${slug} uses current /chicas-optimized/ routes`);
    }
  }
}

let brokenStructuredImages = 0;
const structuredFiles = fs
  .readdirSync(STRUCTURED_DATA_DIR)
  .filter((file) => file.endsWith('.json'));

for (const file of structuredFiles) {
  const filePath = path.join(STRUCTURED_DATA_DIR, file);
  const json = readJson(filePath);
  const urls = collectStructuredDataImageUrls(json);
  for (const url of urls) {
    verifyFileExistsFromUrl(url, file);
    if (!url.startsWith(`${SITE_ORIGIN}/`)) {
      fail(`${file}: non-www image URL ${url}`);
    }
    if (/model-agencia/i.test(url)) {
      fail(`${file}: model-agencia typo in ${url}`);
    }
  }
}

brokenStructuredImages = errors.filter(
  (message) => message.includes('missing file') && !message.includes('sitemap')
).length;
if (brokenStructuredImages === 0 && fs.existsSync(STRUCTURED_DATA_DIR)) {
  pass('structured-data broken images = 0');
}

const activeJsonFiles = structuredFiles.filter((file) => file !== 'models-index.json');
const unexpectedActive = activeJsonFiles
  .map((file) => file.replace(/\.json$/, ''))
  .filter((slug) => !activeSlugs.has(slug));

if (fs.existsSync(path.join(STRUCTURED_DATA_DIR, '_archive'))) {
  fail('public/structured-data/_archive must not exist (orphans belong outside public/)');
}

if (unexpectedActive.length) {
  fail(`Active orphan JSON in public/structured-data: ${unexpectedActive.join(', ')}`);
} else {
  pass('No orphan JSON active in public/structured-data');
}

for (const orphan of ORPHAN_STRUCTURED_DATA) {
  const activePath = path.join(STRUCTURED_DATA_DIR, `${orphan}.json`);
  const archivePath = path.join(ARCHIVE_DIR, `${orphan}.json`);
  if (fs.existsSync(activePath)) {
    fail(`Orphan still active: ${orphan}.json`);
  } else if (fs.existsSync(archivePath)) {
    pass(`Orphan archived: ${orphan}.json`);
  }
}

console.log('\n=== SEO Assets Verification ===\n');
for (const check of checks) {
  console.log(`${check.ok ? '✅' : '❌'} ${check.message}`);
}

if (errors.length) {
  console.log(`\n❌ Verification failed with ${errors.length} issue(s)`);
  process.exit(1);
}

console.log('\n✅ All verification checks passed');
process.exit(0);
