<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="admin-shell">
      <aside class="sidebar">
        <AdminSidebar />
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/common/AdminHeader.vue'
import AdminSidebar from '@/components/common/AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--bg);
}

.admin-shell {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: calc(100vh - 76px);
}

.sidebar {
  min-width: 248px;
}

.main-content {
  padding: 2.25rem clamp(1rem, 3vw, 3rem);
  background: linear-gradient(135deg, rgba(255, 253, 248, 0.62), transparent 46%), var(--bg);
  min-width: 0;
}

@media (max-width: 768px) {
  .admin-shell {
    display: block;
  }

  .sidebar {
    min-width: 0;
  }

  .main-content {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
