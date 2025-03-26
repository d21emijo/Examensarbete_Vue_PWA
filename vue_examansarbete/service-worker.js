/* global clients */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Lägger till alla filer som Workbox precachear vid installation
precacheAndRoute(self.__WB_MANIFEST || []);

// 📌 Cacha API-responsen för produkter (NetworkFirst = använd cache vid offline)
registerRoute(
  ({ url }) => url.pathname.startsWith('/products'),
  new NetworkFirst({
    cacheName: 'products',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }), // 5 minuters cache
    ],
  })
);

// 📌 Cacha bilder (CacheFirst = använd cache direkt om möjligt)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 1 vecka
    ],
  })
);

// 📌 Lyssna på meddelanden och tillåt direktuppdatering av service workern
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 📌 Aktivera ny service worker direkt när alla klienter är stängda
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim()
  );
});
