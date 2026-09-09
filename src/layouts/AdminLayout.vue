<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="admin-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <aside class="sidebar">
        <AdminSidebar @update:collapsed="sidebarCollapsed = $event" />
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from '@/components/common/AdminHeader.vue'
import AdminSidebar from '@/components/common/AdminSidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--bg);
  overflow-x: clip;
}

.admin-shell {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 76px);
  transition: grid-template-columns 0.1s var(--ease);
}

.admin-shell.sidebar-collapsed {
  grid-template-columns: 72px minmax(0, 1fr);
}

.sidebar {
  position: sticky;
  top: 76px;
  align-self: start;
  height: calc(100vh - 76px);
  min-width: 248px;
  overflow: visible;
  transition: min-width 0.9s var(--ease);
}

.sidebar-collapsed .sidebar {
  min-width: 72px;
}

.main-content {
  padding: 2.25rem clamp(1rem, 3vw, 3rem);
  background: linear-gradient(135deg, rgba(255, 253, 248, 0.62), transparent 46%), var(--bg);
  min-width: 0;
  min-height: calc(100vh - 76px);
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .admin-shell {
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
