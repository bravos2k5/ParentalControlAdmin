<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Dashboard</h1>
        <p>Overview of your parental control system</p>
      </div>
      <button @click="refreshData" class="btn btn-secondary" :disabled="loading">
        <svg :class="{ 'animate-spin': loading }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Active Sessions</span>
          <span class="stat-value">{{ sessions.length }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon online">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Connected Devices</span>
          <span class="stat-value">{{ uniqueDevices }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon recent">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Last Activity</span>
          <span class="stat-value stat-value-sm">{{ lastActivity }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <router-link to="/sessions" class="action-card">
          <div class="action-icon sessions">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="action-content">
            <h3>Manage Sessions</h3>
            <p>View and manage connected devices</p>
          </div>
          <svg class="action-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>

        <router-link to="/access-control" class="action-card">
          <div class="action-icon access">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div class="action-content">
            <h3>Access Control</h3>
            <p>Grant or block device access</p>
          </div>
          <svg class="action-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Recent Sessions -->
    <div class="section" v-if="sessions.length > 0">
      <div class="section-header">
        <h2 class="section-title">Recent Sessions</h2>
        <router-link to="/sessions" class="view-all">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
      <div class="sessions-list">
        <div v-for="session in recentSessions" :key="session.id" class="session-item">
          <div class="session-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="session-info">
            <h4>{{ session.deviceName || 'Unknown Device' }}</h4>
            <p>{{ session.ipAddress || 'N/A' }}</p>
          </div>
          <div class="session-meta">
            <span class="badge badge-success">Active</span>
            <span class="session-time">{{ formatTime(session.lastActive) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <h3>No Active Sessions</h3>
      <p>There are no devices currently connected to the system.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const sessions = computed(() => sessionStore.sessions)
const loading = computed(() => sessionStore.loading)

const uniqueDevices = computed(() => {
  const deviceIds = new Set(sessions.value.map(s => s.deviceId))
  return deviceIds.size
})

const recentSessions = computed(() => {
  return [...sessions.value]
    .sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0))
    .slice(0, 5)
})

const lastActivity = computed(() => {
  if (sessions.value.length === 0) return 'No activity'
  const sorted = [...sessions.value].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0))
  return formatTime(sorted[0]?.lastActive)
})

function formatTime(timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function refreshData() {
  sessionStore.fetchSessions()
}

let pollingInterval = null

onMounted(() => {
  sessionStore.fetchSessions()
  // Auto-refresh every 30 seconds
  pollingInterval = setInterval(() => {
    sessionStore.fetchSessions()
  }, 30000)
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>

<style scoped>
.dashboard {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn var(--transition-slow);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.header-content h1 {
  margin-bottom: var(--space-1);
}

.header-content p {
  font-size: 0.9375rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition);
}

.stat-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.stat-icon.active {
  background: var(--primary-light);
  color: var(--primary-color);
}

.stat-icon.online {
  background: var(--success-light);
  color: var(--success-color);
}

.stat-icon.recent {
  background: var(--info-light);
  color: var(--info-color);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-value-sm {
  font-size: 1rem;
}

/* Sections */
.section {
  margin-bottom: var(--space-8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.section-title {
  font-size: 1.125rem;
  margin-bottom: var(--space-5);
}

.section-header .section-title {
  margin-bottom: 0;
}

.view-all {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
  transition: gap var(--transition);
}

.view-all:hover {
  gap: var(--space-2);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-decoration: none;
  transition: all var(--transition);
}

.action-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.action-icon.sessions {
  background: var(--primary-light);
  color: var(--primary-color);
}

.action-icon.access {
  background: var(--success-light);
  color: var(--success-color);
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1rem;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

.action-content p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.action-arrow {
  color: var(--text-tertiary);
  transition: transform var(--transition);
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  padding: var(--space-4);
}

.session-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius);
  transition: background var(--transition);
}

.session-item:hover {
  background: var(--bg-tertiary);
}

.session-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-info h4 {
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-info p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.session-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.session-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
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

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--space-4);
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .session-item {
    flex-wrap: wrap;
  }

  .session-meta {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin-top: var(--space-2);
  }
}
</style>
