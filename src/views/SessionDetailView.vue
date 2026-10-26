<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseBadge from '../components/base/BaseBadge.vue'
import ProgramToggleButton from '../components/feature/ProgramToggleButton.vue'
import { useConferenceData } from '../composables/useConferenceData'
import { formatDay } from '../utils/formatDay'

const route = useRoute()
const { sessionById, trackById, roomById, speakersForSession } = useConferenceData()

const id = computed(() => String(route.params.id))
const session = computed(() => sessionById(id.value))
const track = computed(() => (session.value ? trackById(session.value.trackId) : undefined))
const room = computed(() => (session.value ? roomById(session.value.roomId) : undefined))
const speakers = computed(() => (session.value ? speakersForSession(session.value) : []))
</script>

<template>
  <section v-if="session" class="session">
    <p class="session__back">
      <RouterLink :to="{ name: 'program' }">Zur Übersicht</RouterLink>
    </p>
    <div class="session__meta">
      <BaseBadge>{{ session.level }}</BaseBadge>
      <BaseBadge>{{ session.format }}</BaseBadge>
    </div>
    <h1>{{ session.title }}</h1>
    <p class="session__abstract">{{ session.abstract }}</p>
    <dl class="session__facts">
      <div>
        <dt>Zeit</dt>
        <dd>{{ formatDay(session.day) }}, {{ session.startTime }}–{{ session.endTime }}</dd>
      </div>
      <div>
        <dt>Raum</dt>
        <dd>{{ room?.name }}</dd>
      </div>
      <div>
        <dt>Track</dt>
        <dd>{{ track?.name }}</dd>
      </div>
    </dl>
    <div v-if="speakers.length" class="session__speakers">
      <h2>Speaker</h2>
      <ul>
        <li v-for="speaker in speakers" :key="speaker.id">
          <RouterLink :to="{ name: 'speaker', params: { id: speaker.id } }">
            {{ speaker.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
    <ProgramToggleButton class="session__action" :session-id="id" />
  </section>
  <section v-else class="session">
    <h1>Session nicht gefunden</h1>
    <RouterLink :to="{ name: 'program' }">Zur Übersicht</RouterLink>
  </section>
</template>

<style scoped>
.session {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
  max-width: 38rem;
}

.session h1,
.session h2,
.session p {
  margin: 0;
}

.session h1 {
  font-size: var(--font-size-xl);
}

.session h2 {
  margin-bottom: var(--space-2);
  font-size: var(--font-size-lg);
}

.session__back,
.session__abstract {
  color: var(--color-text-muted);
}

.session__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.session__facts {
  display: grid;
  gap: var(--space-3);
  margin: 0;
}

.session__facts div {
  display: grid;
  gap: var(--space-1);
}

.session__facts dt {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.session__facts dd {
  margin: 0;
}

.session__speakers ul {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.session__action {
  justify-self: start;
}
</style>
