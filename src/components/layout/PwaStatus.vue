<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

// navigator.onLine meldet nur „kein Netz“ verlässlich. Bei schwachem WLAN bleibt es true,
// darum ist der Hinweis nur Information: Die Inhalte kommen in beiden Fällen aus dem Cache.
const online = ref(navigator.onLine)
const updateOnline = () => {
  online.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnline)
  window.addEventListener('offline', updateOnline)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
})

function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div class="pwa" aria-live="polite">
    <p v-if="!online" class="pwa__box pwa__text">
      Offline. Du siehst den zuletzt geladenen Programmstand, Mein Programm bleibt auf diesem Gerät.
    </p>
    <div v-if="offlineReady || needRefresh" class="pwa__box" role="status">
      <p v-if="needRefresh" class="pwa__text">Ein neuer Programmstand ist verfügbar.</p>
      <p v-else class="pwa__text">Relay ist jetzt auch ohne Netz verfügbar.</p>
      <button v-if="needRefresh" class="pwa__button" type="button" @click="updateServiceWorker(true)">
        Aktualisieren
      </button>
      <button class="pwa__button pwa__button--quiet" type="button" @click="close">Schließen</button>
    </div>
  </div>
</template>

<style scoped>
.pwa {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  left: var(--space-4);
  display: grid;
  gap: var(--space-2);
  max-width: 28rem;
  margin-left: auto;
  pointer-events: none;
}

.pwa__box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--space-2);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  pointer-events: auto;
}

.pwa__text {
  flex: 1 1 12rem;
  margin: 0;
}

.pwa__button {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-accent);
  border-radius: var(--space-1);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font: inherit;
  cursor: pointer;
}

.pwa__button--quiet {
  background: transparent;
  color: var(--color-accent);
}
</style>
