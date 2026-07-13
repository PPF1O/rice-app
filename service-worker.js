const CACHE_NAME = 'rice-photoperiod-v4';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './planting_predictor.html',
  './photoperiod_calculator.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ตอนติดตั้ง: ก๊อปไฟล์ทั้งหมดเก็บในเครื่อง
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ตอนเปิดใช้: ลบ cache เก่าถ้ามีเวอร์ชันใหม่
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ตอนโหลดหน้า: ลองดึงจากเครื่องก่อน (offline-first) ถ้าไม่มีค่อยไปเน็ต
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );
});
