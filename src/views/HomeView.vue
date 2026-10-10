<script setup>
import BaseBadge from '../components/base/BaseBadge.vue'
import { useConferenceData } from '../composables/useConferenceData'

const { conference, sessions } = useConferenceData()
</script>

<template>
  <section class="home">
    <BaseBadge>{{ conference.name }}</BaseBadge>
    <h1>Relay</h1>
    <p>Dein Programm für die Konferenz, zusammengestellt wie ein Line-up.</p>
    <p>{{ sessions.length }} Sessions</p>
  </section>
</template>

<style scoped>
.home {
  display: grid;
  gap: var(--space-4);
  max-width: 38rem;
}

h1 {
  margin: 0;
  font-size: var(--font-size-display);
}

p {
  margin: 0;
}
</style>
