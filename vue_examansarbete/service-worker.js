import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

// Make sure all navigations load index.html (App Shell model)
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL('/index.html') 
);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // 0 krävs för CORS
      }),
      new ExpirationPlugin({
        maxEntries: 10, // Max antal bilder i cache
        maxAgeSeconds: 7 * 24 * 60 * 60, // Sparas i en vecka
      }),
    ],
  })
);

// Allow the web app to update Service Worker immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate new Service Worker immediately
// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim());
// });
