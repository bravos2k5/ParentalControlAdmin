<template>
  <div class="access-control">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Access Control</h1>
        <p>Grant access, generate codes, or block devices</p>
      </div>
    </div>

    <!-- Control Cards -->
    <div class="control-grid">
      <!-- Generate Access Code -->
      <div class="control-card">
        <div class="card-icon generate">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="card-content">
          <h2>Generate Access Code</h2>
          <p>Create a time-limited code for device access</p>
        </div>

        <form @submit.prevent="handleGenerateCode" class="control-form">
          <div class="form-group">
            <label for="gen-device-id">Device ID</label>
            <input
              id="gen-device-id"
              v-model="generateForm.deviceId"
              type="text"
              placeholder="Enter device ID"
              required
              :disabled="generateForm.loading"
            />
          </div>

          <div class="form-group">
            <label>Duration</label>
            <div class="duration-input">
              <input
                v-model.number="generateForm.time"
                type="number"
                min="1"
                required
                :disabled="generateForm.loading"
              />
              <select v-model="generateForm.unit" :disabled="generateForm.loading">
                <option value="60">Minutes</option>
                <option value="3600">Hours</option>
              </select>
            </div>
          </div>

          <div class="quick-durations">
            <button
              v-for="preset in durationPresets"
              :key="'gen-' + preset.label"
              type="button"
              @click="applyPreset(generateForm, preset)"
              class="duration-preset"
              :disabled="generateForm.loading"
            >
              {{ preset.label }}
            </button>
          </div>

          <div v-if="generateForm.error" class="alert alert-error">
            {{ generateForm.error }}
          </div>

          <div v-if="generateForm.code" class="code-display">
            <span class="code-label">Access Code</span>
            <div class="code-value">
              <span>{{ generateForm.code }}</span>
              <button type="button" @click="copyCode(generateForm.code)" class="copy-btn" title="Copy code">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-full" :disabled="generateForm.loading">
            <svg v-if="!generateForm.loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span v-else class="spinner"></span>
            {{ generateForm.loading ? 'Generating...' : 'Generate Code' }}
          </button>
        </form>
      </div>

      <!-- Grant Access Directly -->
      <div class="control-card">
        <div class="card-icon grant">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="card-content">
          <h2>Grant Access</h2>
          <p>Allow immediate access to a connected device</p>
        </div>

        <form @submit.prevent="handleGrantAccess" class="control-form">
          <div class="form-group">
            <label for="grant-device-id">Device ID</label>
            <input
              id="grant-device-id"
              v-model="grantForm.deviceId"
              type="text"
              placeholder="Enter device ID"
              required
              :disabled="grantForm.loading"
            />
          </div>

          <div class="form-group">
            <label>Duration</label>
            <div class="duration-input">
              <input
                v-model.number="grantForm.time"
                type="number"
                min="1"
                required
                :disabled="grantForm.loading"
              />
              <select v-model="grantForm.unit" :disabled="grantForm.loading">
                <option value="60">Minutes</option>
                <option value="3600">Hours</option>
              </select>
            </div>
          </div>

          <div class="quick-durations">
            <button
              v-for="preset in durationPresets"
              :key="'grant-' + preset.label"
              type="button"
              @click="applyPreset(grantForm, preset)"
              class="duration-preset"
              :disabled="grantForm.loading"
            >
              {{ preset.label }}
            </button>
          </div>

          <div v-if="grantForm.error" class="alert alert-error">
            {{ grantForm.error }}
          </div>

          <div v-if="grantForm.success" class="alert alert-success">
            {{ grantForm.success }}
          </div>

          <button type="submit" class="btn btn-success w-full" :disabled="grantForm.loading">
            <svg v-if="!grantForm.loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-else class="spinner"></span>
            {{ grantForm.loading ? 'Processing...' : 'Grant Access' }}
          </button>
        </form>
      </div>

      <!-- Block Device -->
      <div class="control-card">
        <div class="card-icon block">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <div class="card-content">
          <h2>Block Device</h2>
          <p>Schedule a device to be blocked after a delay</p>
        </div>

        <form @submit.prevent="handleBlockDevice" class="control-form">
          <div class="form-group">
            <label for="block-device-id">Device ID</label>
            <input
              id="block-device-id"
              v-model="blockForm.deviceId"
              type="text"
              placeholder="Enter device ID"
              required
              :disabled="blockForm.loading"
            />
          </div>

          <div class="form-group">
            <label>Block After</label>
            <div class="duration-input">
              <input
                v-model.number="blockForm.time"
                type="number"
                min="0"
                required
                :disabled="blockForm.loading"
              />
              <select v-model="blockForm.unit" :disabled="blockForm.loading">
                <option value="60">Minutes</option>
                <option value="3600">Hours</option>
              </select>
            </div>
            <span class="form-hint">Set to 0 for immediate block</span>
          </div>

          <div class="quick-durations">
            <button
              type="button"
              @click="applyPreset(blockForm, { time: 0, unit: 60 })"
              class="duration-preset danger"
              :disabled="blockForm.loading"
            >
              Immediately
            </button>
            <button
              v-for="preset in blockPresets"
              :key="'block-' + preset.label"
              type="button"
              @click="applyPreset(blockForm, preset)"
              class="duration-preset"
              :disabled="blockForm.loading"
            >
              {{ preset.label }}
            </button>
          </div>

          <div v-if="blockForm.error" class="alert alert-error">
            {{ blockForm.error }}
          </div>

          <div v-if="blockForm.success" class="alert alert-success">
            {{ blockForm.success }}
          </div>

          <button type="submit" class="btn btn-danger w-full" :disabled="blockForm.loading">
            <svg v-if="!blockForm.loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
            <span v-else class="spinner spinner-light"></span>
            {{ blockForm.loading ? 'Processing...' : 'Schedule Block' }}
          </button>
        </form>
      </div>

      <!-- Check Block Status -->
      <div class="control-card">
        <div class="card-icon status">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="card-content">
          <h2>Check Block Status</h2>
          <p>View remaining time until a device is blocked</p>
        </div>

        <form @submit.prevent="handleCheckStatus" class="control-form">
          <div class="form-group">
            <label for="check-device-id">Device ID</label>
            <input
              id="check-device-id"
              v-model="checkForm.deviceId"
              type="text"
              placeholder="Enter device ID"
              required
              :disabled="checkForm.loading"
            />
          </div>

          <div v-if="checkForm.error" class="alert alert-error">
            {{ checkForm.error }}
          </div>

          <div v-if="checkForm.result !== null" class="status-display">
            <div class="status-icon" :class="checkForm.result > 0 ? 'pending' : 'none'">
              <svg v-if="checkForm.result > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="status-info">
              <span class="status-label">{{ checkForm.result > 0 ? 'Block scheduled in' : 'Status' }}</span>
              <span class="status-value">{{ formatBlockTime(checkForm.result) }}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-secondary w-full" :disabled="checkForm.loading">
            <svg v-if="!checkForm.loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span v-else class="spinner"></span>
            {{ checkForm.loading ? 'Checking...' : 'Check Status' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { accessApi } from '@/api/access'

const durationPresets = [
  { label: '15 min', time: 15, unit: 60 },
  { label: '30 min', time: 30, unit: 60 },
  { label: '1 hour', time: 1, unit: 3600 },
  { label: '2 hours', time: 2, unit: 3600 }
]

const blockPresets = [
  { label: '5 min', time: 5, unit: 60 },
  { label: '15 min', time: 15, unit: 60 },
  { label: '30 min', time: 30, unit: 60 }
]

const generateForm = reactive({
  deviceId: '',
  time: 30,
  unit: 60,
  loading: false,
  error: '',
  code: ''
})

const grantForm = reactive({
  deviceId: '',
  time: 30,
  unit: 60,
  loading: false,
  error: '',
  success: ''
})

const blockForm = reactive({
  deviceId: '',
  time: 5,
  unit: 60,
  loading: false,
  error: '',
  success: ''
})

const checkForm = reactive({
  deviceId: '',
  loading: false,
  error: '',
  result: null
})

const copied = ref(false)

function applyPreset(form, preset) {
  form.time = preset.time
  form.unit = preset.unit
}

function calculateSeconds(time, unit) {
  return time * unit
}

function formatBlockTime(seconds) {
  if (seconds === 0) return 'No block scheduled'
  if (seconds < 0) return 'No block scheduled'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

async function handleGenerateCode() {
  generateForm.loading = true
  generateForm.error = ''
  generateForm.code = ''

  try {
    const seconds = calculateSeconds(generateForm.time, generateForm.unit)
    const response = await accessApi.generateCode(generateForm.deviceId, seconds)
    generateForm.code = response.data || response.message || response
  } catch (err) {
    generateForm.error = err.response?.data?.message || err.message || 'Failed to generate code'
  } finally {
    generateForm.loading = false
  }
}

async function handleGrantAccess() {
  grantForm.loading = true
  grantForm.error = ''
  grantForm.success = ''

  try {
    const seconds = calculateSeconds(grantForm.time, grantForm.unit)
    const response = await accessApi.grantAccess(grantForm.deviceId, seconds)
    grantForm.success = response.message || 'Access granted successfully'
    grantForm.deviceId = ''
  } catch (err) {
    grantForm.error = err.response?.data?.message || err.message || 'Failed to grant access'
  } finally {
    grantForm.loading = false
  }
}

async function handleBlockDevice() {
  blockForm.loading = true
  blockForm.error = ''
  blockForm.success = ''

  try {
    const seconds = calculateSeconds(blockForm.time, blockForm.unit)
    const response = await accessApi.blockAfterTime(blockForm.deviceId, seconds)
    blockForm.success = response.message || (seconds === 0 ? 'Device blocked immediately' : 'Block scheduled successfully')
    blockForm.deviceId = ''
  } catch (err) {
    blockForm.error = err.response?.data?.message || err.message || 'Failed to block device'
  } finally {
    blockForm.loading = false
  }
}

async function handleCheckStatus() {
  checkForm.loading = true
  checkForm.error = ''
  checkForm.result = null

  try {
    const response = await accessApi.getRemainingBlockTime(checkForm.deviceId)
    checkForm.result = response.data ?? response ?? 0
  } catch (err) {
    checkForm.error = err.response?.data?.message || err.message || 'Failed to check status'
  } finally {
    checkForm.loading = false
  }
}
</script>

<style scoped>
.access-control {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn var(--transition-slow);
}

/* Page Header */
.page-header {
  margin-bottom: var(--space-8);
}

.header-content h1 {
  margin-bottom: var(--space-1);
}

.header-content p {
  font-size: 0.9375rem;
}

/* Control Grid */
.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--space-6);
}

/* Control Card */
.control-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  transition: all var(--transition);
}

