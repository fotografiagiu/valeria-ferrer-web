// Service Worker minimal - solo para assets estáticos con hash
// No cachea HTML ni rutas dinámicas para evitar contenido antiguo

const CACHE_NAME = 'valeria-ferrer-static-v4';
const STATIC_ASSETS = [
  // Solo assets con hash que no cambian entre deploys
  '/assets/',
  '/fonts/',
  '/icons/',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - solo cachea assets estáticos seguros
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // No cacheamos páginas HTML ni rutas dinámicas
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('/')));
      })
  );
  self.skipWaiting();
});

// Fetch event - estrategia específica por tipo de contenido
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // NUNCA cachear estas rutas - siempre desde red
  const neverCacheRoutes = [
    '/',
    '/models',
    '/models/',
    '/chicas/',
    '/chicas-thumbnails/',
    '/about',
    '/contact',
    '/booking',
    '/fees'
  ];

  const isNeverCacheRoute = neverCacheRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  if (isNeverCacheRoute) {
    // Siempre desde red para contenido fresco
    event.respondWith(fetch(event.request));
    return;
  }

  // Solo cachear assets estáticos con hash (seguros)
  const isStaticAsset = pathname.includes('/assets/') || 
                       pathname.includes('/fonts/') ||
                       pathname.includes('/icons/') ||
                       pathname.endsWith('.ico') ||
                       pathname.endsWith('.json');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // Cache-first para assets estáticos
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si no está en cache, fetch y cache
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        });
      })
    );
    return;
  }

  // Para todo lo demás (imágenes dinámicas, etc): network-first
  event.respondWith(
    fetch(event.request).catch(() => {
      // Solo fallback a cache si falla la red
      return caches.match(event.request);
    })
  );
});

// Activate event - limpiar caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eliminar todas las caches excepto la actual
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
