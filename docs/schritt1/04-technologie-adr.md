# ADR: Projekt-Setup

## Kontext

Relay braucht mehrere Seitentypen: eine Startseite, eine Programmübersicht, eine Detailseite pro Session und ein persönliches Dashboard. Der Kurs behandelt Rendering-Strategien erst in Schritt 2. In diesem Schritt zählt nur, wie das Projekt aufgesetzt wird und wie die Navigation zwischen diesen Seiten entsteht. Das Repository steht bereits auf Vue 3 und Vite, ohne Router. Die Einarbeitung in Vue Router oder Nuxt Routing passiert im Team, der Kurs behandelt sie nicht gesondert.

## Optionen

**Option 1: Nuxt.** Dateibasiertes Routing würde die vier Seitentypen ohne eigene Router-Datei abbilden, und spätere Rendering-Strategien wären im Framework angelegt. Der Preis ist ein zweites Setup neben dem bestehenden Vite-Projekt, plus Konventionen, die wir in Schritt 1 nicht nutzen. SSR, SSG und Hybrid-Rendering sind ausdrücklich nicht Teil dieser Entscheidung.

**Option 2: Vue und Vite ohne Router.** Die Seite bleibt eine einzelne View, und Detail oder Dashboard wären Zustände in einer Komponente. Das vermeidet eine Abhängigkeit. Sobald eine Session eine eigene Adresse haben soll, fehlt die URL, und der Zurück-Button des Browsers kennt die Auswahl nicht. Für ein persönliches Programm, das man verlinken können soll, ist das zu wenig.

**Option 3: Vue 3, Vite und Vue Router.** Die vier Seitentypen werden explizite Routen. Das bestehende Setup bleibt, es kommt eine Abhängigkeit dazu. Detailseiten bekommen eine Adresse mit der Session-ID. Rendering bleibt clientseitig, bis Schritt 2 eine andere Strategie begründet.

## Entscheidung

Wir nehmen Option 3. Vue Router wird in `src/router/index.js` definiert und in `src/main.js` mit `createApp(App).use(router)` eingehängt. Die Routen sind `/`, `/programm`, `/sessions/:id` und `/mein-programm`.

## Konsequenzen

Nuxt wird nicht eingeführt, auch nicht „schon einmal vorbereiten“. Wer in Schritt 2 SSR oder SSG will, entscheidet das dort neu, gegen diese Client-App. Ohne Router wäre die Detailseite keine eigene Adresse. Mit Router ist die Navigation im Grundgerüst sichtbar, die Seiten selbst bleiben Platzhalter. Die Programm-Liste, die Filter und das ausformulierte Dashboard sind nicht Teil dieses Setups.