.control-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
}

.card-icon.generate {
  background: var(--primary-light);
  color: var(--primary-color);
}

.card-icon.grant {
  background: var(--success-light);
  color: var(--success-color);
}

.card-icon.block {
  background: var(--danger-light);
  color: var(--danger-color);
}

.card-icon.status {
  background: var(--info-light);
  color: var(--info-color);
}

.card-content h2 {
  font-size: 1.125rem;
  margin-bottom: var(--space-1);
}

.card-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Form */
.control-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.duration-input {
  display: flex;
  gap: var(--space-3);
}

.duration-input input {
  flex: 1;
}

.duration-input select {
  width: 120px;
}

.quick-durations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.duration-preset {
  padding: var(--space-2) var(--space-3);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}

.duration-preset:hover:not(:disabled) {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.duration-preset.danger:hover:not(:disabled) {
  background: var(--danger-light);
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.duration-preset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.alert-error {
  background: var(--danger-light);
  color: #991b1b;
}

.alert-success {
  background: var(--success-light);
  color: #166534;
}

/* Code Display */
.code-display {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.code-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.code-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.code-value span {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: 0.1em;
  font-family: monospace;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}

.copy-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Status Display */
.status-display {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
}

.status-icon.pending {
  background: var(--warning-light);
  color: var(--warning-color);
}

.status-icon.none {
  background: var(--success-light);
  color: var(--success-color);
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.status-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.status-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-light {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.w-full {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .access-control {
    padding: var(--space-4);
  }

  .control-grid {
    grid-template-columns: 1fr;
  }
}
</style>
