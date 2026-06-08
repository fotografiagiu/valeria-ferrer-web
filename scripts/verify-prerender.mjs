#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { PRERENDER_ROUTES, routeToDistRelativePath } from './prerender-routes.mjs';

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

for (const route of PRERENDER_ROUTES) {
  const relativePath = routeToDistRelativePath(route.path);
  const filePath = path.join(DIST_DIR, relativePath);
  const label = route.path;

  if (!fs.existsSync(filePath)) {
    fail(`${label}: missing prerender file ${relativePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const title = extractTitle(html);
  const canonical = extractCanonical(html);
  const hasH1 = /<h1[\s>]/i.test(html);

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

  if (!hasH1) {
    fail(`${label}: missing h1`);
  } else {
    pass(`${label}: h1 present`);
  }

  if (html.includes('Cargando…')) {
    fail(`${label}: contains loading fallback`);
  }

  if (html.includes('/models/undefined')) {
    fail(`${label}: contains /models/undefined`);
  }
}

if (fs.existsSync(DIST_DIR)) {
  const undefinedMatches = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.name.endsWith('.html')) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/models/undefined')) {
        undefinedMatches.push(path.relative(DIST_DIR, fullPath));
      }
    }
  };
  walk(DIST_DIR);

  if (undefinedMatches.length) {
    fail(`dist HTML with /models/undefined: ${undefinedMatches.join(', ')}`);
  } else {
    pass('dist HTML /models/undefined = 0');
  }
} else {
  fail('dist/ not found');
}

console.log('\n=== Prerender Verification ===\n');
for (const check of checks) {
  console.log(`${check.ok ? '✅' : '❌'} ${check.message}`);
}

if (errors.length) {
  console.log(`\n❌ Verification failed with ${errors.length} issue(s)`);
  process.exit(1);
}

console.log('\n✅ All prerender checks passed');
process.exit(0);
