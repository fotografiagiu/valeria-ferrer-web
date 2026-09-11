#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  APP_CATALOG_RELATIVE_PATH,
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

const APP_CATALOG_ALLOWED_KEYS = new Set([
  'slug',
  'name',
  'active',
  'vip',
  'rateExceptions',
  'coverImageUrl',
  'images',
]);
const APP_CATALOG_FORBIDDEN_KEYS = [
  'description',
  'essence',
  'profileImageUrl',
  'profileUrl',
  'age',
  'height',
  'weight',
];

const appCatalogPath = path.join(PUBLIC_DIR, APP_CATALOG_RELATIVE_PATH);
if (!fs.existsSync(appCatalogPath)) {
  fail('app-catalog.json not found');
} else {
  const catalog = readJson(appCatalogPath);
  if (!Array.isArray(catalog.models)) {
    fail('app-catalog.json models is not an array');
  } else {
    if (typeof catalog.catalogVersion !== 'string' || !catalog.catalogVersion) {
      fail('app-catalog.json missing catalogVersion');
    } else {
      pass('app-catalog.json includes catalogVersion');
    }

    const catalogSlugs = catalog.models.map((model) => model.slug);
    const expectedSlugs = models.map((model) => model.slug);

    if (catalog.models.length !== models.length) {
      fail(
        `app-catalog models=${catalog.models.length}, expected ${models.length} (including inactive)`
      );
    } else {
      pass(`app-catalog includes all ${models.length} models (active and inactive)`);
    }

    if (JSON.stringify(catalogSlugs) !== JSON.stringify(expectedSlugs)) {
      fail('app-catalog slug order does not match data/models.json');
    } else {
      pass('app-catalog slug order matches data/models.json');
    }

    const inactiveInSource = models.filter((model) => model.active === false);
    const inactiveInCatalog = catalog.models.filter((model) => model.active === false);
    if (inactiveInSource.length === 0) {
      fail('models.json unexpectedly has zero inactive models');
    } else if (inactiveInCatalog.length !== inactiveInSource.length) {
      fail(
        `app-catalog inactive=${inactiveInCatalog.length}, expected ${inactiveInSource.length}`
      );
    } else {
      pass(`app-catalog keeps ${inactiveInCatalog.length} inactive models with active:false`);
    }

    for (const slug of ['kim', 'tiffany', 'paula-vip', 'sara']) {
      const entry = catalog.models.find((model) => model.slug === slug);
      if (!entry) {
        fail(`${slug} missing from app-catalog.json`);
        continue;
      }
      if (typeof entry.slug !== 'string' || typeof entry.name !== 'string' || typeof entry.active !== 'boolean') {
        fail(`${slug} is missing slug/name/active in app-catalog.json`);
      }
    }

    const kim = catalog.models.find((model) => model.slug === 'kim');
    if (kim && kim.active !== false) {
      fail('Kim must be published as active:false in app-catalog.json');
    } else if (kim) {
      pass('Kim is present in app-catalog with active:false');
    }

    const paula = catalog.models.find((model) => model.slug === 'paula-vip');
    if (!paula?.rateExceptions?.length) {
      fail('Paula VIP is missing rateExceptions in app-catalog.json');
    } else {
      const hour = paula.rateExceptions.find((item) => item.serviceTypeId === '60min');
      if (!hour || hour.totalCents !== 20000) {
        fail('Paula VIP 60min exception is missing or not 20000 cents');
      } else {
        pass('Paula VIP rateExceptions include 60min at 20000 cents');
      }
    }

    let leakedFields = 0;
    let missingMedia = 0;
    for (const entry of catalog.models) {
      for (const key of Object.keys(entry)) {
        if (!APP_CATALOG_ALLOWED_KEYS.has(key) || APP_CATALOG_FORBIDDEN_KEYS.includes(key)) {
          leakedFields += 1;
          fail(`app-catalog ${entry.slug} includes unexpected field ${key}`);
        }
      }
      if (entry.coverImageUrl != null && typeof entry.coverImageUrl !== 'string') {
        missingMedia += 1;
        fail(`app-catalog ${entry.slug} has invalid coverImageUrl`);
      }
      if (!Array.isArray(entry.images)) {
        missingMedia += 1;
        fail(`app-catalog ${entry.slug} is missing images[]`);
      } else if (entry.images.some((img) => typeof img !== 'string' || !img.startsWith('/'))) {
        missingMedia += 1;
        fail(`app-catalog ${entry.slug} has invalid images[] paths`);
      }
      if (entry.active !== false && !entry.coverImageUrl) {
        missingMedia += 1;
        fail(`app-catalog active model ${entry.slug} missing coverImageUrl`);
      }
    }
    if (leakedFields === 0) {
      pass('app-catalog.json only exposes operational fields');
    }
    if (missingMedia === 0) {
      pass('app-catalog.json includes coverImageUrl + images[] for operational sync');
    }
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
