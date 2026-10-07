const CACHE_NAME = "nox-cache-v67";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./theme-sonthuy.css",
  "./theme-kiemkhi.css",
  "./script.js",
  "./grammar-data.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    // cache:"reload" -> bỏ qua HTTP cache của trình duyệt/host, luôn lấy bản mới nhất từ server
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(CORE_ASSETS.map((url) =>
        fetch(new Request(url, { cache: "reload" })).then((res) => {
          if (res.ok) return cache.put(url, res);
        })
      ))
    )
  );
  // Không tự skipWaiting() nữa — chờ người dùng bấm "Tải lại để cập nhật"
  // (trang gửi postMessage("SKIP_WAITING")) để tránh cập nhật ngầm bất ngờ.
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const sameOrigin = new URL(req.url).origin === self.location.origin;
  const cacheable = (res) => res && (res.ok || res.type === "opaque");

  // File của app (HTML / JS / CSS / icon / manifest): NETWORK-FIRST.
  // Luôn lấy bản mới nhất khi có mạng -> index.html, script.js, style.css không bao giờ lệch phiên bản.
  // Mất mạng thì dùng bản trong cache (vẫn chạy offline).
  if (sameOrigin) {
    event.respondWith(
      fetch(req, { cache: "no-cache" })
        .then((res) => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("./index.html") : undefined))
        )
    );
    return;
  }

  // Thư viện bên ngoài (Firebase CDN...): URL có gắn version nên cache-first là an toàn.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (cacheable(res)) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      });
    })
  );
});
