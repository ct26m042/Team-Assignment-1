<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SessionCard from '../components/feature/SessionCard.vue'
import { useConferenceData } from '../composables/useConferenceData'
import { useMyProgram } from '../composables/useMyProgram'

const { sessionById } = useConferenceData()
const { ids } = useMyProgram()

const saved = computed(() => ids.value.map((id) => sessionById(id)).filter(Boolean))
</script>

<template>
  <section class="mine">
    <header class="mine__header">
      <h1>Mein Programm</h1>
      <p v-if="saved.length">
        {{ saved.length }}
        {{ saved.length === 1 ? 'gespeicherte Session' : 'gespeicherte Sessions' }}
      </p>
    </header>
    <ul v-if="saved.length" class="mine__list">
      <li v-for="session in saved" :key="session.id">
        <SessionCard :session="session" />
      </li>
    </ul>
    <p v-else class="mine__empty">
      Noch keine Session gespeichert.
      <RouterLink :to="{ name: 'program' }">Zum Programm</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.mine {
  display: grid;
  gap: var(--space-5);
}

.mine__header {
  display: grid;
  gap: var(--space-2);
}

.mine h1,
.mine p {
  margin: 0;
}

.mine h1 {
  font-size: var(--font-size-xl);
}

.mine__header p,
.mine__empty {
  color: var(--color-text-muted);
}

.mine__list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
