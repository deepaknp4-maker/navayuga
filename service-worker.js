self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('navayuga-store').then((cache) => {
      return cache.addAll(['/', '/index.html', '/style.css']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});