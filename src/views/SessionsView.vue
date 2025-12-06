<template>
  <div class="sessions-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Active Sessions</h1>
        <p>Manage all connected devices</p>
      </div>
      <div class="header-actions">
        <button @click="refreshSessions" class="btn btn-secondary" :disabled="loading">
          <svg :class="{ 'animate-spin': loading }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          Refresh
        </button>
        <button
          @click="confirmDeleteAll"
          class="btn btn-danger"
          :disabled="loading || sessions.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete All
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading && sessions.length === 0" class="loading-state">
      <div class="spinner-lg"></div>
      <p>Loading sessions...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="sessions.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <h3>No Active Sessions</h3>
      <p>There are no devices currently connected.</p>
    </div>

    <!-- Sessions Grid -->
    <div v-else class="sessions-grid">
      <div v-for="session in sessions" :key="session.id" class="session-card">
        <div class="card-header">
          <div class="device-info">
            <div class="device-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div>
              <h3>{{ session.deviceName || 'Unknown Device' }}</h3>
              <span class="badge badge-success">
                <span class="status-dot"></span>
                Active
              </span>
            </div>
          </div>
          <button
            @click="handleDeleteSession(session.id)"
            class="btn-icon-delete"
            :disabled="deletingSession === session.id"
            :title="'Delete session'"
          >
            <svg v-if="deletingSession !== session.id" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span v-else class="spinner-sm"></span>
          </button>
        </div>

        <div class="card-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Device ID</span>
              <span class="detail-value truncate" :title="session.deviceId">{{ session.deviceId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">IP Address</span>
              <span class="detail-value">{{ session.ipAddress || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Connected</span>
              <span class="detail-value">{{ formatDateTime(session.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Active</span>
              <span class="detail-value">{{ formatDateTime(session.lastActive) }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button
            @click="openAccessModal(session, 'grant')"
            class="btn btn-success btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Grant Access
          </button>
          <button
            @click="openAccessModal(session, 'block')"
            class="btn btn-danger btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
            Block
          </button>
        </div>
      </div>
    </div>

    <!-- Delete All Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteAllModal" class="modal-overlay" @click="showDeleteAllModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Delete All Sessions?</h3>
            <button @click="showDeleteAllModal = false" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete all <strong>{{ sessions.length }}</strong> active session(s)?</p>
            <p class="text-muted">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteAllModal = false" class="btn btn-secondary">Cancel</button>
            <button @click="handleDeleteAll" class="btn btn-danger" :disabled="deletingAll">
              {{ deletingAll ? 'Deleting...' : 'Delete All' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Access Control Modal -->
    <Teleport to="body">
      <div v-if="accessModal.show" class="modal-overlay" @click="closeAccessModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ accessModal.type === 'grant' ? 'Grant Access' : 'Block Device' }}</h3>
            <button @click="closeAccessModal" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-subtitle">
              {{ accessModal.type === 'grant' ? 'Grant access to' : 'Block' }}
              <strong>{{ accessModal.session?.deviceName || 'Unknown Device' }}</strong>
            </p>

            <div class="form-group">
              <label>Duration</label>
              <div class="duration-input">
                <input
                  v-model.number="accessModal.time"
                  type="number"
                  min="1"
                  :disabled="accessModal.loading"
                />
                <select v-model="accessModal.unit" :disabled="accessModal.loading">
                  <option value="60">Minutes</option>
                  <option value="3600">Hours</option>
                </select>
              </div>
            </div>

            <div class="quick-durations">
              <button
                v-for="preset in durationPresets"
                :key="preset.label"
                @click="applyDurationPreset(preset)"
                class="duration-preset"
                :disabled="accessModal.loading"
              >
                {{ preset.label }}
              </button>
            </div>

            <div v-if="accessModal.error" class="alert alert-error mt-4">
              {{ accessModal.error }}
            </div>
            <div v-if="accessModal.success" class="alert alert-success mt-4">
              {{ accessModal.success }}
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeAccessModal" class="btn btn-secondary">Cancel</button>
            <button
              @click="submitAccessAction"
              :class="['btn', accessModal.type === 'grant' ? 'btn-success' : 'btn-danger']"
              :disabled="accessModal.loading"
            >
              {{ accessModal.loading ? 'Processing...' : (accessModal.type === 'grant' ? 'Grant Access' : 'Block Device') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import { accessApi } from '@/api/access'

const sessionStore = useSessionStore()
const sessions = computed(() => sessionStore.sessions)
const loading = computed(() => sessionStore.loading)
const error = computed(() => sessionStore.error)

const deletingSession = ref(null)
const showDeleteAllModal = ref(false)
const deletingAll = ref(false)

const accessModal = ref({
  show: false,
  type: 'grant',
  session: null,
  time: 30,
  unit: 60,
  loading: false,
  error: '',
  success: ''
})

const durationPresets = [
  { label: '15 min', time: 15, unit: 60 },
  { label: '30 min', time: 30, unit: 60 },
  { label: '1 hour', time: 1, unit: 3600 },
  { label: '2 hours', time: 2, unit: 3600 }
]

function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function refreshSessions() {
  await sessionStore.fetchSessions()
}

function confirmDeleteAll() {
  showDeleteAllModal.value = true
}

async function handleDeleteAll() {
  deletingAll.value = true
  try {
    await sessionStore.deleteAllSessions()
    showDeleteAllModal.value = false
  } catch (err) {
    console.error('Error deleting all sessions:', err)
  } finally {
    deletingAll.value = false
  }
}

async function handleDeleteSession(sessionId) {
  deletingSession.value = sessionId
  try {
    await sessionStore.deleteSession(sessionId)
  } catch (err) {
    console.error('Error deleting session:', err)
  } finally {
    deletingSession.value = null
  }
}

function openAccessModal(session, type) {
  accessModal.value = {
    show: true,
    type,
    session,
    time: type === 'grant' ? 30 : 5,
    unit: 60,
    loading: false,
    error: '',
    success: ''
  }
}

function closeAccessModal() {
  accessModal.value.show = false
}

function applyDurationPreset(preset) {
  accessModal.value.time = preset.time
  accessModal.value.unit = preset.unit
}

async function submitAccessAction() {
  const modal = accessModal.value
  modal.loading = true
  modal.error = ''
  modal.success = ''

  try {
    const seconds = modal.time * modal.unit
    if (modal.type === 'grant') {
      const response = await accessApi.grantAccess(modal.session.deviceId, seconds)
      modal.success = response.message || 'Access granted successfully'
    } else {
      const response = await accessApi.blockAfterTime(modal.session.deviceId, seconds)
      modal.success = response.message || 'Device will be blocked'
    }
    setTimeout(() => closeAccessModal(), 1500)
  } catch (err) {
    modal.error = err.response?.data?.message || err.message || 'Operation failed'
  } finally {
    modal.loading = false
  }
}

let pollingInterval = null

onMounted(() => {
  sessionStore.fetchSessions()
  pollingInterval = setInterval(() => {
    sessionStore.fetchSessions()
  }, 15000)
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>

<style scoped>
.sessions-view {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn var(--transition-slow);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.header-content h1 {
  margin-bottom: var(--space-1);
}

.header-content p {
  font-size: 0.9375rem;
}

.header-actions {
  display: flex;
  gap: var(--space-3);
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius);
  margin-bottom: var(--space-5);
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.spinner-lg {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-4);
}

.spinner-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--danger-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-6);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-xl);
  color: var(--text-tertiary);
  margin-bottom: var(--space-5);
}

.empty-state h3 {
  font-size: 1.125rem;
  margin-bottom: var(--space-2);
}

.empty-state p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

/* Sessions Grid */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-5);
}

.session-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all var(--transition);
}

.session-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.session-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-color);
}

.device-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.device-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: var(--radius);
}

.device-info h3 {
  font-size: 1rem;
  margin-bottom: var(--space-1);
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  margin-right: var(--space-1);
}

.btn-icon-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition);
}

.btn-icon-delete:hover:not(:disabled) {
  background: var(--danger-light);
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.btn-icon-delete:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.session-card .card-body {
  padding: var(--space-5);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-card .card-footer {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--bg-tertiary);
}

.session-card .card-footer .btn {
  flex: 1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 1000;
  animation: fadeIn var(--transition);
}

.modal {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-xl);
  animation: slideIn var(--transition-slow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.125rem;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-6);
}

.modal-subtitle {
  margin-bottom: var(--space-5);
  color: var(--text-secondary);
}

.text-muted {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-top: var(--space-2);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--space-2);
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

.duration-preset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mt-4 {
  margin-top: var(--space-4);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

/* Responsive */
@media (max-width: 768px) {
  .sessions-view {
    padding: var(--space-4);
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .sessions-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .session-card .card-footer {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
