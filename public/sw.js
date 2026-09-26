/*
 * Image cache. Uploaded images live in Supabase Storage, which serves them
 * with `cache-control: no-cache`, so the browser re-asks the server about every
 * image on every visit (a 304, but a round trip each). Every upload gets a
 * fresh random file name and is never overwritten, so an image URL's content
 * can't change — safe to serve straight from this cache, never asking again.
 *
 * Only images are handled; pages, scripts and API calls pass straight through.
 * Bump CACHE to throw the whole cache away in a future release.
 */
const CACHE = "tk-images-v1";
const MAX_ENTRIES = 400;

const isCacheableImage = (url) =>
  (url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/public/")) ||
  (url.origin === self.location.origin && url.pathname.startsWith("/images/"));

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop caches from older versions of this file.
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.startsWith("tk-images-") && n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

// Oldest-first eviction so the cache can't grow without bound.
const trim = async (cache) => {
  const keys = await cache.keys();
  const excess = keys.length - MAX_ENTRIES;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!isCacheableImage(url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(url.href);
      if (hit) return hit;

      // Fetch in CORS mode (Supabase allows any origin) rather than the <img>
      // tag's no-cors: an opaque response would be stored as a padded ~7 MB
      // entry each and quickly exhaust the browser's storage quota.
      const response = await fetch(url.href, { mode: "cors", credentials: "omit" });
      if (response.ok) {
        event.waitUntil(cache.put(url.href, response.clone()).then(() => trim(cache)));
      }
      return response;
    })().catch(() => fetch(request)), // anything odd: behave as if we weren't here
  );
});
