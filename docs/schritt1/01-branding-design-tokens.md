# Branding und Design-Tokens

## Markenkonzept

Relay ist die Programmoberfläche für die Konferenz FrontendNow. Der Name beschreibt, was die Seite tut: Sie reicht eine Session von der öffentlichen Liste in ein persönliches Programm weiter, wie ein Line-up, das man selbst zusammenstellt. Eine krasse Konferenz-Website zeigt Zeitplan, Räume und Sprecher als Tabelle und überlässt die Auswahl dem Ausdruck oder dem Gedächtnis. Relay behandelt die Auswahl als den eigentlichen Inhalt. Die Übersicht bleibt ruhig und lesbar, die Aktion „Zum Programm hinzufügen“ ist der Akzent, nicht eine weitere Kachel in einem Raster aus gleich lauten Karten.

Die visuelle Richtung ist Papier und Druckfarbe, nicht das übliche Produkt-Blau. Der Hintergrund ist ein warmes Papier (`color-paper`), der Text ein fast schwarzes Grün (`color-ink`), der Akzent ein tiefes Petrol (`color-teal`). Serifen nur für den Markennamen, die Oberfläche selbst bleibt in einer System-Sans, damit Session-Titel in langen Listen nicht ornamental werden. Abstände folgen einer festen Skala, damit Karten, Navigation und spätere Filter dieselben Rhythmen nutzen, ohne dass jede View eigene Pixelwerte erfindet.

## Token-Architektur

Die Tokens liegen doppelt vor, mit demselben Inhalt: `tokens/tokens.json` benennt die Quelle, `src/assets/tokens.css` ist das, was der Browser wirklich anwendet. In beiden Dateien gibt es zwei Schichten.

Primitive Tokens sind Rohwerte ohne Aufgabe. Dazu gehören die fünf Farben, die Spacing-Skala von `--space-1` (0.25rem) bis `--space-8` (4rem) und die Schriftgrößen von `--font-size-sm` bis `--font-size-2xl`. Wer einen neuen Rohwert braucht, legt ihn hier ab und nirgends sonst.

Semantische Tokens benennen den Zweck und verweisen nur auf primitive Tokens. `--color-surface` zeigt auf Papier, `--color-text-primary` auf Tinte, `--color-text-muted` auf Grau-Grün, `--color-accent` auf Petrol, `--color-on-accent` auf Papier, `--color-border` auf Sand. `--space-page` zeigt auf `--space-6`, `--font-body` auf die Sans, `--font-display` auf die Serife. Komponenten dürfen nur diese Namen verwenden. Ein direktes `#0c5c56` in einer Vue-Datei wäre ein Bruch der Regel, weil der Verwendungszweck dann wieder im Komponenten-Code steckt.

Ein späterer Dark Mode braucht keine neue Namensschicht. Ein Block `[data-theme="dark"]` setzt dieselben semantischen Properties auf andere primitive Werte, zum Beispiel eine dunkle Fläche und eine helle Tinte. Komponenten, die `--color-surface` und `--color-text-primary` lesen, folgen automatisch. Die dunkle Palette ist in diesem Schritt bewusst nicht ausformuliert. Die Struktur ist vorbereitet, die Werte fehlen, bis Kontrast und Elevation dafür geprüft sind.

## Drei Kriterien

Wartbarkeit: Rohwerte existieren einmal. Ändert sich das Petrol, ändern sich Akzent und jeder Button, der `--color-accent` liest, an derselben Stelle.

Theming-Erweiterbarkeit: Die Trennung von Wert und Zweck ist die Stelle, an der ein Theme andockt. Semantische Namen bleiben stabil, nur die Zuweisung wechselt.

Konsistenz: Spacing und Typografie sind geschlossen. `--space-page` ist der Seitenrand überall, nicht einmal 2rem und einmal 28px. Dieselbe Regel gilt für Fließtext und Display.

## Kontrast

Geprüft nach WCAG 2.1, Erfolgskriterium 1.4.3, Stufe AA: mindestens 4.5:1 für normalen Text. Die Verhältnisse sind aus den relativen Leuchtdichten der Hex-Werte berechnet, nach derselben Formel, die der WebAIM Contrast Checker verwendet.

| Paar | Vordergrund | Hintergrund | Verhältnis |
| --- | --- | --- | --- |
| Primärtext auf Fläche | `#14211F` | `#F4F1EA` | 14.69:1 |
| Gedämpfter Text auf Fläche | `#4E5A53` | `#F4F1EA` | 6.39:1 |
| Akzenttext auf Fläche | `#0C5C56` | `#F4F1EA` | 6.94:1 |
| Fläche auf Akzent (Button) | `#F4F1EA` | `#0C5C56` | 6.94:1 |
| Primärtext auf Rahmenfläche | `#14211F` | `#E4DDD0` | 12.27:1 |

Alle Paare, die als Text eingesetzt werden, liegen über 4.5:1. Der Akzent ist dunkel genug, um als Link oder Button-Beschriftung auf Papier zu stehen, und helles Papier bleibt auf dem Petrol lesbar. Es war kein Wert nachzuziehen.
