/* NecroMerger Tap Calculator service worker.
 *
 * index.html is entirely self-contained -- the sprites, CSS, JS and data are
 * all inlined, so the page makes zero network requests once loaded. That makes
 * the caching strategy trivial: precache five URLs, serve cache-first, no
 * runtime strategy at all.
 *
 * CACHE is stamped by build.py with a hash of everything precached, so a
 * deploy can never reuse a stale cache and nobody has to remember to bump a
 * version constant by hand.
 */
const CACHE = 'necro-7eead9322571';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  // ignoreSearch because shared calculations arrive with a #hash (and could
  // pick up a ?utm= on the way), which must still hit the cached shell.
  e.respondWith((async () => {
    const hit = await caches.match(req, {ignoreSearch: true});
    if (hit) return hit;
    try {
      return await fetch(req);
    } catch (err) {
      if (req.mode === 'navigate') {
        const shell = await caches.match('./index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});

// The page sends this once the user accepts a pending update.
self.addEventListener('message', (e) => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
