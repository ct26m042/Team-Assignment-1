import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

// Die Caching-Regeln folgen docs/schritt3/02-offline-strategie-konzept.md.
// Anfragen, die keine Regel trifft, gehen unverändert ans Netz.

const PROGRAM_DATA_CACHE = 'relay-programmdaten'
const manifest = self.__WB_MANIFEST

// Der Build legt Sessions und Speaker in assets/conference-data-<hash>.js ab (vite.config.js).
const isProgramData = (entry) => /(^|\/)assets\/conference-data-[\w-]+\.js$/.test(entry.url)
const programDataUrls = manifest
  .filter(isProgramData)
  .map((entry) => new URL(entry.url, self.registration.scope).href)

// Regel 1 – App-Shell und statische Assets (Konzept: Datentyp „Statische Assets“).
// HTML, JS, CSS mit den Tokens, Icons und Manifest werden beim Install vorgeladen
// und danach Cache-First ausgeliefert. Die Revision kommt aus dem Build-Hash.
precacheAndRoute(manifest.filter((entry) => !isProgramData(entry)))
cleanupOutdatedCaches()

// Regel 2 – Navigationen (Konzept: Datentyp „Mein Programm“, außerdem jeder Deep Link).
// Jede Seitenanfrage wie /mein-programm oder /sessions/s03 bekommt die vorgeladene
// index.html, ohne aufs Netz zu warten. Den Rest erledigen der Router und localStorage.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// Regel 3 – Sessions und Speaker (Konzept: Datentyp „Programmdaten“).
// Eigener Cache, schon beim Install gefüllt, damit die Daten auch dann offline da sind,
// wenn der erste Besuch vor der Aktivierung des Service Workers geladen hat.
// Cache-First: Nach der Veröffentlichung ändert sich der Katalog nicht mehr, und ein
// geänderter Katalog kommt mit neuem Hash über das Update des Service Workers.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PROGRAM_DATA_CACHE).then((cache) => cache.addAll(programDataUrls)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(PROGRAM_DATA_CACHE).then(async (cache) => {
      for (const request of await cache.keys()) {
        if (!programDataUrls.includes(request.url)) {
          await cache.delete(request)
        }
      }
    }),
  )
})

// ignoreVary: Der Server antwortet mit „Vary: Origin“. Das Modul-Script schickt einen
// Origin-Header, das Vorladen beim Install nicht, also würde der Eintrag sonst nie passen.
registerRoute(
  ({ url }) => programDataUrls.includes(url.href),
  new CacheFirst({ cacheName: PROGRAM_DATA_CACHE, matchOptions: { ignoreVary: true } }),
)

// Ein neuer Stand wartet, bis die Person „Aktualisieren“ wählt (registerType: 'prompt').
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
