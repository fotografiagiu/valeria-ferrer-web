#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { MODELS_PATH, readJson } from './lib/seo-assets.mjs';

const site = 'https://www.valeriaferrer.com';
const redirects = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')).redirects || [];
const all = readJson(MODELS_PATH);
const active = new Set(all.filter(m => m.active !== false).map(m => m.slug));
const existing = new Set();
const errors = [];
const inactiveTargets = new Map();

for (const redirect of redirects) {
  const source = redirect.source;
  const destination = redirect.destination;
  if (existing.has(source)) errors.push('Duplicate redirect: ' + source);
  existing.add(source);
  if (destination === site + source) errors.push('Self redirect: ' + source);
  // Parameterized redirect patterns are not concrete model IDs.
  const match = /^https:\/\/www\.valeriaferrer\.com\/models\/([a-z0-9_-]+)$/.exec(destination);
  if (match && !active.has(match[1])) {
    inactiveTargets.set(match[1], (inactiveTargets.get(match[1]) || 0) + 1);
  }
}
console.log('Redirect audit: ' + redirects.length + ' rules, ' + existing.size + ' unique sources.');
if (inactiveTargets.size) {
  console.warn(
    'SEO WARNING: ' +
    [...inactiveTargets.values()].reduce((sum,n)=>sum+n,0) +
    ' historical redirects lead to non-active profiles (' +
    [...inactiveTargets.keys()].join(', ') +
    '). Review affected URL traffic in Search Console before changing destinations.'
  );
}
if (errors.length) {
  errors.forEach(e=>console.error('REDIRECT ERROR: ' + e));
  process.exit(1);
}
console.log('No exact duplicate or self redirect rules.');
