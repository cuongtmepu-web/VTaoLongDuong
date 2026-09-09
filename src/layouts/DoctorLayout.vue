<template>
  <div class="doctor-layout">
    <PortalHeader />
    <div class="doctor-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <aside class="sidebar">
        <DoctorSidebar @update:collapsed="sidebarCollapsed = $event" />
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DoctorSidebar from '@/components/common/DoctorSidebar.vue'
import PortalHeader from '@/components/common/PortalHeader.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.doctor-layout {
  min-height: 100vh;
  background: var(--bg);
}

.doctor-shell {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 76px);
  transition: grid-template-columns 0.6s var(--ease);
}

.doctor-shell.sidebar-collapsed {
  grid-template-columns: 72px minmax(0, 1fr);
}

.sidebar {
  min-width: 248px;
  overflow: visible;
  transition: min-width 0.6s var(--ease);
}

.sidebar-collapsed .sidebar {
  min-width: 72px;
}

.main-content {
  min-width: 0;
  min-height: calc(100vh - 76px);
  padding: 2.25rem clamp(1rem, 3vw, 3rem);
  background: linear-gradient(135deg, rgba(255, 253, 248, 0.62), transparent 46%), var(--bg);
}

@media (max-width: 768px) {
  .doctor-shell {
    display: block;
  }

  .sidebar {
    min-width: 0;
  }

  .sidebar-collapsed .sidebar {
    min-width: 72px;
  }

  .main-content {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
