# Offline-Strategie: Konzept

## Nutzungssituation

Relay wird im Vortragssaal geöffnet. Das Konferenz-WLAN ist überlastet, zwischen zwei Sessions ist das Telefon im Flugmodus. Die schwierigste Lage ist nicht „kein Netz“, sondern ein WLAN, das verbunden meldet und nichts liefert. Wer zuerst das Netz fragt, wartet dann bis zum Timeout. Daraus folgt der Grundsatz: Was einmal auf dem Gerät liegt, kommt sofort aus dem Cache. Das Netz wird nur für Updates gebraucht.

## Strategien im Vergleich

**Cache-First** antwortet aus dem Cache und geht nur bei einem Fehlen ans Netz. Schnell und unabhängig vom WLAN, aber ein neuer Stand braucht einen eigenen Weg aufs Gerät.

**Stale-While-Revalidate** antwortet aus dem Cache und lädt parallel neu. Erst die nächste Anfrage sieht den neuen Stand. Das lohnt sich, wenn sich der Inhalt unter derselben URL ändert.

**Network-First** fragt zuerst das Netz und fällt erst nach Fehler oder Timeout auf den Cache zurück. Im Saal wartet man damit auf etwas, das längst auf dem Gerät liegt.

## Programmdaten: Sessions und Speaker

Nach der Veröffentlichung ändern sich Titel, Abstract und Bio nicht mehr. Der Build legt den Katalog in `assets/conference-data-<hash>.js`. Neuer Inhalt bekommt einen neuen Dateinamen, unter einer URL ändert sich nie etwas. **Entscheidung: Cache-First** in einem eigenen Cache `relay-programmdaten`, schon beim Install gefüllt. SWR würde bei jedem Aufruf eine Anfrage schicken, deren Antwort feststeht.

Neue Stände kommen über das Update des Service Workers. Er lädt im Hintergrund, die Seite bietet „Aktualisieren“ an. Für den ganzen Build wirkt das wie Stale-While-Revalidate, nur ohne Reload mitten in einer Session.

**Wann SWR nötig wäre:** Wenn Raumänderungen am Konferenztag ohne neuen Build erscheinen, etwa über einen Endpunkt `/api/programm`, ändert sich der Inhalt unter derselben URL. Dieser Teil gehört dann auf SWR, damit der nächste Aufruf den neuen Raum zeigt. Relay hat kein solches Backend, Änderungen laufen laut Schritt 2 über den Build.

## Mein Programm

Die gespeicherten IDs liegen schon in `localStorage` und brauchen keinen Service-Worker-Cache. Die Lücke ist die Seite drumherum: Ohne Regel liefert `/mein-programm` offline die Fehlerseite des Browsers. **Entscheidung: App-Shell-Fallback.** Jede Navigation bekommt die vorgeladene `index.html`, der Router zeigt die Route, die Liste kommt aus `localStorage` und den gecachten Programmdaten. Hinzufügen und Entfernen gehen auch offline, weil kein Server abgeglichen werden muss.

## Statische Assets: App-Shell, Token-CSS, Icons

HTML, JS, CSS mit den Tokens, Icons und Manifest gehören zu genau einem Build. **Entscheidung: Precache**, also Cache-First mit Revision aus dem Build-Hash. Alles wird beim Install geladen. Fehlt eine Datei, schlägt der Install fehl und der alte Stand bleibt aktiv, eine halbe App-Shell gibt es nicht. Webfonts gibt es keine, die Token-Fonts sind Systemschriften.

## Schlimmster Fall

Bricht die Verbindung mitten in der Nutzung ab, ändert sich für Relay nur der Offline-Hinweis. Navigation, Programmdaten und Mein Programm liegen auf dem Gerät. Es fallen nur Updates und der allererste Besuch aus. Ohne ersten Online-Besuch gibt es keinen Service Worker und keinen Cache. Der Hinweis „Relay vorab einmal online öffnen“ gehört deshalb in die Ticket-Mail.
