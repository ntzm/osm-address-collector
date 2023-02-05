importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.2/workbox-sw.js',
)

workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(
    new workbox.strategies.NetworkFirst({networkTimeoutSeconds: 5}),
  ),
)
