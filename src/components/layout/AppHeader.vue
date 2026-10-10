<script setup>
import { RouterLink } from 'vue-router'

const links = [
  { to: '/', label: 'Start' },
  { to: '/programm', label: 'Programm' },
  { to: '/mein-programm', label: 'Mein Programm' },
]
</script>

<template>
  <header class="header">
    <RouterLink class="brand" to="/">Relay</RouterLink>
    <nav class="nav" aria-label="Hauptnavigation">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        class="nav__link"
        :to="link.to"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-5) var(--space-page);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  color: var(--color-text-primary);
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  text-decoration: none;
}

.nav {
  display: flex;
  gap: var(--space-4);
}

.nav__link {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.nav__link.router-link-active {
  color: var(--color-accent);
}
</style>
