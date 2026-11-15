import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Eigener Service Worker (src/sw.js), das Plugin ergänzt nur die Precache-Liste.
    // Das Manifest liegt von Hand unter public/manifest.webmanifest.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'prompt',
      injectRegister: false,
      manifest: false,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,webmanifest}'],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Sessions und Speaker landen in einem eigenen Chunk, damit der Service Worker
        // sie als eigenen Datentyp erkennt und getrennt von der App-Shell cacht.
        manualChunks(id) {
          if (id.endsWith('conference-data.json')) {
            return 'conference-data'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
