
// Simple service worker for offline support (PWA)
self.addEventListener('install', event => {
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	self.clients.claim();
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') return;
	event.respondWith(
		caches.open('aiguidepro-v1').then(cache =>
			cache.match(event.request).then(resp =>
				resp || fetch(event.request).then(response => {
					cache.put(event.request, response.clone());
					return response;
				})
			)
		)
	);
});
