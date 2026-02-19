const CACHE_NAME = 'masjid-portal-v2.1'; // GANTI versi setiap kali update kode

// File yang mau di-cache (tambah/kurangi sesuai kebutuhan)
const urlsToCache = [
  './',
  './index.html',
  './icon-192x192.png'
];

self.addEventListener('install', event => {
  // Paksa Service Worker baru langsung aktif tanpa menunggu tab ditutup
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // Hapus cache versi lama secara otomatis
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
