<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button class="button" :type="type">
    <slot />
  </button>
</template>

<style scoped>
.button {
  border: 0;
  border-radius: 999px;
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
}
</style>
