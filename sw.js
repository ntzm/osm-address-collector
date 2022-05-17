const CACHE_NAME = "OSMAddressCollector";

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      fetch(event.request.url)
        .then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());
          return fetchedResponse;
        })
        .catch(() => cache.match(event.request.url))
    )
  );
});
