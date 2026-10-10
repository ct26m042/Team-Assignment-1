<script setup>
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="shell">
    <AppHeader />
    <main class="shell__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.shell__main {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-page);
}
</style>
