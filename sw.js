const cacheName = 'leonel-cache-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icono.png'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Hacer que la app funcione sin internet
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
