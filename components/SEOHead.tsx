import React, { useEffect } from 'react';

interface SEOHeadProps {
  model?: {
    name: string;
    age: number;
    nationality?: string;
    city?: string;
    image: string;
    description?: string;
    services?: string[];
    height?: string | number;
    weight?: string | number;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({ model }) => {
  useEffect(() => {
    if (!model) return;

    // Update document title
    document.title = `${model.name} - Modelo Exclusiva en ${model.city || 'Valencia'} | Valeria Ferrer`;

    // Update or create meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      const description = document.createElement('meta');
      description.name = 'description';
      description.content = model.description || `${model.name}, modelo ${model.nationality || 'Española'} de ${model.age} años. Disponible para acompañamiento exclusivo en ${model.city || 'Valencia'}. Valeria Ferrer Agency.`;
      document.head.appendChild(description);
    } else {
      descriptionMeta.content = model.description || `${model.name}, modelo ${model.nationality || 'Española'} de ${model.age} años. Disponible para acompañamiento exclusivo en ${model.city || 'Valencia'}. Valeria Ferrer Agency.`;
    }

    // Add structured data (JSON-LD) - Enhanced Person schema
    const existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": model.name,
      "description": model.description || `Modelo ${model.nationality || 'Española'} de ${model.age} años disponible en ${model.city || 'Valencia'}`,
      "image": model.image,
      "url": `https://www.valeriaferrer.com/models/${model.name.toLowerCase()}`,
      "jobTitle": "Modelo de Compañía VIP",
      "nationality": model.nationality || "Española",
      "birthDate": new Date(new Date().getFullYear() - model.age, 0, 1).toISOString().split('T')[0],
      "gender": "Female",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": model.city || 'Valencia',
        "addressRegion": "Valencia",
        "addressCountry": "ES"
      },
      "knowsLanguage": ["Spanish", "English"],
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
        `https://www.valeriaferrer.com/models/${model.name.toLowerCase()}`
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const title = document.createElement('meta');
      title.property = 'og:title';
      title.content = `${model.name} - Modelo Exclusiva en ${model.city || 'Valencia'} | Valeria Ferrer`;
      document.head.appendChild(title);
    } else {
      ogTitle.content = `${model.name} - Modelo Exclusiva en ${model.city || 'Valencia'} | Valeria Ferrer`;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const description = document.createElement('meta');
      description.property = 'og:description';
      description.content = model.description || `Conoce a ${model.name}, modelo ${model.nationality || 'Española'} de ${model.age} años. Experiencia única en ${model.city || 'Valencia'}.`;
      document.head.appendChild(description);
    } else {
      ogDescription.content = model.description || `Conoce a ${model.name}, modelo ${model.nationality || 'Española'} de ${model.age} años. Experiencia única en ${model.city || 'Valencia'}.`;
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      const image = document.createElement('meta');
      image.property = 'og:image';
      image.content = model.image;
      document.head.appendChild(image);
    } else {
      ogImage.content = model.image;
    }

    // Add Twitter Card meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      const title = document.createElement('meta');
      title.name = 'twitter:title';
      title.content = `${model.name} - Modelo ${model.nationality || 'Española'} | Valeria Ferrer`;
      document.head.appendChild(title);
    } else {
      twitterTitle.content = `${model.name} - Modelo ${model.nationality || 'Española'} | Valeria Ferrer`;
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      const description = document.createElement('meta');
      description.name = 'twitter:description';
      description.content = model.description || `Modelo exclusiva de ${model.age} años en ${model.city || 'Valencia'}`;
      document.head.appendChild(description);
    } else {
      twitterDescription.content = model.description || `Modelo exclusiva de ${model.age} años en ${model.city || 'Valencia'}`;
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      const image = document.createElement('meta');
      image.name = 'twitter:image';
      image.content = model.image;
      document.head.appendChild(image);
    } else {
      twitterImage.content = model.image;
    }

    // Add canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `https://www.valeriaferrer.com/models/${model.name.toLowerCase()}`;
      document.head.appendChild(link);
    } else {
      canonicalLink.href = `https://www.valeriaferrer.com/models/${model.name.toLowerCase()}`;
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
