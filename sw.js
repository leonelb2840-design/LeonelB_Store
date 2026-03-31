// 1. Identificador de la versión para la Store
const CACHE_NAME = 'LeonelB_Store-v1.5';

// 2. Archivos Vitales (Asegúrate de que los nombres coincidan en tu repo)
const INITIAL_ASSETS = [
  './',
  './index.html',
  './icon-app.png' // Si usas un logo diferente, cámbiale el nombre aquí
];

// --- FASE DE INSTALACIÓN ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🛒 [LeonelB-Store]: Inventario cargado en el sistema.');
      return cache.addAll(INITIAL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// --- FASE DE ACTIVACIÓN ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('🛒 [LeonelB-Store]: Limpiando registros antiguos:', key);
              return caches.delete(key);
            })
      );
    }).then(() => {
      console.log('🛒 [LeonelB-Store]: Tienda lista para despachar offline.');
      return self.clients.claim();
    })
  );
});

// --- ESTRATEGIA DE RED: NETWORK FIRST ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
            
