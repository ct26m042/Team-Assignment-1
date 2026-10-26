# ADR: Rendering-Strategie

## Einleitung

Eine Rendering-Strategie folgt aus den Daten. Drei Fragen entscheiden. Ändert sich der Inhalt zur Laufzeit nie, kann er beim Build entstehen. Liegt er nur im Browser und ist er pro Person verschieden, muss der Client ihn lesen. Kann er sich ändern und bleibt er für alle Besucher gleich, genügt eine zwischengespeicherte Seite, die bei einer Änderung neu entsteht. Relay hat kein Live-Backend. Der Katalog ist `conference-data.json`, das persönliche Programm liegt unter `relay.myProgram.v1` in `localStorage`. SSG und ISR meinen hier den Build-Import dieser Datei, nicht ein zweites Framework. Die vier Teile bekommen getrennte Strategien, weil ihre Daten sich nicht gleich verhalten.

## Speaker-Profile

Federführung: Knabel.

### Kontext

Ein Speaker-Profil zeigt Name, Titel, Firma, Bio und die Sessions dieser Person. Die 18 Profile stehen in `conference-data.json` und verweisen über IDs auf Sessions. Dieselben Angaben gelten für jeden Besucher. Eine Bio ändert sich nicht, während die Seite offen ist, und sie liegt nicht in `localStorage`. Der Katalog ist vor dem Start bekannt.

### Optionen

**SSG.** Die Profile entstehen beim Build aus der JSON. Jeder Besucher bekommt denselben Inhalt. Eine Änderung an Bio oder Zuordnung braucht einen neuen Build. Das passt zu Daten, die sich zur Laufzeit nicht ändern.

**SSR.** Jeder Aufruf würde das Profil neu zusammensetzen. Das lohnt sich, wenn der Inhalt vom Request abhängt. Die JSON ändert sich zwischen zwei Requests nicht. Ein Server würde dieselben Profile nur wiederholen.

**CSR.** Der Browser setzt das Profil nach dem Laden der App zusammen. Eine Bio ist kein Zustand, der erst im Browser existiert. Der erste Inhalt hinge am JavaScript, obwohl er beim Build schon feststand.

### Entscheidung

Speaker-Profile werden SSG. Die Generierung ist der Import von `conference-data.json` beim Vite-Build. Die Route `/speakers/:id` trägt `meta.rendering` mit dem Wert `ssg`. Es entstehen keine HTML-Dateien pro Speaker. Die SPA liefert die Hülle, die Daten stammen aus der eingebundenen Datei. Eine geänderte Bio wird mit dem nächsten Build sichtbar.

### Konsequenzen

Profilseiten lesen nur `useConferenceData()` und verlinken Sessions über IDs. Sie schreiben nichts in `localStorage`. Der erste Paint bleibt der der SPA, weil dieser Build keine einzelnen HTML-Dateien erzeugt. Die Entscheidung ist deshalb eine SSG-Simulation. Ein späteres Prerender kann dieselbe Route und dieselbe Datenquelle behalten.

## Session-Übersicht

Federführung: Knabel.

### Kontext

Die Programmübersicht zeigt alle 20 Sessions und filtert nach Track, Konferenztag und Level. Die Filter sind kombinierbar und UND-verknüpft. Der Katalog gilt für alle Besucher und stammt aus derselben JSON wie die Detailseiten. Track, Tag und Level sind Eigenschaften der Session. Der aktive Filter gehört nur zu dieser Ansicht.

### Optionen

**ISR für den Katalog, CSR für die Filter.** Die Liste entsteht aus dem Build-Stand der JSON und neu, wenn sich der Zeitplan ändert. Die drei Filter bleiben Zustand der Programm-View. Der Katalog bleibt für alle gleich, die Auswahl bleibt im Browser.

**CSR für die ganze Seite.** Weil die Filter Interaktion sind, läge auch der Katalog im Client, obwohl er für alle gleich ist und vor dem Besuch feststeht.

**SSR.** Jeder Aufruf würde die ungefilterte Liste neu bauen. Die Filter liefen trotzdem im Client, weil sie nicht zum Request gehören. Ohne Backend ist das Ergebnis nicht frischer als der Build.

### Entscheidung

Die Übersicht ist ISR für die 20 Sessions und CSR nur für den Filterzustand. `meta.rendering` der Route `/programm` ist `isr`. Die Filter bleiben in `ProgramView`, wie die Architektur-ADR festlegt. Eine reine CSR-Seite wäre nur wegen der Filter gewählt worden. Der Katalog ändert sich wie die Detailseiten und folgt derselben Datenstrategie.

### Konsequenzen

`useConferenceData()` liefert Sessions, Tracks, Tage und Level. Die View filtert lokal mit UND. Keine Treffer sind ein Zustand der View. Filter stehen nicht in der URL, weil Schritt 1 sie an diese eine Oberfläche gebunden hat. Eine Zeitplanänderung erreicht Übersicht und Detail mit demselben Build.
