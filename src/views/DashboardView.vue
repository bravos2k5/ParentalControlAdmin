<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Overview of your parental control system</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📱</div>
        <div class="stat-content">
          <h3>Active Sessions</h3>
          <p class="stat-value">{{ sessions.length }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔒</div>
        <div class="stat-content">
          <h3>Blocked Devices</h3>
          <p class="stat-value">{{ blockedDevices }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Active Devices</h3>
          <p class="stat-value">{{ activeDevices }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <h3>Total Sessions Today</h3>
          <p class="stat-value">{{ todaySessions }}</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-buttons">
        <router-link to="/sessions" class="action-btn">
          <span class="action-icon">📋</span>
          <span>Manage Sessions</span>
        </router-link>
        <router-link to="/access-control" class="action-btn">
          <span class="action-icon">⚙️</span>
          <span>Access Control</span>
        </router-link>
      </div>
    </div>

    <div class="recent-sessions" v-if="sessions.length > 0">
      <h2>Recent Sessions</h2>
      <div class="session-list">
        <div v-for="session in recentSessions" :key="session.id" class="session-item">
          <div class="session-info">
            <h4>{{ session.deviceName || 'Unknown Device' }}</h4>
            <p class="session-meta">
              <span>Device ID: {{ session.deviceId }}</span>
              <span>IP: {{ session.ipAddress }}</span>
            </p>
          </div>
          <div class="session-time">
            <p>{{ formatTime(session.lastActive) }}</p>
          </div>
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

const blockedDevices = ref(0)
const activeDevices = computed(() => sessions.value.length)
const todaySessions = ref(0)

const recentSessions = computed(() => {
  return sessions.value.slice(0, 5)
})

function formatTime(timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return date.toLocaleDateString()
}

onMounted(() => {
  sessionStore.fetchSessions()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #333;
}

.dashboard-header p {
  font-size: 16px;
  margin: 0;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 40px;
}

.stat-content h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #666;
  font-weight: 600;
}

.stat-value {
  font-size: 32px;
  margin: 0;
  color: #333;
  font-weight: 700;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.action-icon {
  font-size: 24px;
}

.recent-sessions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-sessions h2 {
  font-size: 20px;
  margin: 0 0 20px 0;
  color: #333;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.session-item:hover {
  background: #e9ecef;
}

.session-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.session-meta {
  margin: 0;
  font-size: 13px;
  color: #666;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.session-time p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>

