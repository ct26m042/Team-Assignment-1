<script setup>
import { computed } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import { useMyProgram } from '../../composables/useMyProgram'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})

const { has, add, remove } = useMyProgram()

const saved = computed(() => has(props.sessionId))

function toggle() {
  if (saved.value) {
    remove(props.sessionId)
  } else {
    add(props.sessionId)
  }
}
</script>

<template>
  <BaseButton type="button" @click="toggle">
    {{ saved ? 'Entfernen' : 'Zu meinem Programm hinzufügen' }}
  </BaseButton>
</template>
