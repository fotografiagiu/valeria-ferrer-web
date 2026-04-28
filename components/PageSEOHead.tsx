import React, { useEffect } from 'react';

interface PageSEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

const PageSEOHead: React.FC<PageSEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://valeriaferrer.com/og-image.jpg',
  canonicalUrl,
  type = 'website',
  structuredData
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta description
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update or create meta property
    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Open Graph meta tags
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:type', type);
    updateProperty('og:image', ogImage);
    updateProperty('og:url', canonicalUrl || window.location.href);
    updateProperty('og:site_name', 'Valeria Ferrer');

    // Twitter Card meta tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('#page-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-structured-data';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const script = document.querySelector('#page-structured-data');
      if (script) script.remove();
    };
  }, [title, description, keywords, ogImage, canonicalUrl, type, structuredData]);

  return null;
};

export default PageSEOHead;
