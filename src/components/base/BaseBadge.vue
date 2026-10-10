<template>
  <span class="badge">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
