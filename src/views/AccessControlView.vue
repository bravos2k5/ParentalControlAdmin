<template>
  <div class="access-control-view">
    <div class="page-header">
      <h1>Access Control</h1>
      <p>Grant or block device access</p>
    </div>

    <div class="control-grid">
      <!-- Grant Access Card -->
      <div class="control-card">
        <div class="card-header">
          <h2>✅ Grant Access</h2>
          <p>Allow a device to connect for a specific duration</p>
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
            <label for="grant-time">Duration</label>
            <div class="time-input-group">
              <input
                id="grant-time"
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

          <div v-if="grantForm.error" class="message error">
            {{ grantForm.error }}
          </div>

          <div v-if="grantForm.success" class="message success">
            {{ grantForm.success }}
          </div>

          <button type="submit" class="btn-primary" :disabled="grantForm.loading">
            {{ grantForm.loading ? 'Processing...' : 'Grant Access' }}
          </button>
        </form>
      </div>

      <!-- Block Device Card -->
      <div class="control-card">
        <div class="card-header">
          <h2>🔒 Block Device</h2>
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
            <label for="block-time">Block After</label>
            <div class="time-input-group">
              <input
                id="block-time"
                v-model.number="blockForm.time"
                type="number"
                min="1"
                required
                :disabled="blockForm.loading"
              />
              <select v-model="blockForm.unit" :disabled="blockForm.loading">
                <option value="60">Minutes</option>
                <option value="3600">Hours</option>
              </select>
            </div>
          </div>

          <div v-if="blockForm.error" class="message error">
            {{ blockForm.error }}
          </div>

          <div v-if="blockForm.success" class="message success">
            {{ blockForm.success }}
          </div>

          <button type="submit" class="btn-danger" :disabled="blockForm.loading">
            {{ blockForm.loading ? 'Processing...' : 'Schedule Block' }}
          </button>
        </form>
      </div>

      <!-- Check Block Time Card -->
      <div class="control-card">
        <div class="card-header">
          <h2>⏱️ Check Block Status</h2>
          <p>View remaining block time for a device</p>
        </div>

        <form @submit.prevent="handleCheckBlockTime" class="control-form">
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

          <div v-if="checkForm.error" class="message error">
            {{ checkForm.error }}
          </div>

          <div v-if="checkForm.result" class="message info">
            {{ checkForm.result }}
          </div>

          <button type="submit" class="btn-secondary" :disabled="checkForm.loading">
            {{ checkForm.loading ? 'Checking...' : 'Check Status' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Quick Presets -->
    <div class="presets-section">
      <h2>Quick Presets</h2>
      <div class="presets-grid">
        <button
          @click="applyPreset('grant', 30, 60)"
          class="preset-btn"
          :disabled="!presetDeviceId"
        >
          <span class="preset-icon">⚡</span>
          <span class="preset-label">Grant 30 minutes</span>
        </button>
        <button
          @click="applyPreset('grant', 1, 3600)"
          class="preset-btn"
          :disabled="!presetDeviceId"
        >
          <span class="preset-icon">⏰</span>
          <span class="preset-label">Grant 1 hour</span>
        </button>
        <button
          @click="applyPreset('grant', 2, 3600)"
          class="preset-btn"
          :disabled="!presetDeviceId"
        >
          <span class="preset-icon">📅</span>
          <span class="preset-label">Grant 2 hours</span>
        </button>
        <button
          @click="applyPreset('block', 5, 60)"
          class="preset-btn danger"
          :disabled="!presetDeviceId"
        >
          <span class="preset-icon">🚫</span>
          <span class="preset-label">Block in 5 min</span>
        </button>
      </div>
      <div class="preset-device-input">
        <input
          v-model="presetDeviceId"
          type="text"
          placeholder="Enter device ID for quick presets"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { accessApi } from '@/api/access'

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
  result: ''
})

const presetDeviceId = ref('')

function calculateSeconds(time, unit) {
  return time * unit
}

async function handleGrantAccess() {
  grantForm.loading = true
  grantForm.error = ''
  grantForm.success = ''

  try {
    const seconds = calculateSeconds(grantForm.time, grantForm.unit)
    const result = await accessApi.grantAccess(grantForm.deviceId, seconds)
    grantForm.success = result
    grantForm.deviceId = ''
  } catch (err) {
    grantForm.error = err.response?.data || err.message || 'Failed to grant access'
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
    const result = await accessApi.blockAfterTime(blockForm.deviceId, seconds)
    blockForm.success = result
    blockForm.deviceId = ''
  } catch (err) {
    blockForm.error = err.response?.data || err.message || 'Failed to block device'
  } finally {
    blockForm.loading = false
  }
}

async function handleCheckBlockTime() {
  checkForm.loading = true
  checkForm.error = ''
  checkForm.result = ''

  try {
    const result = await accessApi.getRemainingBlockTime(checkForm.deviceId)
    checkForm.result = result
  } catch (err) {
    checkForm.error = err.response?.data || err.message || 'Failed to check block status'
  } finally {
    checkForm.loading = false
  }
}

async function applyPreset(type, time, unit) {
  if (!presetDeviceId.value) return

  if (type === 'grant') {
    grantForm.deviceId = presetDeviceId.value
    grantForm.time = time
    grantForm.unit = unit
    await handleGrantAccess()
  } else {
    blockForm.deviceId = presetDeviceId.value
    blockForm.time = time
    blockForm.unit = unit
    await handleBlockDevice()
  }
}
</script>

<style scoped>
.access-control-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #333;
}

.page-header p {
  font-size: 16px;
  margin: 0;
  color: #666;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.control-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.card-header h2 {
  font-size: 20px;
  margin: 0 0 8px 0;
  color: #333;
}

.card-header p {
  font-size: 14px;
  margin: 0;
  color: #666;
}

.control-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.time-input-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.time-input-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.message {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.message.error {
  background-color: #fee;
  color: #c33;
}

.message.success {
  background-color: #efe;
  color: #3c3;
}

.message.info {
  background-color: #e7f3ff;
  color: #0066cc;
}

.btn-primary, .btn-danger, .btn-secondary {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled,
.btn-danger:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.presets-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.presets-section h2 {
  font-size: 20px;
  margin: 0 0 20px 0;
  color: #333;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #667eea;
}

.preset-btn.danger:hover:not(:disabled) {
  border-color: #dc3545;
}

.preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preset-icon {
  font-size: 24px;
}

.preset-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.preset-device-input {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.preset-device-input input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.preset-device-input input:focus {
  outline: none;
  border-color: #667eea;
}
</style>

