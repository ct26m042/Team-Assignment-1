import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

// Regel 1 – App-Shell und statische Assets (Konzept: Datentyp „Statische Assets“).
// HTML, JS, CSS mit den Tokens, Icons und Manifest werden beim Install vorgeladen
// und danach Cache-First ausgeliefert. Die Revision kommt aus dem Build-Hash.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Ein neuer Stand wartet, bis die Person „Aktualisieren“ wählt (registerType: 'prompt').
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
