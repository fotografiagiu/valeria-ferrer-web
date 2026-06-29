#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  HOME_SEO_EXPECTED,
  SEO_INJECT_ROUTES,
  routeToDistRelativePath,
} from './seo-routes.mjs';
import { STATIC_BODY_CHECKS } from './seo-static-body.mjs';

const DIST_DIR = path.join(process.cwd(), 'dist');
const errors = [];
const checks = [];

function pass(message) {
  checks.push({ ok: true, message });
}

function fail(message) {
  errors.push(message);
  checks.push({ ok: false, message });
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

function extractMetaName(html, name) {
  const match = html.match(new RegExp(`<meta\\s+name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

function extractMetaProperty(html, property) {
  const match = html.match(
    new RegExp(`<meta\\s+property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
  );
  return match ? match[1] : '';
}

for (const route of SEO_INJECT_ROUTES) {
  const relativePath = routeToDistRelativePath(route.path);
  const filePath = path.join(DIST_DIR, relativePath);
  const label = route.path;

  if (!fs.existsSync(filePath)) {
    fail(`${label}: missing dist/${relativePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const title = extractTitle(html);
  const canonical = extractCanonical(html);
  const description = extractMetaName(html, 'description');
  const ogTitle = extractMetaProperty(html, 'og:title');
  const ogUrl = extractMetaProperty(html, 'og:url');

  if (title !== route.title) {
    fail(`${label}: title="${title}" expected "${route.title}"`);
  } else {
    pass(`${label}: title OK`);
  }

  if (canonical !== route.canonical) {
    fail(`${label}: canonical="${canonical}" expected "${route.canonical}"`);
  } else {
    pass(`${label}: canonical OK`);
  }

  if (description !== route.description) {
    fail(`${label}: description mismatch`);
  } else {
    pass(`${label}: description OK`);
  }

  if (ogTitle !== route.title) {
    fail(`${label}: og:title mismatch`);
  } else {
    pass(`${label}: og:title OK`);
  }

  if (ogUrl !== route.canonical) {
    fail(`${label}: og:url="${ogUrl}" expected "${route.canonical}"`);
  } else {
    pass(`${label}: og:url OK`);
  }

  if (canonical === HOME_SEO_EXPECTED.canonical) {
    fail(`${label}: canonical must not point to home`);
  }

  const bodyChecks = STATIC_BODY_CHECKS[route.path];
  if (bodyChecks) {
    for (const check of bodyChecks) {
      if (check.pattern.test(html)) {
        pass(`${label}: static body ${check.label} OK`);
      } else {
        fail(`${label}: static body ${check.label} missing`);
      }
    }
  }
}

const homePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(homePath)) {
  fail('dist/index.html not found');
} else {
  const homeHtml = fs.readFileSync(homePath, 'utf8');
  const homeTitle = extractTitle(homeHtml);
  const homeCanonical = extractCanonical(homeHtml);
  const homeDescription = extractMetaName(homeHtml, 'description');

  if (homeTitle !== HOME_SEO_EXPECTED.title) {
    fail(`home: title="${homeTitle}" expected "${HOME_SEO_EXPECTED.title}"`);
  } else {
    pass('home: title OK');
  }

  if (homeCanonical !== HOME_SEO_EXPECTED.canonical) {
    fail(`home: canonical="${homeCanonical}" expected "${HOME_SEO_EXPECTED.canonical}"`);
  } else {
    pass('home: canonical OK');
  }

  if (homeDescription !== HOME_SEO_EXPECTED.description) {
    fail('home: description mismatch');
  } else {
    pass('home: description OK');
  }

  if (/<main class="static-seo-escorts-valencia"/i.test(homeHtml)) {
    fail('home: must not contain escorts-valencia static body');
  } else {
    pass('home: no static body bleed OK');
  }
}

const escortsInjectedPath = path.join(DIST_DIR, 'escorts-valencia/index.html');
const escortsInjectedTitle = 'Escorts Valencia | Fotos reales y perfiles actualizados';
if (fs.existsSync(escortsInjectedPath)) {
  const escortsHtml = fs.readFileSync(escortsInjectedPath, 'utf8');
  if (/<main class="static-seo-escorts-valencia"/i.test(escortsHtml)) {
    fail('/escorts-valencia: must not contain static SEO body');
  } else {
    pass('/escorts-valencia: no static SEO body OK');
  }
  if (extractTitle(escortsHtml) === escortsInjectedTitle) {
    fail('/escorts-valencia: must not use injected head SEO title');
  } else {
    pass('/escorts-valencia: no injected head SEO OK');
  }
} else {
  pass('/escorts-valencia: no injected dist HTML (SPA shell via rewrite) OK');
}

console.log('\n=== SEO Injection Verification ===\n');
for (const check of checks) {
  console.log(`${check.ok ? '✅' : '❌'} ${check.message}`);
}

if (errors.length) {
  console.log(`\n❌ Verification failed with ${errors.length} issue(s)`);
  process.exit(1);
}

console.log('\n✅ All SEO injection checks passed');
process.exit(0);
