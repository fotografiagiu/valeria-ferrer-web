#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  BLOG_PATH,
  MODELS_PATH,
  PUBLIC_DIR,
  SITE_ORIGIN,
  SITEMAP_PATH,
  collectModelImagePaths,
  escapeXml,
  filterExistingImages,
  readJson,
  toAbsoluteUrl,
  todayIsoDate,
  writeSeoOutputFile,
} from './lib/seo-assets.mjs';

const lastmod = todayIsoDate();

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/models', priority: '0.9', changefreq: 'daily' },
  { path: '/escorts-valencia', priority: '0.88', changefreq: 'weekly' },
  { path: '/escorts-de-lujo-valencia', priority: '0.88', changefreq: 'weekly' },
  { path: '/fees', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/novedades', priority: '0.8', changefreq: 'weekly' },
  { path: '/vip', priority: '0.85', changefreq: 'weekly' },
  { path: '/nuevas', priority: '0.85', changefreq: 'weekly' },
  { path: '/colombianas', priority: '0.85', changefreq: 'weekly' },
  { path: '/espanolas', priority: '0.85', changefreq: 'weekly' },
  { path: '/jovenes', priority: '0.85', changefreq: 'weekly' },
  { path: '/maduras', priority: '0.85', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/booking', priority: '0.8', changefreq: 'monthly' },
  { path: '/casting', priority: '0.6', changefreq: 'monthly' },
];

function readPreviousSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) return new Set();
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = new Set();
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.add(match[1]);
  }
  return urls;
}

function readPreviousImageLocs() {
  if (!fs.existsSync(SITEMAP_PATH)) return new Set();
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = new Set();
  const regex = /<image:loc>(.*?)<\/image:loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.add(match[1]);
  }
  return urls;
}

function buildUrlEntry({ loc, priority, changefreq, images = [] }) {
  const imageBlocks = images
    .map(
      (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
    </image:image>`
    )
    .join('\n');

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${images.length ? `\n${imageBlocks}` : ''}
  </url>`;
}

function buildModelImages(model) {
  const { valid, missing } = filterExistingImages(
    collectModelImagePaths(model),
    `${model.slug}`
  );

  return {
    images: valid.map((relativePath, index) => ({
      loc: toAbsoluteUrl(relativePath),
      title:
        index === 0
          ? `${model.name} - Modelo Valeria Ferrer Valencia`
          : `${model.name} Galería ${index} - Valeria Ferrer`,
    })),
    missing,
  };
}

function buildBlogImages(post) {
  if (!post.featuredImage) return { images: [], missing: [] };

  const { valid, missing } = filterExistingImages([post.featuredImage], post.id);
  return {
    images: valid.map((relativePath) => ({
      loc: toAbsoluteUrl(relativePath),
      title: post.title,
    })),
    missing,
  };
}

function generateSitemap(models, blogPosts) {
  const entries = [];

  for (const page of STATIC_PAGES) {
    entries.push(
      buildUrlEntry({
        loc: `${SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`,
        priority: page.priority,
        changefreq: page.changefreq,
      })
    );
  }

  for (const model of models) {
    const { images } = buildModelImages(model);
    entries.push(
      buildUrlEntry({
        loc: `${SITE_ORIGIN}/models/${model.slug}`,
        priority: '0.9',
        changefreq: 'weekly',
        images,
      })
    );
  }

  for (const post of blogPosts) {
    const { images } = buildBlogImages(post);
    entries.push(
      buildUrlEntry({
        loc: `${SITE_ORIGIN}/blog/${post.id}`,
        priority: '0.9',
        changefreq: 'monthly',
        images,
      })
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n\n')}
</urlset>
`;
}

const previousUrls = readPreviousSitemapUrls();
const previousImages = readPreviousImageLocs();
const models = readJson(MODELS_PATH).filter((model) => model.active !== false);
const blogPosts = readJson(BLOG_PATH);
const sitemapXml = generateSitemap(models, blogPosts);

writeSeoOutputFile('sitemap.xml', sitemapXml);

const newUrls = new Set();
const urlRegex = /<loc>(.*?)<\/loc>/g;
let match;
while ((match = urlRegex.exec(sitemapXml)) !== null) {
  newUrls.add(match[1]);
}

const newImages = new Set();
const imageRegex = /<image:loc>(.*?)<\/image:loc>/g;
while ((match = imageRegex.exec(sitemapXml)) !== null) {
  newImages.add(match[1]);
}

const removedUrls = [...previousUrls].filter((url) => !newUrls.has(url));
const addedUrls = [...newUrls].filter((url) => !previousUrls.has(url));
const removedImages = [...previousImages].filter((url) => !newImages.has(url));
const addedImages = [...newImages].filter((url) => !previousImages.has(url));

console.log(`✅ Generated sitemap: ${SITEMAP_PATH}`);
console.log(`📄 URLs: ${newUrls.size} (removed ${removedUrls.length}, added ${addedUrls.length})`);
console.log(`🖼️  image:loc: ${newImages.size} (removed ${removedImages.length}, added ${addedImages.length})`);

if (removedUrls.length) {
  console.log('\nURLs removed:');
  removedUrls.forEach((url) => console.log(`  - ${url}`));
}

if (addedUrls.length) {
  console.log('\nURLs added:');
  addedUrls.forEach((url) => console.log(`  + ${url}`));
}

if (removedImages.length) {
  console.log('\nimage:loc removed:');
  removedImages.forEach((url) => console.log(`  - ${url}`));
}

if (addedImages.length) {
  console.log('\nimage:loc added/corrected:');
  addedImages.forEach((url) => console.log(`  + ${url}`));
}

export { removedUrls, addedUrls, removedImages, addedImages, newUrls, newImages };
