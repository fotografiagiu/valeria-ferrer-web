#!/usr/bin/env node

import fs from 'fs';
import http from 'http';
import path from 'path';
import { chromium } from 'playwright';
import { PRERENDER_ROUTES, routeToDistRelativePath } from './prerender-routes.mjs';

const DIST_DIR = path.join(process.cwd(), 'dist');
const DEFAULT_PORT = Number(process.env.PRERENDER_PORT || 0);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function resolveDistFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  let relative = decoded.replace(/^\/+/, '');

  if (!relative || relative.endsWith('/')) {
    relative = `${relative}index.html`.replace(/^\//, '');
  }

  let candidate = path.join(DIST_DIR, relative);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  if (!path.extname(relative)) {
    candidate = path.join(DIST_DIR, relative, 'index.html');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return path.join(DIST_DIR, 'index.html');
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const filePath = resolveDistFile(req.url || '/');
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType(filePath) });
        res.end(data);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Prerender static server error: ${error.message}`);
      }
    });

    server.on('error', reject);
    server.listen(DEFAULT_PORT, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : DEFAULT_PORT;
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function waitForRouteReady(page, route) {
  await page.waitForFunction(
    ({ expectedTitle, expectedCanonical }) => {
      const title = document.title || '';
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const hasH1 = !!document.querySelector('h1');
      const bodyText = document.body?.textContent || '';
      const html = document.documentElement?.outerHTML || '';

      return (
        title === expectedTitle &&
        canonical === expectedCanonical &&
        hasH1 &&
        !bodyText.includes('Cargando…') &&
        !html.includes('/models/undefined')
      );
    },
    { expectedTitle: route.title, expectedCanonical: route.canonical },
    { timeout: route.timeoutMs }
  );
}

function writePrerenderedHtml(route, html) {
  const relativePath = routeToDistRelativePath(route.path);
  const outputPath = path.join(DIST_DIR, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  return outputPath;
}

async function prerenderRoute(page, baseUrl, route) {
  const url = `${baseUrl}${route.path === '/' ? '/' : route.path}`;
  console.log(`🔄 Prerender ${route.path}`);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: route.timeoutMs });
  await waitForRouteReady(page, route);

  const html = await page.content();
  if (html.includes('/models/undefined')) {
    throw new Error(`Route ${route.path} contains /models/undefined in HTML`);
  }

  const outputPath = writePrerenderedHtml(route, html);
  console.log(`✅ ${route.path} → ${path.relative(process.cwd(), outputPath)}`);
  return outputPath;
}

async function main() {
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error('❌ dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const { server, baseUrl } = await startStaticServer();
  console.log(`🌐 Static server at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const written = [];

  try {
    for (const route of PRERENDER_ROUTES) {
      written.push(await prerenderRoute(page, baseUrl, route));
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  console.log(`\n🎯 Prerender complete: ${written.length} routes`);
}

main().catch((error) => {
  console.error(`\n❌ Prerender failed: ${error.message}`);
  process.exit(1);
});
