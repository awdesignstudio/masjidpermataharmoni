const CACHE_NAME = 'rt05-portal-v2.6'; // Ganti tiap ada update besar

// 1. Sesuaikan file yang di-cache dengan struktur repository Mas Adhi
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png', // Pastikan path folder icons sesuai
  './icons/icon-512.png'
];

// Install: Simpan aset ke cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: Bersihkan sampah cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Langsung ambil kendali halaman
  );
});

// Fetch: Strategi Stale-While-Revalidate (Cepat & Tetap Update)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Ambil dari cache (jika ada)
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Sambil jalan, update cache dengan versi terbaru dari network
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
          // Jika offline total dan tidak ada di cache, bisa kasih fallback di sini
      });

      return cachedResponse || fetchPromise;
    })
  );
});
