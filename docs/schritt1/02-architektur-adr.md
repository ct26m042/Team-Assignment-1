# ADR: Komponenten- und Ordnerstruktur

## Kontext

Relay zeigt die Konferenz FrontendNow in vier Oberflächen: Start, Programmübersicht, Session-Detail und „Mein Programm“. Dieselben Session-Daten erscheinen an mehreren Stellen, und „Zum Programm hinzufügen“ muss auf der Karte, auf der Detailseite und im persönlichen Programm dasselbe tun. Die Ordnerstruktur muss diese Schichten sichtbar machen, bevor die Features in Schritt 2 gebaut werden. Eine flache Ablage aller `.vue`-Dateien würde die Grenze zwischen allgemeiner Oberfläche und Konferenzlogik erst im Code verstecken.

## Optionen

**Option 1: Flacher `components/`-Ordner.** Jede Komponente liegt nebeneinander, Views liegen daneben oder fehlen ganz. Der Einstieg ist kurz, und bei zwanzig Dateien findet man den Namen über die Suche. Der Preis kommt später: `BaseButton` und `SessionCard` stehen auf einer Ebene, obwohl nur die Karte den Datensatz kennt. Neue Teammitglieder können nicht an der Ordnergrenze ablesen, was sie anfassen dürfen, ohne die Konferenz zu kennen.

**Option 2: Drei Schichten, base, layout und feature.** `components/base` enthält Bausteine ohne Konferenzwissen, etwa Button und Badge. `components/layout` setzt den Rahmen, also Kopfzeile und Seitenhülle. `components/feature` enthält Bausteine, die Sessions, Tracks oder das persönliche Programm kennen. Views in `src/views` orchestrieren nur: Sie lesen Composables und setzen Feature-Komponenten zusammen. `src/composables` hält die Logik, `src/router` die Routen, `src/data` den statischen Datensatz.

Für die zentrale Interaktion „Zum Programm hinzufügen“ stehen zwei Zuschnitte zur Wahl.

**Gekoppelte Komponente.** Eine `AddToProgramButton` lädt `localStorage`, prüft die ID und zeichnet den Button. Das ist eine Datei weniger. Dieselbe Prüfung müsste die Detailseite und das Dashboard aber noch einmal bauen, oder sie müssten den Button auch dort einsetzen, selbst wenn die Darstellung anders sein soll.

**Headless-Aufteilung.** `useMyProgram()` kennt IDs, Persistenz und die drei Operationen `add`, `remove` und `has`. Die Darstellung bleibt in der jeweiligen Komponente und kann ausgetauscht werden, ohne die Speicherlogik anzufassen. Für die Session-Filterung gilt das Gegenteil: Ein Filter hat in diesem Schritt genau einen Ort, die Programm-View. Eine eigene Composable dafür würde Logik von einer Darstellung trennen, die es nur einmal gibt.

## Entscheidung

Wir nehmen Option 2, die drei Schichten. „Zum Programm hinzufügen“ wird headless über `useMyProgram()` gebaut. Die Session-Filterung bleibt lokaler Zustand der Programm-View, bis eine zweite Oberfläche denselben Filter braucht.

## Konsequenzen

Feature-Komponenten dürfen Base- und Layout-Bausteine verwenden, Base-Bausteine importieren nichts aus `feature` oder `composables`. Wer eine Farbe oder einen Abstand braucht, liest semantische Tokens, nicht den Datensatz. Der Ordner `components/feature` bleibt im Grundgerüst leer und ist für die Session-Karten in Schritt 2 reserviert. Der Headless-Schnitt macht „Mein Programm“ an drei Stellen benutzbar, erzeugt aber eine kleine API, die man dokumentieren muss. Die Filter-Entscheidung verhindert, dass jede Interaktion vorsorglich in eine Composable wandert.

## Komponentenübersicht

- `BaseButton`, `BaseBadge` in `components/base`: ohne Konferenzwissen.
- `AppHeader`, `AppShell` in `components/layout`: Marke, Navigation, Seitenrahmen.
- `useConferenceData`, `useMyProgram` in `composables`: Datensatz und persönliche IDs.
- `HomeView`, `ProgramView`, `SessionDetailView`, `MyProgramView` in `views`: je eine Route, keine eigene Datenhaltung.
- `components/feature`: reserviert. Im Repository liegt nur `.gitkeep`, damit der Ordner sichtbar bleibt.
