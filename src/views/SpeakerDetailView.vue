<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'
import { formatDay } from '../utils/formatDay'

const route = useRoute()
const { speakerById, sessionsForSpeaker } = useConferenceData()

const id = computed(() => String(route.params.id))
const speaker = computed(() => speakerById(id.value))
const sessions = computed(() => (speaker.value ? sessionsForSpeaker(speaker.value) : []))
</script>

<template>
  <section v-if="speaker" class="profile">
    <p class="profile__role">{{ speaker.title }}, {{ speaker.company }}</p>
    <h1>{{ speaker.name }}</h1>
    <p class="profile__bio">{{ speaker.bio }}</p>
    <h2>Sessions</h2>
    <ul v-if="sessions.length" class="profile__sessions">
      <li v-for="session in sessions" :key="session.id">
        <RouterLink :to="{ name: 'session', params: { id: session.id } }">
          {{ session.title }}
        </RouterLink>
        <span>{{ formatDay(session.day) }}, {{ session.startTime }}–{{ session.endTime }}</span>
      </li>
    </ul>
    <p v-else class="profile__empty">Keine Session zugeordnet.</p>
  </section>
  <section v-else class="profile">
    <h1>Speaker nicht gefunden</h1>
    <RouterLink :to="{ name: 'program' }">Zur Übersicht</RouterLink>
  </section>
</template>

<style scoped>
.profile {
  display: grid;
  gap: var(--space-4);
  max-width: 38rem;
}

.profile h1,
.profile h2,
.profile p {
  margin: 0;
}

.profile h1 {
  font-size: var(--font-size-xl);
}

.profile h2 {
  font-size: var(--font-size-lg);
}

.profile__role,
.profile__empty,
.profile__sessions span {
  color: var(--color-text-muted);
}

.profile__sessions {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.profile__sessions li {
  display: grid;
  gap: var(--space-1);
}

.profile__sessions span {
  font-size: var(--font-size-sm);
}
</style>
