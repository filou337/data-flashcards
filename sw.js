const CACHE_NAME = "data-flashcards-v7";
const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/app.js",
  "js/db.js",
  "js/srs.js",
  "data/index.js",
  "data/cards-sql.js",
  "data/cards-m.js",
  "data/cards-dax.js",
  "data/cards-pyspark.js",
  "data/cards-scala.js",
  "data/cards-cas-pratique.js",
  "data/cards-stats.js",
  "data/cards-regression.js",
  "data/cards-analyse.js",
  "data/cards-dataeng.js",
  "data/cards-tests.js",
  "figures/medaillon/medaillon.html",
  "figures/medaillon/medaillon-light.html",
  "figures/wap/wap.html",
  "figures/wap/wap-light.html",
  "figures/watermark/watermark.html",
  "figures/watermark/watermark-light.html",
  "figures/bootstrap/bootstrap.html",
  "figures/bootstrap/bootstrap-light.html",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate : sert le cache immédiatement, revalide en arrière-plan.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
