
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Migración de las cachés del Service Worker antiguo: una sola vez por navegador.
// Antes se borraba CacheStorage en CADA visita, anulando la caché útil y
// añadiendo trabajo al arranque. La web ya no registra un SW nuevo.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const migrationFlag = 'vf-legacy-sw-cleanup-v1';
  try {
    if (window.localStorage.getItem(migrationFlag) !== 'done') {
      void (async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
          if ('caches' in window) {
            const names = await caches.keys();
            await Promise.all(names.map((name) => caches.delete(name)));
          }
          window.localStorage.setItem(migrationFlag, 'done');
        } catch (error) {
          console.warn('Legacy Service Worker cleanup deferred:', error);
        }
      })();
    }
  } catch {
    // Storage disabled: no repeat cache purge on every render.
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
