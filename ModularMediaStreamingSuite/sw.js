// sw.js — Remote proxy + cache for video streams

const CACHE_NAME = "media-cache-v1";

// Cache video requests only
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only intercept video or playlist (.m3u8) requests
  if (request.destination === "video" || request.url.endsWith(".m3u8") || request.url.endsWith(".mp4")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log("[SW] Serving from cache:", request.url);
          return cachedResponse;
        }

        try {
          console.log("[SW] Fetching and caching:", request.url);
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.error("[SW] Fetch failed:", error);
          return cachedResponse || Response.error();
        }
      })
    );
  }
});