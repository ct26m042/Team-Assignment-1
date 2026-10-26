<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseBadge from '../base/BaseBadge.vue'
import BaseButton from '../base/BaseButton.vue'
import { useConferenceData } from '../../composables/useConferenceData'
import { useMyProgram } from '../../composables/useMyProgram'
import { formatDay } from '../../utils/formatDay'

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
})

const { trackById, roomById, speakersForSession } = useConferenceData()
const { has, add, remove } = useMyProgram()

const track = computed(() => trackById(props.session.trackId))
const room = computed(() => roomById(props.session.roomId))
const speakers = computed(() => speakersForSession(props.session))
const saved = computed(() => has(props.session.id))

function toggle() {
  if (saved.value) {
    remove(props.session.id)
  } else {
    add(props.session.id)
  }
}
</script>

<template>
  <article class="card">
    <div class="card__meta">
      <BaseBadge>{{ session.level }}</BaseBadge>
      <p class="card__when">
        {{ formatDay(session.day) }}, {{ session.startTime }}–{{ session.endTime }}
      </p>
    </div>
    <h2 class="card__title">
      <RouterLink :to="{ name: 'session', params: { id: session.id } }">
        {{ session.title }}
      </RouterLink>
    </h2>
    <p class="card__place">{{ track?.name }} · {{ room?.name }}</p>
    <p v-if="speakers.length" class="card__speakers">
      <RouterLink
        v-for="speaker in speakers"
        :key="speaker.id"
        :to="{ name: 'speaker', params: { id: speaker.id } }"
      >
        {{ speaker.name }}
      </RouterLink>
    </p>
    <BaseButton class="card__action" type="button" @click="toggle">
      {{ saved ? 'Entfernen' : 'Zu meinem Programm hinzufügen' }}
    </BaseButton>
  </article>
</template>

<style scoped>
.card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.card__when,
.card__place,
.card__speakers {
  margin: 0;
}

.card__when,
.card__place {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.card__title {
  margin: 0;
  font-size: var(--font-size-lg);
}

.card__title a {
  color: var(--color-text-primary);
  text-decoration: none;
}

.card__title a:hover {
  color: var(--color-accent);
}

.card__speakers a:not(:last-child)::after {
  content: ', ';
  color: var(--color-text-muted);
}

.card__action {
  justify-self: start;
}
</style>
