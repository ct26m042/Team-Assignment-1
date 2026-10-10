<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '../components/base/BaseButton.vue'
import { useMyProgram } from '../composables/useMyProgram'

const route = useRoute()
const { has, add, remove } = useMyProgram()
const id = computed(() => String(route.params.id))
const saved = computed(() => has(id.value))

function toggle() {
  if (saved.value) {
    remove(id.value)
  } else {
    add(id.value)
  }
}
</script>

<template>
  <section class="session">
    <h1>Session</h1>
    <p>{{ id }}</p>
    <BaseButton type="button" @click="toggle">
      {{ saved ? 'Aus dem Programm nehmen' : 'Zum Programm hinzufügen' }}
    </BaseButton>
  </section>
</template>

<style scoped>
.session {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
}

h1,
p {
  margin: 0;
}

h1 {
  font-size: var(--font-size-xl);
}
</style>
