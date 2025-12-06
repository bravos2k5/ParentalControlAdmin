<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo and branding -->
      <div class="login-brand">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>
        <h1>Parental Control</h1>
        <p>Admin Panel</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <h2>Welcome Back</h2>
          <p>Enter your authentication token to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="token">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Authentication Token
            </label>
            <div class="input-wrapper">
              <input
                id="token"
                v-model="token"
                :type="showToken ? 'text' : 'password'"
                placeholder="Enter your secret token"
                required
                :disabled="loading"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-visibility"
                @click="showToken = !showToken"
                :aria-label="showToken ? 'Hide token' : 'Show token'"
              >
                <svg v-if="showToken" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-login" :disabled="loading || !token.trim()">
            <span v-if="loading" class="spinner"></span>
            <span v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>Secured with token-based authentication</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/client'

const router = useRouter()
const authStore = useAuthStore()

const token = ref('')
const loading = ref(false)
const error = ref('')
const showToken = ref(false)

async function handleLogin() {
  if (!token.value.trim()) return

  loading.value = true
  error.value = ''

  try {
    // Test the token by making a request
    apiClient.defaults.headers['Authorization'] = token.value
    await apiClient.get('/sessions')

    // If successful, store the token and redirect
    authStore.login(token.value)
    router.push('/dashboard')
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Invalid authentication token'
    } else if (err.code === 'ERR_NETWORK') {
      error.value = 'Unable to connect to server. Please check your connection.'
    } else {
      error.value = err.response?.data?.message || 'Authentication failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  padding: var(--space-6);
}

.login-container {
  width: 100%;
  max-width: 400px;
  animation: slideIn var(--transition-slow);
}

.login-brand {
  text-align: center;
  margin-bottom: var(--space-8);
  color: white;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-4);
  backdrop-filter: blur(10px);
}

.brand-icon svg {
  color: white;
}

.login-brand h1 {
  font-size: 1.75rem;
  color: white;
  margin-bottom: var(--space-2);
}

.login-brand p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9375rem;
}

.login-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.card-header {
  padding: var(--space-8) var(--space-8) var(--space-6);
  text-align: center;
}

.card-header h2 {
  font-size: 1.375rem;
  margin-bottom: var(--space-2);
}

.card-header p {
  font-size: 0.875rem;
}

.login-form {
  padding: 0 var(--space-8) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  padding-right: 48px;
}

.toggle-visibility {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color var(--transition);
}

.toggle-visibility:hover {
  color: var(--text-primary);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--danger-light);
  color: #991b1b;
  border-radius: var(--radius);
  font-size: 0.875rem;
  animation: slideIn var(--transition);
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.login-footer {
  text-align: center;
  margin-top: var(--space-6);
}

.login-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8125rem;
}

@media (max-width: 480px) {
  .login-page {
    padding: var(--space-4);
  }

  .card-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
  }

  .login-form {
    padding: 0 var(--space-6) var(--space-6);
  }
}
</style>
