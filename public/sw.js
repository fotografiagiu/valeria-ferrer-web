const CACHE_NAME = 'valeria-ferrer-v3';
const urlsToCache = [
  '/',
  '/about',
  '/contact',
  '/booking',
  '/fees',
  '/manifest.json'
];

// Install event - cache app shell and activate immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event:
// - Navigation requests: network-first to avoid stale HTML/chunk mismatches
// - Model routes: always network-first to ensure latest content
// - Static assets: cache-first with network fallback
// - Dynamic routes: never cache to ensure fresh content
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const isNavigationRequest = event.request.mode === 'navigate';
  const isModelRoute = event.request.url.includes('/models/') || 
                      event.request.url.includes('/chicas/') || 
                      event.request.url.includes('/chicas-thumbnails/');
  const isStaticAsset = event.request.url.includes('/assets/') || 
                       event.request.url.includes('.css') || 
                       event.request.url.includes('.js');

  // Always fetch model routes from network
  if (isModelRoute) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Navigation requests: network-first
  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/')))
    );
    return;
  }

  // Static assets: cache-first with network fallback for fresh content
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Other requests: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
