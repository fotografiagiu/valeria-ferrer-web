#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  DEFAULT_OG_IMAGE,
  SEO_INJECT_ROUTES,
  routeToDistRelativePath,
} from './seo-routes.mjs';
import { STATIC_BODY_BY_PATH } from './seo-static-body.mjs';

const DIST_DIR = path.join(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function replaceTitle(html, title) {
  return html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceMetaName(html, name, content) {
  const tag = `<meta name="${name}" content="${escapeAttr(content)}" />`;
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<meta charset="UTF-8"\s*\/?>/i, (match) => `${match}\n    ${tag}`);
}

function replaceMetaProperty(html, property, content) {
  const tag = `<meta property="${property}" content="${escapeAttr(content)}" />`;
  const re = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html;
}

function replaceCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`;
  return html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, tag);
}

function injectStaticBody(html, routePath) {
  const bodyHtml = STATIC_BODY_BY_PATH[routePath];
  if (!bodyHtml) return html;
  return html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${bodyHtml}</div>`);
}

function injectSeo(html, route) {
  const canonical = route.canonical;
  let out = html;
  out = replaceTitle(out, route.title);
  out = replaceMetaName(out, 'description', route.description);
  out = replaceCanonical(out, canonical);
  out = replaceMetaProperty(out, 'og:title', route.title);
  out = replaceMetaProperty(out, 'og:description', route.description);
  out = replaceMetaProperty(out, 'og:url', canonical);
  out = replaceMetaProperty(out, 'og:image', route.ogImage || DEFAULT_OG_IMAGE);
  out = replaceMetaName(out, 'twitter:title', route.title);
  out = replaceMetaName(out, 'twitter:description', route.description);
  out = replaceMetaName(out, 'twitter:image', route.ogImage || DEFAULT_OG_IMAGE);
  out = injectStaticBody(out, route.path);
  return out;
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('❌ dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const written = [];

  for (const route of SEO_INJECT_ROUTES) {
    const html = injectSeo(template, route);
    const relativePath = routeToDistRelativePath(route.path);
    const outputPath = path.join(DIST_DIR, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    written.push(relativePath);
    console.log(`✅ ${route.path} → dist/${relativePath}`);
  }

  const staticBodyRoutes = SEO_INJECT_ROUTES.filter((r) => STATIC_BODY_BY_PATH[r.path]).map(
    (r) => r.path
  );
  if (staticBodyRoutes.length) {
    console.log(`📄 Static body: ${staticBodyRoutes.join(', ')}`);
  }

  console.log(`\n🎯 SEO injection complete: ${written.length} routes (home unchanged)`);
}

main();
