/* Kill switch del service worker público.
   Sustituye al worker antiguo, borra solo Cache Storage y se desregistra.
   No define estrategia de caché ni deja una PWA permanente. */

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

      await self.clients.claim();
      await self.registration.unregister();

      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      await Promise.all(
        windowClients.map(async (client) => {
          if (typeof client.navigate !== 'function' || !client.url) return;
          try {
            await client.navigate(client.url);
          } catch {
            // La pestaña pudo cerrarse durante la retirada.
          }
        })
      );
    })()
  );
});

// Mientras este worker controla la pestaña, ninguna petición sale de Cache Storage.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
