<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section>
    <h1>Session</h1>
    <p>{{ route.params.id }}</p>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 0;
  font-size: var(--font-size-xl);
}
</style>
