const CACHE = 'bricloset-v5';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (event.request.method === 'GET' && response.ok) {
          const responseClone = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
