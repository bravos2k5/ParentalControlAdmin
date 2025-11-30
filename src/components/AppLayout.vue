<template>
  <div class="app-layout">
    <nav class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 v-if="!sidebarCollapsed">Parental Control</h2>
        <button @click="toggleSidebar" class="toggle-btn">
          {{ sidebarCollapsed ? '☰' : '✕' }}
        </button>
      </div>

      <div class="nav-items">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Dashboard</span>
        </router-link>
        <router-link to="/sessions" class="nav-item" active-class="active">
          <span class="nav-icon">📋</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Sessions</span>
        </router-link>
        <router-link to="/access-control" class="nav-item" active-class="active">
          <span class="nav-icon">⚙️</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Access Control</span>
        </router-link>
      </div>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </nav>

    <main class="main-content" :class="{ expanded: sidebarCollapsed }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 20px;
  margin: 0;
  white-space: nowrap;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-items {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: white;
}

.nav-icon {
  font-size: 20px;
  min-width: 20px;
}

.nav-label {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s;
  min-height: 100vh;
}

.main-content.expanded {
  margin-left: 70px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .sidebar.collapsed {
    width: 0;
  }

  .main-content {
    margin-left: 70px;
  }

  .main-content.expanded {
    margin-left: 0;
  }
}
</style>

