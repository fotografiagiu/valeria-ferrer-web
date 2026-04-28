import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path: string;
  current?: boolean;
}

const Breadcrumbs: React.FC<{ modelName?: string }> = ({ modelName }) => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Inicio', path: '/' },
    ];

    // Add dynamic breadcrumbs based on current path
    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'models') {
        if (pathSegments.length === 1) {
          // /models page
          breadcrumbs.push({ name: 'Escorts VIP', path: '/models', current: true });
        } else if (pathSegments.length === 2 && modelName) {
          // /models/[model] page
          breadcrumbs.push({ name: 'Escorts VIP', path: '/models' });
          breadcrumbs.push({ 
            name: modelName, 
            path: `/models/${pathSegments[1]}`, 
            current: true 
          });
        }
      } else if (pathSegments[0] === 'about') {
        breadcrumbs.push({ name: 'Sobre Nosotros', path: '/about', current: true });
      } else if (pathSegments[0] === 'contact') {
        breadcrumbs.push({ name: 'Contacto', path: '/contact', current: true });
      } else if (pathSegments[0] === 'booking') {
        breadcrumbs.push({ name: 'Reservas', path: '/booking', current: true });
      } else if (pathSegments[0] === 'fees') {
        breadcrumbs.push({ name: 'Tarifas', path: '/fees', current: true });
      } else if (pathSegments[0] === 'casting') {
        breadcrumbs.push({ name: 'Casting', path: '/casting', current: true });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://valeriaferrer.com${crumb.path}`
    }))
  };

  return (
    <>
      {/* Structured Data for Breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Breadcrumbs Navigation */}
      <nav 
        className="bg-[#0a0a0a] border-b border-white/5 px-6 py-3"
        aria-label="Navegación de migas de pan"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-400 max-w-[1600px] mx-auto">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index === 0 && <Home size={14} className="mr-1" />}
              
              {crumb.current ? (
                <span className="text-[#c2b2a3] font-medium">
                  {crumb.name}
                </span>
              ) : (
                <Link 
                  to={crumb.path}
                  className="hover:text-[#c2b2a3] transition-colors duration-200"
                >
                  {crumb.name}
                </Link>
              )}
              
              {index < breadcrumbs.length - 1 && (
                <ChevronRight size={14} className="mx-2 text-gray-600" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
