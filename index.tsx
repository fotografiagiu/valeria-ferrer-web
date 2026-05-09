
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// LIMPIEZA TEMPORAL DE SERVICE WORKER Y CACHES ANTIGUOS
// Eliminar después de unos días cuando todos los usuarios hayan actualizado
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      console.log('Unregistering old service worker:', registration.scope);
      registration.unregister();
    });
  });
}

if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      console.log('Deleting old cache:', cacheName);
      caches.delete(cacheName);
    });
  });
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
