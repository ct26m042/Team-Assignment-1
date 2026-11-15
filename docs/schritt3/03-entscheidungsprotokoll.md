# Entscheidungsprotokoll: Offline und Caching

## Kontext

Relay muss im Vortragssaal funktionieren, bei überlastetem Konferenz-WLAN oder im Flugmodus. Schritt 2 bettet `conference-data.json` beim Build ein, ein Backend gibt es nicht. Das persönliche Programm liegt unter `relay.myProgram.v1` in `localStorage`. Zu entscheiden war je Datentyp, woher eine Antwort kommt, wenn das Netz fehlt oder hängt. Die ausführliche Begründung steht in [02-offline-strategie-konzept.md](02-offline-strategie-konzept.md).

## Optionen

| Datentyp | Cache-First | Stale-While-Revalidate | Network-First |
| --- | --- | --- | --- |
| Programmdaten | sofort, offline vollständig; Updates über den Service Worker | jede Anfrage lädt eine Datei nach, deren Inhalt der Hash schon festlegt | wartet bei schwachem WLAN bis zum Timeout |
| Mein Programm (Seite) | App-Shell sofort, Daten aus `localStorage` | neue `index.html` erst beim nächsten Aufruf, ohne Gewinn | Seite hängt, obwohl alles auf dem Gerät liegt |
| Statische Assets | Precache, Revision aus dem Build-Hash | Hash-Dateien ändern sich nie unter derselben URL | unnötige Wartezeit |

## Entscheidung

Jede Regel steht kommentiert in [`src/sw.js`](../../src/sw.js).

- **Regel 1, statische Assets:** `precacheAndRoute` über alle Build-Dateien außer dem Katalog. Cache-First, `cleanupOutdatedCaches` räumt alte Builds weg.
- **Regel 2, Mein Programm und Deep Links:** `NavigationRoute` liefert für jede Navigation die vorgeladene `index.html`.
- **Regel 3, Programmdaten:** eigener Cache `relay-programmdaten`, beim Install gefüllt, `CacheFirst` mit `ignoreVary`. Beim Aktivieren fällt der alte Katalog weg.
- **Updates:** `registerType: 'prompt'`. Ein neuer Build wartet, bis jemand „Aktualisieren“ wählt.

## Konsequenzen

- Eine Raumänderung braucht einen neuen Build und erreicht ein Gerät erst nach „Aktualisieren“. Wer den Hinweis ignoriert, sieht bis zum Schließen aller Tabs den alten Raum.
- Der Haupt-Chunk importiert den Katalog über dessen Hash. Ändert sich der Katalog, ändert sich auch der Haupt-Chunk (Szenario 4: `index-CBmEiSiX.js` wurde zu `index-CJETcCDQ.js`). Ein Update lädt also rund 120 KB statt 10 KB.
- Der Preview-Server antwortet mit `Vary: Origin`. Ohne `ignoreVary` findet Regel 3 den eigenen Eintrag nicht.
- `navigator.onLine` erkennt schwaches WLAN nicht. Der Offline-Hinweis ist nur Information, die Inhalte kommen in beiden Fällen aus dem Cache.
- Ein Erstbesuch ohne Netz bleibt unmöglich (Szenario 3).

## Iterationen

Die Regeln sind in drei Schritten entstanden, jeder Schritt wurde mit demselben Skript getestet ([`assets/offline-test.mjs`](assets/offline-test.mjs)).

1. **Nur Precache.** Szenario 1 scheiterte: Der Reload von `/programm` zeigte offline `ERR_INTERNET_DISCONNECTED` ([Screenshot](assets/iteration1-s1-offline-fehlerseite.png)), weil nur `index.html` vorgeladen war, nicht jede Route. Daraus wurde Regel 2.
2. **Navigation-Fallback.** Szenarien 1 und 2 bestanden.
3. **Eigener Cache für den Katalog.** Szenario 1 zeigte eine leere Seite ([Screenshot](assets/iteration3-s1-offline-leer.png)). Der Eintrag lag im Cache, passte aber wegen `Vary: Origin` nicht zur Anfrage des Modul-Scripts. Szenario 2 bestand trotzdem, aber nur weil der Speicher-Cache des Browsers einsprang. Seitdem hat die Route `ignoreVary` und der Test schaltet den HTTP-Cache ab.

## Testszenarien

**Umgebung:** Windows 11 Pro, Microsoft Edge 157 (Chromium, headless), gesteuert mit Puppeteer. Getestet wurde der Production-Build über `vite preview`. „Offline“ heißt: Netzwerkemulation „Offline“ über das DevTools-Protokoll, also derselbe Schalter wie im Network-Tab, dazu ein gestoppter Server. Der HTTP-Cache des Browsers war aus, damit nur der Service Worker antworten konnte. Jedes Szenario beginnt mit einem frischen Profil. Durchlauf am 2026-11-15, Rohdaten in [`assets/testlauf-log.txt`](assets/testlauf-log.txt).

### Szenario 1: Programm online geladen, dann Flugmodus

