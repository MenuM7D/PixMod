// service-worker.js

const CACHE_NAME = 'image-resizer-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'favicon/favicon.ico',
  'favicon/web-app-manifest-192x192.png',
  '/logo512.png',
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching resources');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating new service worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Serve cached content when offline
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request to send to cache later
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone again for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
