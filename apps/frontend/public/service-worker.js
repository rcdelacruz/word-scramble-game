// Service Worker for Word Scramble Game PWA
const CACHE_NAME = 'word-scramble-cache-v1';
const DICTIONARY_CACHE_NAME = 'word-scramble-dictionary-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/game',
  '/leaderboard',
  '/manifest.json',
  '/dictionary.txt', // Cache the dictionary file for offline use
  '/icons/icon-72x72.svg',
  '/icons/icon-96x96.svg',
  '/icons/icon-128x128.svg',
  '/icons/icon-144x144.svg',
  '/icons/icon-152x152.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-384x384.svg',
  '/icons/icon-512x512.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, DICTIONARY_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle dictionary API requests specially
  if (url.pathname.includes('/api/game/dictionary')) {
    event.respondWith(handleDictionaryRequest(event.request));
    return;
  }

  // Handle API requests - network first, then cache
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // For other requests - cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If both cache and network fail, return a fallback
          if (event.request.url.includes('/game')) {
            return caches.match('/');
          }

          return new Response('Network error occurred', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
    })
  );
});

// Handle API requests - network first, then cache
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If both fail, return error response
    return new Response(JSON.stringify({
      success: false,
      error: 'Network error',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle dictionary requests
async function handleDictionaryRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses in the dictionary cache
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(DICTIONARY_CACHE_NAME);
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If both fail, return error response
    return new Response(JSON.stringify({
      success: false,
      error: 'Dictionary not available offline',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
