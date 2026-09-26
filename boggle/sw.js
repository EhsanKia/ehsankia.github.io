/* Swipe Boggle service worker.
 *
 * The app is a single self-contained HTML file with no runtime network calls,
 * so there is nothing clever to do here: precache the handful of files once,
 * then serve them from the cache. CACHE is stamped with a hash of the built
 * HTML by build.py, so every deploy lands in a fresh cache and the old one is
 * dropped on activate.
 */
const CACHE = 'boggle-c12c326e86c5';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// CacheStorage is per origin, not per scope, and ehsankia.com hosts other apps
// (/necro/) with their own caches. Only ever clean up our own old versions --
// deleting every other key wiped the neighbour's offline copy.
const PREFIX = 'boggle-';

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k =>
        (k.startsWith(PREFIX) && k !== CACHE ? caches.delete(k) : null)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  // ignoreSearch: invite links arrive as ?r=CODE and must still hit the shell.
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
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

// The page asks for this once the user accepts a pending update.
self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
