<script setup>
import { computed, reactive } from 'vue'
import SessionCard from '../components/feature/SessionCard.vue'
import { useConferenceData } from '../composables/useConferenceData'
import { formatDay } from '../utils/formatDay'

const { sessions, tracks, days, levels } = useConferenceData()

const filters = reactive({
  trackId: 'all',
  day: 'all',
  level: 'all',
})

const isFiltered = computed(() => Object.values(filters).some((value) => value !== 'all'))

function resetFilters() {
  filters.trackId = 'all'
  filters.day = 'all'
  filters.level = 'all'
}

const visible = computed(() =>
  sessions.filter((session) => {
    const trackOk = filters.trackId === 'all' || session.trackId === filters.trackId
    const dayOk = filters.day === 'all' || session.day === filters.day
    const levelOk = filters.level === 'all' || session.level === filters.level
    return trackOk && dayOk && levelOk
  }),
)
</script>

<template>
  <section class="program">
    <header class="program__header">
      <h1>Programm</h1>
      <p>Alle Sessions der FrontendNow, filterbar nach Track, Tag und Level.</p>
    </header>

    <form class="filters" @submit.prevent>
      <label class="filters__field">
        Track
        <select v-model="filters.trackId">
          <option value="all">Alle Tracks</option>
          <option v-for="track in tracks" :key="track.id" :value="track.id">
            {{ track.name }}
          </option>
        </select>
      </label>
      <label class="filters__field">
        Tag
        <select v-model="filters.day">
          <option value="all">Alle Tage</option>
          <option v-for="day in days" :key="day" :value="day">
            {{ formatDay(day) }}
          </option>
        </select>
      </label>
      <label class="filters__field">
        Level
        <select v-model="filters.level">
          <option value="all">Alle Level</option>
          <option v-for="level in levels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </label>
      <button type="button" class="filters__reset" :disabled="!isFiltered" @click="resetFilters">
        Filter zurücksetzen
      </button>
    </form>

    <p class="program__count">{{ visible.length }} von {{ sessions.length }} Sessions</p>

    <ul v-if="visible.length" class="program__list">
      <li v-for="session in visible" :key="session.id">
        <SessionCard :session="session" />
      </li>
    </ul>
    <p v-else class="program__empty">Keine Session passt zu dieser Kombination.</p>
  </section>
</template>

<style scoped>
.program {
  display: grid;
  gap: var(--space-5);
}

.program__header h1,
.program__header p,
.program__count,
.program__empty {
  margin: 0;
}

.program__header h1 {
  font-size: var(--font-size-xl);
}

.program__header {
  display: grid;
  gap: var(--space-2);
}

.program__header p,
.program__count,
.program__empty {
  color: var(--color-text-muted);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.filters__field {
  display: grid;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.filters__field select {
  font: inherit;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-3);
}

.filters__reset {
  align-self: end;
  font: inherit;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
}

.filters__reset:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.program__list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
