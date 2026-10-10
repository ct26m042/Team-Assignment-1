<script setup>
import { useMyProgram } from '../composables/useMyProgram'

const { count } = useMyProgram()
</script>

<template>
  <section>
    <h1>Mein Programm</h1>
    <p>{{ count }} gespeicherte Sessions</p>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 0;
  font-size: var(--font-size-xl);
}
</style>
