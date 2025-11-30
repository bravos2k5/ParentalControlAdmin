import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '')
  const isAuthenticated = computed(() => !!token.value)

  function login(authToken) {
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('auth_token')
  }

  return {
    token,
    isAuthenticated,
    login,
    logout
  }
})

