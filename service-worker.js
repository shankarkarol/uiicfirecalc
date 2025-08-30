// UIIC Fire Premium Calculator - Service Worker

const CACHE_NAME = 'uiic-fire-calc-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static resources');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Static resources cached successfully');
                // Force activation of new service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static resources:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Serving from cache:', event.request.url);
                    
                    // For HTML files, also try to update cache in background
                    if (event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
                        fetch(event.request)
                            .then((networkResponse) => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then((cache) => {
                                            cache.put(event.request, networkResponse.clone());
                                        });
                                }
                            })
                            .catch(() => {
                                // Network request failed, but we have cache
                                console.log('Background update failed for:', event.request.url);
                            });
                    }
                    
                    return cachedResponse;
                }
                
                // Not in cache, try network
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Check if response is valid
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response since it can only be used once
                        const responseToCache = networkResponse.clone();
                        
                        // Cache successful responses
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        console.log('Network request failed for:', event.request.url);
                        
                        // For navigation requests, serve offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // For other requests, throw error
                        throw new Error('Network request failed and no cache available');
                    });
            })
    );
});

// Background sync for saving calculations
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'save-calculation') {
        event.waitUntil(syncCalculations());
    }
});

// Handle offline calculation saving
async function syncCalculations() {
    try {
        // Get pending calculations from IndexedDB or localStorage
        const pendingCalculations = await getPendingCalculations();
        
        if (pendingCalculations.length === 0) {
            return;
        }
        
        // Try to sync with server if online
        if (navigator.onLine) {
            for (const calculation of pendingCalculations) {
                try {
                    // Here you would normally send to server
                    // For now, we'll just mark as synced in localStorage
                    await markCalculationAsSynced(calculation.id);
                    console.log('Calculation synced:', calculation.id);
                } catch (error) {
                    console.error('Failed to sync calculation:', calculation.id, error);
                }
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Mock function to get pending calculations
async function getPendingCalculations() {
    // In a real app, you'd use IndexedDB here
    return [];
}

// Mock function to mark calculation as synced
async function markCalculationAsSynced(id) {
    // In a real app, you'd update IndexedDB here
    console.log('Marked calculation as synced:', id);
}

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/manifest-icon-192.png',
        badge: '/manifest-icon-192.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'UIIC Fire Calculator', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // If app is already open, focus it
                for (const client of clientList) {
                    if (client.url === self.location.origin && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // If app is not open, open it
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-rates') {
        event.waitUntil(updatePremiumRates());
    }
});

// Mock function to update premium rates
async function updatePremiumRates() {
    try {
        console.log('Updating premium rates in background...');
        // In a real app, you'd fetch updated rates from server
        // and update local cache
    } catch (error) {
        console.error('Failed to update premium rates:', error);
    }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME)
                .then(() => {
                    console.log('Cache cleared');
                    event.ports[0].postMessage({ success: true });
                })
                .catch((error) => {
                    console.error('Failed to clear cache:', error);
                    event.ports[0].postMessage({ success: false, error: error.message });
                })
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
    event.preventDefault();
});

console.log('Service Worker script loaded');