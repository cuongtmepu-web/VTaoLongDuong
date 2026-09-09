<template>
  <div class="doctor-layout">
    <PortalHeader :mobile-sidebar-open="mobileSidebarOpen" @toggle-sidebar="toggleMobileSidebar" />
    <div
      class="doctor-shell"
      :class="{ 'sidebar-collapsed': sidebarCollapsed, 'mobile-sidebar-open': mobileSidebarOpen }"
    >
      <aside class="sidebar">
        <DoctorSidebar
          @update:collapsed="handleSidebarCollapsed"
          @navigate="mobileSidebarOpen = false"
        />
      </aside>
      <button
        v-if="mobileSidebarOpen"
        class="sidebar-backdrop"
        type="button"
        aria-label="Đóng menu"
        @click="mobileSidebarOpen = false"
      ></button>
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
const mobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
  if (mobileSidebarOpen.value) sidebarCollapsed.value = false
}

const handleSidebarCollapsed = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
  if (collapsed) mobileSidebarOpen.value = false
}
</script>

<style scoped>
.doctor-layout {
  min-height: 100vh;
  background: var(--bg);
  overflow-x: clip;
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
  position: sticky;
  top: 76px;
  align-self: start;
  height: calc(100vh - 76px);
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
  overflow-x: hidden;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .doctor-shell {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 76px;
    left: 0;
    z-index: 990;
    width: min(320px, 86vw);
    min-width: 0;
    height: calc(100vh - 76px);
    transform: translateX(-100%);
    box-shadow: var(--shadow-lg);
  }

  .mobile-sidebar-open .sidebar {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 76px 0 0;
    z-index: 980;
    display: block;
    width: 100%;
    background: rgba(28, 38, 32, 0.38);
  }

  .main-content {
    padding: 1.25rem 1rem 2rem;
  }
}

@media (max-width: 576px) {
  .sidebar {
    top: 68px;
    height: calc(100vh - 68px);
  }

  .sidebar-backdrop {
    inset: 68px 0 0;
  }
}
</style>
