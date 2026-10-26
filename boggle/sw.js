/* Swipe Boggle service worker.
 *
 * The app is a single self-contained HTML file with no runtime network calls,
 * so there is nothing clever to do here: precache the handful of files once,
 * then serve them from the cache. CACHE is stamped with a hash of the built
 * HTML by build.py, so every deploy lands in a fresh cache and the old one is
 * dropped on activate.
 */
const CACHE = 'boggle-c1c0184595df';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // From the server, never the HTTP cache: GitHub Pages lets a copy live for
    // ten minutes, so a phone that loaded the game just before a deploy would
    // otherwise file the old page under the new version, and keep it.
    await c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })));
    // It must also be the page this worker was built with (the page names its
    // build, see BUILD in 60_boot.js). A CDN still handing out the old one
    // fails the install, which the next update check retries, instead of
    // pinning the old game until the deploy after.
    for (const u of ['./', './index.html']) {
      const r = await c.match(u);
      if (!r || !(await r.text()).includes(CACHE)) {
        await caches.delete(CACHE);
        throw new Error(u + ' is not ' + CACHE);
      }
    }
    // Pages from before forced updates (no GATED marker yet) only offer an
    // update, once they are already in a lobby. Take over from their worker
    // at once instead: those pages reload into this version straight away.
    // From here on a page updates itself before going online (Update.before
    // in 60_boot.js), so later workers wait their turn as usual.
    if (!(await caches.has(GATED))) self.skipWaiting();
  })());
});

// CacheStorage is per origin, not per scope, and ehsankia.com hosts other apps
// (/necro/) with their own caches. Only ever clean up our own old versions --
// deleting every other key wiped the neighbour's offline copy.
const PREFIX = 'boggle-';
// An empty cache whose existence says "these pages update before going
// online". Deliberately outside PREFIX, so activate never deletes it.
const GATED = 'swipe-boggle-gated';

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k =>
        (k.startsWith(PREFIX) && k !== CACHE ? caches.delete(k) : null)));
    await caches.open(GATED);
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
