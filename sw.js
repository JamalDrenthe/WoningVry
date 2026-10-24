// WoningVry Service Worker (PWA Caching & Offline Support)
const CACHE_NAME = "woningvry-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./aanbod.html",
  "./woning.html",
  "./account.html",
  "./login.html",
  "./registratie.html",
  "./style.css",
  "./script.js",
  "./properties-data.js",
  "./favicon.svg",
  "./favicon.png",
  "./attached_assets/woningvry-logo.svg",
  "./attached_assets/woningvry-logo.png"
];

// Install: Cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("Niet alle assets konden direct worden gecached:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first for HTML/Data, cache fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;
  
  // Sla niet-GET of Firebase Auth/Firestore netwerkverzoeken over
  if (request.method !== "GET" || request.url.includes("firestore.googleapis.com") || request.url.includes("identitytoolkit")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Alleen geldige responsen cachen
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback naar cache als offline
        return caches.match(request);
      })
  );
});
