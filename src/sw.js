import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// Regel 1 – App-Shell und statische Assets (Konzept: Datentyp „Statische Assets“).
// HTML, JS, CSS mit den Tokens, Icons und Manifest werden beim Install vorgeladen
// und danach Cache-First ausgeliefert. Die Revision kommt aus dem Build-Hash.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Regel 2 – Navigationen (Konzept: Datentyp „Mein Programm“, außerdem jeder Deep Link).
// Jede Seitenanfrage wie /mein-programm oder /sessions/s03 bekommt die vorgeladene
// index.html, ohne aufs Netz zu warten. Den Rest erledigen der Router und localStorage.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// Ein neuer Stand wartet, bis die Person „Aktualisieren“ wählt (registerType: 'prompt').
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