**Ausgangslage:** Frisches Profil, Server läuft. `/programm` ist geladen, der Service Worker kontrolliert die Seite. Im Cache Storage liegen `workbox-precache-v2` mit zehn Einträgen und `relay-programmdaten` mit dem Katalog-Chunk.

**Aktion:** Server gestoppt, Offline-Modus an, Seite neu geladen. Danach `/sessions/s03` als neue Seitenanfrage geöffnet.

**Beobachtet:** Die Übersicht erscheint vollständig mit „20 von 20 Sessions“, Filtern und Karten. Unten rechts steht der Offline-Hinweis. `/sessions/s03` zeigt die Detailseite „Design Tokens: Eine Sprache für Design und Code“ mit Raum und Speaker. Jede Antwort kam vom Service Worker.

**Ergebnis:** Bestanden. In Iteration 1 zeigte derselbe Schritt die Fehlerseite des Browsers.

### Szenario 2: Mein Programm offline nach dem Hinzufügen

**Ausgangslage:** Dasselbe Profil, Server wieder online. Auf `/programm` wurden drei Sessions hinzugefügt. `relay.myProgram.v1` enthält `["s01","s02","s03"]`.

**Aktion:** Server gestoppt, Offline-Modus an. `/mein-programm` direkt als neue Seitenanfrage geöffnet, nicht über die Navigation der App. Danach noch einmal neu geladen.

**Beobachtet:** „Mein Programm“ zeigt „3 gespeicherte Sessions“ mit Zeit, Track, Raum, Speaker und „Entfernen“. Nach dem Reload steht dieselbe Liste da. Die IDs kommen aus `localStorage`, Titel und Räume aus dem gecachten Katalog, die Seite selbst aus Regel 2.

**Ergebnis:** Bestanden. In Iteration 3 bestand dieses Szenario nur scheinbar, weil der Speicher-Cache des Browsers den Katalog lieferte. Erst mit abgeschaltetem HTTP-Cache ist das Ergebnis belastbar.

### Szenario 3: Erstbesuch offline

**Ausgangslage:** Frisches Profil ohne Service Worker und ohne Cache, Offline-Modus an.

**Aktion:** `http://localhost:4173/` aufgerufen.

**Beobachtet:** Edge zeigt seine Fehlerseite „Looks like you're not connected to the internet“ mit `ERR_INTERNET_DISCONNECTED`. Von Relay erscheint nichts.

**Bewertung:** Akzeptabel, weil nicht vermeidbar. Ein Service Worker wird erst bei einem erfolgreichen Laden installiert. Vorher liegt kein Code von Relay auf dem Gerät, der eine eigene Offline-Seite zeigen könnte. Die Gegenmaßnahme ist organisatorisch: Die Ticket-Mail bittet, Relay vorab einmal online zu öffnen. Der Hinweis „Relay ist jetzt auch ohne Netz verfügbar“ bestätigt danach, dass das Gerät bereit ist.

**Ergebnis:** Erwartetes Grenzverhalten, keine Relay-Oberfläche.

### Zusatzszenario 4: späte Raumänderung

**Ausgangslage:** Build v1 geladen, `/sessions/s01` zeigt den Hauptsaal. Danach liefert der Server einen Build v2, in dem s01 in Saal C liegt. Der Build v2 entstand nur für den Test, die Daten im Repository sind unverändert.

**Aktion:** Seite online neu geladen, dann „Aktualisieren“ gewählt.

**Beobachtet:** Nach dem Reload steht weiter der Hauptsaal da, dazu „Ein neuer Programmstand ist verfügbar“. Nach „Aktualisieren“ zeigt die Seite Saal C. In `relay-programmdaten` liegt nur noch der neue Katalog `conference-data-DOaEhNf0.js`.

**Ergebnis:** Verhalten wie entschieden. Das Szenario zeigt auch die Grenze: Ohne Klick oder ohne Netz bleibt der alte Raum sichtbar.

### Manueller Test mit Chrome DevTools: Abbruch mitten in der Nutzung

**Ausgangslage:** Chrome mit geöffneten DevTools, Relay über den Dev-Server (`npm run dev`, `localhost:5173`). `/programm` ist geladen, s01 steht in Mein Programm.

**Aktion:** Im Network-Tab die Drosselung auf „Offline“ gestellt, „Keep log“ an, die Seite nicht neu geladen.

**Beobachtet:** Die Übersicht bleibt mit „20 von 20 Sessions“ bedienbar, der Offline-Hinweis erscheint sofort. Das Log zeigt nur `devtools-overlay.css` der DevTools selbst, keine Anfrage von Relay. Chrome bietet in der Adressleiste „Install“ an ([Screenshot](assets/devtools-offline-dev-server.webp)).

**Einordnung:** Belegt den schlimmsten Fall aus dem Konzept: Ein Abbruch während der Nutzung braucht kein Netz, weil die App schon geladen ist. Szenario 1 belegt der Test nicht, denn im Dev-Server läuft kein Service Worker. Ein Reload würde dort scheitern.
