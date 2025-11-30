import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sessionApi } from '@/api/session'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchSessions() {
    loading.value = true
    error.value = null
    try {
      sessions.value = await sessionApi.getAllSessions()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching sessions:', err)
    } finally {
      loading.value = false
    }
  }

  async function deleteSession(sessionId) {
    try {
      await sessionApi.deleteSession(sessionId)
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteAllSessions() {
    try {
      await sessionApi.deleteAllSessions()
      sessions.value = []
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    deleteSession,
    deleteAllSessions
  }
})

