<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Ohne vorherige Seite in der App (z. B. Direktaufruf) zurück zur Programmübersicht.
function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'program' })
  }
}
</script>

<template>
  <button class="back" type="button" @click="goBack">← Zurück</button>
</template>

<style scoped>
.back {
  justify-self: start;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
}
</style>
