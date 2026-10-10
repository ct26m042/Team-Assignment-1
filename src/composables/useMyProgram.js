import { computed, ref } from 'vue'
import { useConferenceData } from './useConferenceData'

const STORAGE_KEY = 'relay.myProgram.v1'

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

const { sessions } = useConferenceData()
const knownIds = new Set(sessions.map((session) => session.id))

function keepKnown(ids) {
  return ids.filter((id) => knownIds.has(id))
}

const initialIds = keepKnown(readIds())
const ids = ref(initialIds)

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
}

if (initialIds.length !== readIds().length) {
  persist()
}

function has(id) {
  return ids.value.includes(id)
}

function add(id) {
  if (!knownIds.has(id) || has(id)) {
    return
  }
  ids.value = [...ids.value, id]
  persist()
}

function remove(id) {
  if (!has(id)) {
    return
  }
  ids.value = ids.value.filter((item) => item !== id)
  persist()
}

export function useMyProgram() {
  return {
    ids,
    count: computed(() => ids.value.length),
    has,
    add,
    remove,
  }
}
