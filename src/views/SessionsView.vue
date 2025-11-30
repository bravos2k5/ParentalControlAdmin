<template>
  <div class="sessions-view">
    <div class="page-header">
      <div>
        <h1>Active Sessions</h1>
        <p>Manage all connected devices</p>
      </div>
      <div class="header-actions">
        <button @click="refreshSessions" class="btn-secondary" :disabled="loading">
          {{ loading ? 'Refreshing...' : '🔄 Refresh' }}
        </button>
        <button
          @click="confirmDeleteAll"
          class="btn-danger"
          :disabled="loading || sessions.length === 0"
        >
          🗑️ Delete All
        </button>
      </div>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <div v-if="loading && sessions.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading sessions...</p>
    </div>

    <div v-else-if="sessions.length === 0" class="empty-state">
      <div class="empty-icon">📱</div>
      <h3>No Active Sessions</h3>
      <p>There are no devices currently connected.</p>
    </div>

    <div v-else class="sessions-grid">
      <div v-for="session in sessions" :key="session.id" class="session-card">
        <div class="session-header">
          <div class="device-icon">📱</div>
          <div class="session-title">
            <h3>{{ session.deviceName || 'Unknown Device' }}</h3>
            <span class="session-status active">● Active</span>
          </div>
        </div>

        <div class="session-details">
          <div class="detail-row">
            <span class="detail-label">Device ID:</span>
            <span class="detail-value">{{ session.deviceId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">IP Address:</span>
            <span class="detail-value">{{ session.ipAddress || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Session ID:</span>
            <span class="detail-value session-id">{{ session.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Connected:</span>
            <span class="detail-value">{{ formatDateTime(session.createdAt) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Last Active:</span>
            <span class="detail-value">{{ formatDateTime(session.lastActive) }}</span>
          </div>
        </div>

        <div class="session-actions">
          <button
            @click="handleDeleteSession(session.id)"
            class="btn-delete"
            :disabled="deletingSession === session.id"
          >
            {{ deletingSession === session.id ? 'Deleting...' : 'Delete Session' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteAllModal" class="modal-overlay" @click="showDeleteAllModal = false">
      <div class="modal-content" @click.stop>
        <h3>Delete All Sessions?</h3>
        <p>Are you sure you want to delete all {{ sessions.length }} active session(s)? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteAllModal = false" class="btn-secondary">Cancel</button>
          <button @click="handleDeleteAll" class="btn-danger">Delete All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const sessions = computed(() => sessionStore.sessions)
const loading = computed(() => sessionStore.loading)
const error = computed(() => sessionStore.error)

const deletingSession = ref(null)
const showDeleteAllModal = ref(false)

function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString()
}

async function refreshSessions() {
  await sessionStore.fetchSessions()
}

function confirmDeleteAll() {
  showDeleteAllModal.value = true
}

async function handleDeleteAll() {
  try {
    await sessionStore.deleteAllSessions()
    showDeleteAllModal.value = false
  } catch (err) {
    console.error('Error deleting all sessions:', err)
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

onMounted(() => {
  sessionStore.fetchSessions()
})
</script>

<style scoped>
.sessions-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary, .btn-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-secondary:disabled, .btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-banner {
  padding: 16px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  margin: 0 0 12px 0;
  color: #333;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
  color: #666;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.session-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.session-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.device-icon {
  font-size: 32px;
}

.session-title {
  flex: 1;
}

.session-title h3 {
  font-size: 18px;
  margin: 0 0 4px 0;
  color: #333;
}

.session-status {
  font-size: 12px;
  font-weight: 600;
}

.session-status.active {
  color: #28a745;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.detail-value {
  font-size: 13px;
  color: #333;
  text-align: right;
}

.session-id {
  font-family: monospace;
  font-size: 11px;
  word-break: break-all;
}

.session-actions {
  margin-top: 16px;
}

.btn-delete {
  width: 100%;
  padding: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-delete:hover:not(:disabled) {
  background: #c82333;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
}

.modal-content h3 {
  font-size: 24px;
  margin: 0 0 16px 0;
  color: #333;
}

.modal-content p {
  font-size: 16px;
  margin: 0 0 24px 0;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>

