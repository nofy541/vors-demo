const cacheName = "vors-offline-v4";
const publicPages = new Set(["/vors-demo/", "/vors-demo/booking/", "/vors-demo/services/", "/vors-demo/contacts/", "/vors-demo/privacy/"]);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(["/vors-demo/offline.html", "/vors-demo/icons/icon-192.png", "/vors-demo/icons/icon-512.png", "/vors-demo/icons/maskable-512.png"]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith("vors-offline-") && key !== cacheName) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate" && publicPages.has(url.pathname)) {
    event.respondWith(fetch(request).catch(async () => (await caches.open(cacheName)).match("/vors-demo/offline.html")));
  }
});
