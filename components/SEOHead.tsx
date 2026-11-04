import React, { useEffect } from 'react';
import { toAbsoluteMediaUrl } from './PageSEOHead';

interface SEOHeadProps {
  model?: {
    name: string;
    age?: number;
    nationality?: string;
    city?: string;
    image: string;
    description?: string;
    services?: string[];
    height?: string | number;
    weight?: string | number;
    slug?: string;
    vip?: boolean;
    seoTitle?: string;
    seoDescription?: string;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({ model }) => {
  useEffect(() => {
    if (!model) return;

    // Generate SEO data based on model properties and rules
    const isVIP = !!model.vip;
    const modelName = model.name;
    const nationality = model.nationality || 'Española';
    const city = model.city || 'Valencia';
    const age = model.age;
    const customSeoTitle = model.seoTitle?.trim();
    const customSeoDescription = model.seoDescription?.trim();
    
    // Generate title based on VIP rules
    let title = customSeoTitle || '';
    if (!title && isVIP) {
      title = `${modelName} VIP | Acompañante VIP en ${city} | Valeria Ferrer`;
    } else if (!title) {
      // Use elegant vocabulary based on nationality
      const category = nationality === 'Colombiana' ? 'Escort' : 
                      nationality === 'Española' ? 'Acompañante' : 'Acompañante';
      title = `${modelName} | ${category} ${nationality} en ${city} | Valeria Ferrer`;
    }

    // Reuse each profile's actual editorial text, rather than publishing the
    // same generic snippet on dozens of different model pages.
    const editorial = (model.description || '').replace(/\s+/g, ' ').trim();
    const prefix = `${model.name} en ${city}. `;
    const available = Math.max(0, 157 - prefix.length);
    const excerpt = editorial.length > available
      ? editorial.slice(0, available).replace(/\s+\S*$/, '') + '…'
      : editorial;
    const category = nationality === 'Colombiana' ? 'Escort' : 'Acompañante';
    const description = customSeoDescription ||
      (editorial
        ? prefix + excerpt
        : `${modelName}, ${category.toLowerCase()} ${nationality} en ${city}. Consulta su perfil y disponibilidad en Valeria Ferrer.`);

    // Update document title
    document.title = title;

    // Update or create meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      const desc = document.createElement('meta');
      desc.name = 'description';
      desc.setAttribute('content', description);
      document.head.appendChild(desc);
    } else {
      descriptionMeta.setAttribute('content', description);
    }

    // Add structured data (JSON-LD) - Enhanced Person schema
    const existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const modelSlug = model.slug || model.name.toLowerCase();
    const modelProfileUrl = `https://www.valeriaferrer.com/models/${modelSlug}`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": model.name,
      "description": customSeoDescription || model.description || (typeof age === 'number' && !Number.isNaN(age)
        ? `Modelo ${model.nationality || 'Española'} de ${age} años disponible en ${model.city || 'Valencia'}`
        : `Modelo ${model.nationality || 'Española'} disponible en ${model.city || 'Valencia'}`),
      "image": toAbsoluteMediaUrl(model.image),
      "url": modelProfileUrl,
      "jobTitle": isVIP ? "Modelo de Compañía VIP" : "Modelo",
      "nationality": model.nationality || "Española",
      "gender": "Female",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": model.city || 'Valencia',
        "addressRegion": "Valencia",
        "addressCountry": "ES"
      },
      "offers": {
        "@type": "Offer",
        "description": "Servicios de acompañamiento exclusivos y discreción absoluta",
        "areaServed": model.city || 'Valencia',
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "EUR",
          "priceRange": "$$$"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Acompañamiento VIP",
          "description": "Servicios de acompañamiento de lujo con modelo exclusiva",
          "serviceType": "Companion Services"
        }
      },
      "hasOccupation": {
        "@type": "Occupation",
        "description": "Modelo de compañía y acompañante VIP",
        "occupationLocation": {
          "@type": "City",
          "name": model.city || 'Valencia'
        }
      },
      "sameAs": [
        modelProfileUrl
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitle) {
      const titleTag = document.createElement('meta') as HTMLMetaElement;
      titleTag.setAttribute('property', 'og:title');
      titleTag.setAttribute('content', title);
      document.head.appendChild(titleTag);
    } else {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescription) {
      const desc = document.createElement('meta') as HTMLMetaElement;
      desc.setAttribute('property', 'og:description');
      desc.setAttribute('content', description);
      document.head.appendChild(desc);
    } else {
      ogDescription.setAttribute('content', description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (!ogImage) {
      const image = document.createElement('meta') as HTMLMetaElement;
      image.setAttribute('property', 'og:image');
      image.setAttribute('content', toAbsoluteMediaUrl(model.image));
      document.head.appendChild(image);
    } else {
      ogImage.setAttribute('content', toAbsoluteMediaUrl(model.image));
    }

    // Add Twitter Card meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
    if (!twitterTitle) {
      const titleTag = document.createElement('meta') as HTMLMetaElement;
      titleTag.name = 'twitter:title';
      titleTag.setAttribute('content', title);
      document.head.appendChild(titleTag);
    } else {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
    if (!twitterDescription) {
      const desc = document.createElement('meta') as HTMLMetaElement;
      desc.name = 'twitter:description';
      desc.setAttribute('content', description);
      document.head.appendChild(desc);
    } else {
      twitterDescription.setAttribute('content', description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
    if (!twitterImage) {
      const image = document.createElement('meta') as HTMLMetaElement;
      image.name = 'twitter:image';
      image.setAttribute('content', toAbsoluteMediaUrl(model.image));
      document.head.appendChild(image);
    } else {
      twitterImage.setAttribute('content', toAbsoluteMediaUrl(model.image));
    }

    // Add canonical URL - use actual slug
    const canonicalUrl = modelProfileUrl;
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      const link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'canonical';
      link.href = canonicalUrl;
      document.head.appendChild(link);
    } else {
      canonicalLink.href = canonicalUrl;
    }

    // Add og:url
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (!ogUrl) {
      const url = document.createElement('meta') as HTMLMetaElement;
      url.setAttribute('property', 'og:url');
      url.setAttribute('content', canonicalUrl);
      document.head.appendChild(url);
    } else {
      ogUrl.setAttribute('content', canonicalUrl);
    }

    // Cleanup on unmount
    return () => {
      const script = document.querySelector('#structured-data');
      if (script) script.remove();
    };
  }, [model]);

  return null; // This component doesn't render anything
};

export default SEOHead;
