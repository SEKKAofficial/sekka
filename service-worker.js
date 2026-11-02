/* =================================
   SEKKA - SERVICE WORKER
   سِكّة | مشوارك أسهل
================================= */

const CACHE_NAME = "sekka-v3";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

// تثبيت التطبيق وتخزين الملفات الأساسية
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// تفعيل النسخة الجديدة وتنظيف النسخ القديمة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith("sekka-") &&
                name !== CACHE_NAME
            )
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// التعامل مع طلبات الموقع
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestURL = new URL(request.url);

  if (requestURL.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(request);

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const cache = await caches.open(CACHE_NAME);

          await cache.put(
            request,
            networkResponse.clone()
          );
        }

        return networkResponse;

      } catch (error) {
        if (request.mode === "navigate") {
          const offlinePage = await caches.match("./index.html");

          if (offlinePage) {
            return offlinePage;
          }
        }

        return new Response("أنت غير متصل بالإنترنت حاليًا.", {
          status: 503,
          statusText: "Service Unavailable",
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      }
    })()
  );
});
