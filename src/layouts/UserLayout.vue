<template>
  <div class="user-layout">
    <PortalHeader />
    <div class="user-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <aside class="sidebar">
        <UserSidebar @update:collapsed="sidebarCollapsed = $event" />
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PortalHeader from '@/components/common/PortalHeader.vue'
import UserSidebar from '@/components/common/UserSidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.sidebar {
  background: #f8f9fa;
  min-height: calc(100vh - 76px);
  min-width: 248px;
  border-right: 1px solid #dee2e6;
  overflow: visible;
  transition: min-width 0.6s var(--ease);
}

.user-shell {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 76px);
  transition: grid-template-columns 0.6s var(--ease);
}

.user-shell.sidebar-collapsed {
  grid-template-columns: 72px minmax(0, 1fr);
}

.sidebar-collapsed .sidebar {
  min-width: 72px;
}

.main-content {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 76px);
}

@media (max-width: 768px) {
  .user-shell {
    display: block;
  }

  .sidebar {
    min-width: 0;
  }

  .sidebar-collapsed .sidebar {
    min-width: 72px;
  }
}
</style>
