# PWA-Setup

**Tooling.** `vite-plugin-pwa` mit `strategies: 'injectManifest'`. Das Plugin erzeugt aus dem Build nur die Precache-Liste. Die Caching-Regeln stehen in unserem eigenen [`src/sw.js`](../../src/sw.js), damit jede Regel einer Entscheidung aus dem Konzept zugeordnet werden kann. Mit `generateSW` lägen die Regeln als Optionen in der Vite-Config. Registriert wird über `useRegisterSW` in [`PwaStatus.vue`](../../src/components/layout/PwaStatus.vue), mit `registerType: 'prompt'`.

**Manifest.** [`public/manifest.webmanifest`](../../public/manifest.webmanifest): Name „Relay – FrontendNow Programm“, Kurzname „Relay“, `start_url` und `scope` `/`, `display: "standalone"`, `lang: "de"`.

**Farben.** `theme_color` `#0c5c56` ist `--color-teal` hinter `--color-accent`. `background_color` `#f4f1ea` ist `--color-paper` hinter `--color-surface`. Der Splash-Screen zeigt damit dieselbe Papierfläche wie die App, die Statusleiste das Petrol der Buttons.

**Icons.** 192 und 512 Pixel, dazu ein maskierbares 512er mit Schutzzone. Ein Serifen-„R“ in Papier auf Petrol, wie der Markenname im Header.
