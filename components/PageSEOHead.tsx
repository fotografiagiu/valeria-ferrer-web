import React, { useEffect } from 'react';

export const SITE_ORIGIN = 'https://www.valeriaferrer.com';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

/** Convierte rutas /public a URL absoluta para og:image y schema. */
export function toAbsoluteMediaUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${SITE_ORIGIN}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Valores por defecto alineados con index.html / home */
export const DEFAULT_HOME_SEO = {
  title: 'Valeria Ferrer | Escorts y Acompañantes en Valencia',
  description:
    'Descubre nuestras escorts y acompañantes exclusivas en Valencia. Modelos sofisticadas para eventos, cenas y momentos especiales. Atención discreta y reserva privada.',
  canonicalUrl: SITE_ORIGIN,
  ogImage: DEFAULT_OG_IMAGE,
  type: 'website' as const,
};

interface PageSEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

function upsertMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function upsertMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function upsertCanonical(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}

function removeStructuredData(id: string) {
  document.querySelector(`#${id}`)?.remove();
}

function applyHead(meta: {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage: string;
  type: 'website' | 'article';
  structuredData?: object;
}) {
  document.title = meta.title;
  upsertMetaName('description', meta.description);
  if (meta.keywords) {
    upsertMetaName('keywords', meta.keywords);
  }

  upsertMetaProperty('og:title', meta.title);
  upsertMetaProperty('og:description', meta.description);
  upsertMetaProperty('og:type', meta.type);
  upsertMetaProperty('og:image', meta.ogImage);
  upsertMetaProperty('og:url', meta.canonicalUrl);
  upsertMetaProperty('og:site_name', 'Valeria Ferrer');

  upsertMetaName('twitter:card', 'summary_large_image');
  upsertMetaName('twitter:title', meta.title);
  upsertMetaName('twitter:description', meta.description);
  upsertMetaName('twitter:image', meta.ogImage);

  upsertCanonical(meta.canonicalUrl);

  removeStructuredData('page-structured-data');
  if (meta.structuredData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'page-structured-data';
    script.textContent = JSON.stringify(meta.structuredData);
    document.head.appendChild(script);
  }
}

export function restoreDefaultHomeHead(): void {
  applyHead({
    title: DEFAULT_HOME_SEO.title,
    description: DEFAULT_HOME_SEO.description,
    canonicalUrl: DEFAULT_HOME_SEO.canonicalUrl,
    ogImage: DEFAULT_HOME_SEO.ogImage,
    type: DEFAULT_HOME_SEO.type,
  });
}

const PageSEOHead: React.FC<PageSEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  type = 'website',
  structuredData,
}) => {
  useEffect(() => {
    const canonical = canonicalUrl || `${SITE_ORIGIN}${window.location.pathname}`;
    applyHead({
      title,
      description,
      keywords,
      canonicalUrl: canonical,
      ogImage,
      type,
      structuredData,
    });

    // Sin restore a home: la siguiente ruta con SEO sobrescribe; evita canonical de home en /contact, etc.
  }, [title, description, keywords, ogImage, canonicalUrl, type, structuredData]);

  return null;
};

export default PageSEOHead;
