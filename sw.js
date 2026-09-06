const CACHE = 'akademie-v2';
const ASSETS = ['./', './index.html', './arena.html', './zerya.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    // Eigene Seiten: immer frisch vom Netz (no-store umgeht den Browser-HTTP-Cache), sonst Cache (offline)
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else {
    // Fremde Ressourcen (Google Fonts): erst Cache, sonst Netz
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
