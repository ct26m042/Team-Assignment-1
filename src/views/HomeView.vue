<script setup>
import BaseBadge from '../components/base/BaseBadge.vue'
</script>

<template>
  <section class="home">
    <BaseBadge>FrontendNow</BaseBadge>
    <h1>Relay</h1>
    <p>
      Dein Programm für die Konferenz, zusammengestellt wie ein Line-up.
    </p>
  </section>
</template>

<style scoped>
.home {
  display: grid;
  gap: var(--space-4);
  max-width: 38rem;
}

h1 {
  margin: 0;
  font-size: var(--font-size-display);
}
</style>
