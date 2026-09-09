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
.user-layout {
  min-height: 100vh;
  background: var(--bg);
  overflow-x: clip;
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

.sidebar {
  position: sticky;
  top: 76px;
  align-self: start;
  height: calc(100vh - 76px);
  min-width: 248px;
  overflow: visible;
  background: var(--surface);
  transition: min-width 0.6s var(--ease);
}

.sidebar-collapsed .sidebar {
  min-width: 72px;
}

.main-content {
  min-width: 0;
  min-height: calc(100vh - 76px);
  padding: 2.25rem clamp(1rem, 3vw, 3rem);
  overflow-x: hidden;
  background: linear-gradient(135deg, rgba(255, 253, 248, 0.62), transparent 46%), var(--bg);
}

@media (max-width: 768px) {
  .user-shell {
    display: block;
  }

  .sidebar {
    min-width: 0;
    position: relative;
    top: auto;
    height: auto;
  }

  .sidebar-collapsed .sidebar {
    min-width: 72px;
  }

  .main-content {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
