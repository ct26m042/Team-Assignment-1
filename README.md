# Relay Setup

```sh
git clone https://github.com/ct26m042/Team-Assignment-1.git
npm install
npm run dev
```

Die Programmübersicht unter `/programm` liest den Session-Katalog beim Build aus `conference-data.json` (ISR, simuliert über den Vite-Build). Track, Tag und Level filtert der Browser lokal und UND-verknüpft (CSR). Die Begründung steht in [docs/schritt2/01-rendering-strategie-adr.md](docs/schritt2/01-rendering-strategie-adr.md).

Relay ist eine installierbare PWA. Der Service Worker entsteht nur im Build, Offline-Verhalten also mit `npm run build` und `npm run preview` prüfen. Die Caching-Regeln stehen in `src/sw.js`, Konzept, Protokoll und Testnachweis in [docs/schritt3](docs/schritt3).
