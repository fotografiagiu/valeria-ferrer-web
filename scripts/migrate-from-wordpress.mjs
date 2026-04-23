/**
 * Migra fichas desde WordPress REST API (wp/v2/pages + wp/v2/media)
 * y descarga imágenes a public/chicas/<slug>/
 *
 * Uso: node scripts/migrate-from-wordpress.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE = 'https://www.valeriaferrer.com';
const PUBLIC_CHICAS = path.join(ROOT, 'public', 'chicas');
const OUT_JSON = path.join(ROOT, 'data', 'models.json');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fetchAllModelPages() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/wp-json/wp/v2/pages?per_page=100&page=${page}&_fields=id,slug,title,content`;
    const chunk = await fetchJson(url);
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    all.push(...chunk);
    if (chunk.length < 100) break;
    page++;
    await sleep(80);
  }
  return all.filter(
    (p) =>
      typeof p.slug === 'string' &&
      /model-agency-valencia/i.test(p.slug) &&
      p.slug.length > 15
  );
}

function extractGalleryIds(html) {
  // WP devuelve comillas como »…» o como …&#8243; (equiv. a ")
  const patterns = [
    /vc_gallery\s+images=»([\d,]+)(?:»|&#8243;)/i,
    /vc_gallery\s+images="([\d,]+)"/i,
    /images=»([\d,]+)&#8243;/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1].split(',').map((x) => parseInt(x.trim(), 10)).filter((n) => !isNaN(n));
  }
  return [];
}

function extractHeroImages(html) {
  const m = html.match(/images_holder[^]*?<\/div>\s*<\/div>/);
  if (!m) return { active: null, hover: null };
  const srcs = [...m[0].matchAll(/src=['"]([^'"]+)['"]/g)].map((x) => x[1]);
  return { active: srcs[0] || null, hover: srcs[1] || null };
}

function extractVideoUrls(html) {
  const set = new Set();
  const re = /(https?:\/\/www\.valeriaferrer\.com\/wp-content\/[^"'\s<>]+\.(mp4|webm))/gi;
  let x;
  while ((x = re.exec(html))) set.add(x[1]);
  return [...set];
}

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function cleanDisplayName(titleRendered, statsName, slug) {
  let s = (statsName || '').trim();
  if (!s) s = (titleRendered.split('|')[0] || '').trim();
  s = decodeEntities(s);
  s = s.replace(/\s*[–—]\s*Valeria Ferrer.*$/i, '').replace(/\s*-\s*Valeria Ferrer.*$/i, '').trim();
  if (!s) s = slug.split('-')[0].replace(/-/g, ' ');
  return s;
}

function parseStats(html) {
  let name = '';
  const nm = html.match(/<strong>Nombre:<\/strong>\s*([^<]+)/i);
  if (nm) name = nm[1].trim();

  let age = 0;
  const ed = html.match(/<strong>Edad:<\/strong>\s*([^<]+)<br/i);
  if (ed) {
    const n = parseInt(ed[1].replace(/\D/g, ''), 10);
    if (!isNaN(n)) age = n;
  }

  let height = 0;
  const al = html.match(/<strong>Altura:<\/strong>\s*([^<]+)<br/i);
  if (al) {
    const raw = al[1].trim().replace(',', '.');
    const f = parseFloat(raw);
    if (!isNaN(f)) height = f < 3 ? Math.round(f * 100) : Math.round(f);
  }

  let weight = 0;
  const pe1 = html.match(/<strong>Peso:\s*([^<]+)<\/strong>/i);
  if (pe1) {
    const n = parseInt(pe1[1].replace(/\D/g, ''), 10);
    if (!isNaN(n)) weight = n;
  }
  if (!weight) {
    const pe2 = html.match(/<strong>Peso:<\/strong>\s*([^<]+)<br/i);
    if (pe2) {
      const n = parseInt(pe2[1].replace(/\D/g, ''), 10);
      if (!isNaN(n)) weight = n;
    }
  }

  let nationality = '';
  const na = html.match(/<strong>Nacionalidad:<\/strong>\s*([^<\[]+)/i);
  if (na) nationality = na[1].trim().replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');

  return { name, age, height, weight, nationality };
}

function extFromUrl(u) {
  const clean = u.split('?')[0];
  const m = clean.match(/\.(jpe?g|png|webp|gif)$/i);
  return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

async function fetchMediaMap(ids) {
  const map = new Map();
  const unique = [...new Set(ids)].filter((id) => id > 0);
  for (let i = 0; i < unique.length; i += 100) {
    const batch = unique.slice(i, i + 100);
    const url = `${BASE}/wp-json/wp/v2/media?per_page=100&include=${batch.join(',')}&_fields=id,source_url`;
    const arr = await fetchJson(url);
    for (const m of arr) map.set(m.id, m.source_url);
    await sleep(60);
  }
  return map;
}

async function tryDownload(url, destFsPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(destFsPath), { recursive: true });
    fs.writeFileSync(destFsPath, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Fetching model pages from WordPress REST API…');
  const pages = await fetchAllModelPages();
  console.log('Model pages:', pages.length);

  const models = [];
  const incomplete = [];

  for (let pi = 0; pi < pages.length; pi++) {
    const p = pages[pi];
    const html = p.content?.rendered || '';
    const title = p.title?.rendered || '';
    const slug = p.slug;
    const stats = parseStats(html);
    const galleryIds = extractGalleryIds(html);
    const hero = extractHeroImages(html);
    const videoUrls = extractVideoUrls(html);

    const mediaMap = await fetchMediaMap(galleryIds);
    const galleryUrlsOrdered = galleryIds.map((id) => mediaMap.get(id)).filter(Boolean);

    let primaryUrl = hero.active || galleryUrlsOrdered[0] || null;
    let hoverUrl = hero.hover || galleryUrlsOrdered[1] || primaryUrl;
    if (primaryUrl && hoverUrl === primaryUrl && galleryUrlsOrdered.length > 1) {
      hoverUrl = galleryUrlsOrdered.find((u) => u !== primaryUrl) || hoverUrl;
    }

    const dir = path.join(PUBLIC_CHICAS, slug);
    const webBase = `/chicas/${slug}`;

    let imagePath = '';
    let hoverImagePath = '';
    const galleryPaths = [];
    const videoPaths = [];
    const issues = [];

    if (primaryUrl) {
      const ext = extFromUrl(primaryUrl);
      const local = path.join(dir, `portada${ext}`);
      if (await tryDownload(primaryUrl, local)) imagePath = `${webBase}/portada${ext}`;
      else {
        imagePath = primaryUrl;
        issues.push('portada: uso URL remota');
      }
    }

    if (hoverUrl) {
      if (hoverUrl === primaryUrl) {
        hoverImagePath = imagePath;
      } else {
        const ext = extFromUrl(hoverUrl);
        const local = path.join(dir, `hover${ext}`);
        if (await tryDownload(hoverUrl, local)) hoverImagePath = `${webBase}/hover${ext}`;
        else {
          hoverImagePath = hoverUrl;
          issues.push('hover: uso URL remota');
        }
      }
    }

    if (!imagePath && primaryUrl) imagePath = primaryUrl;
    if (!hoverImagePath) hoverImagePath = imagePath || hoverUrl || primaryUrl;

    let gi = 0;
    for (const u of galleryUrlsOrdered) {
      gi++;
      const ext = extFromUrl(u);
      const rel = `gallery/${String(gi).padStart(2, '0')}${ext}`;
      const local = path.join(dir, rel);
      if (await tryDownload(u, local)) galleryPaths.push(`${webBase}/${rel}`);
      else {
        galleryPaths.push(u);
        issues.push(`gallery ${gi}: remota`);
      }
    }

    let vi = 0;
    for (const vu of videoUrls) {
      vi++;
      const ext = path.extname(vu.split('?')[0]) || '.mp4';
      const rel = `videos/${String(vi).padStart(2, '0')}${ext}`;
      const local = path.join(dir, rel);
      if (await tryDownload(vu, local)) videoPaths.push(`${webBase}/${rel}`);
      else {
        videoPaths.push(vu);
        issues.push(`video ${vi}: remota`);
      }
    }

    if (!imagePath) {
      issues.push('sin imagen');
      incomplete.push({ slug, issues: issues.join('; ') });
      continue;
    }

    const name = cleanDisplayName(title, stats.name, slug);
    const location = /\bVIP\b/i.test(title) ? 'Valencia | VIP' : 'Valencia | Centro';

    const model = {
      id: slug,
      slug,
      name,
      age: stats.age || 0,
      height: stats.height || 0,
      nationality: stats.nationality || undefined,
      city: 'Valencia',
      location,
      image: imagePath,
      hoverImage: hoverImagePath || imagePath,
      description: '',
      bio: undefined,
      services: [],
      availability: { 'Lunes - Domingo': '24 Horas' },
      gallery: galleryPaths,
      videos: videoPaths.length ? videoPaths : undefined,
      isNew: false,
    };
    if (stats.weight > 0) model.weight = stats.weight;

    if (issues.length) incomplete.push({ slug, issues: issues.join('; ') });

    models.push(model);
    console.log(`[${pi + 1}/${pages.length}] ${slug}`);

    await sleep(30);
  }

  models.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(models, null, 2), 'utf8');
  console.log('\nWrote', OUT_JSON, '→', models.length, 'models');
  if (incomplete.length) {
    console.log('\nFichas con avisos / incompletas:', incomplete.length);
    incomplete.slice(0, 30).forEach((x) => console.log(' -', x.slug, x.issues || x.error));
    if (incomplete.length > 30) console.log(' …');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
