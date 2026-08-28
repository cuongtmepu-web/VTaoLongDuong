<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="container-fluid">
      <div class="row">
        <aside class="col-md-3 col-lg-2 sidebar">
          <AdminSidebar />
        </aside>
        <main class="col-md-9 col-lg-10 main-content">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/common/AdminHeader.vue'
import AdminSidebar from '@/components/common/AdminSidebar.vue'
</script>

<style scoped>
.sidebar {
  background: #2c3e50;
  min-height: calc(100vh - 60px);
  padding: 20px 0;
}

.main-content {
  padding: 20px;
  background: #f1f3f6;
  min-height: calc(100vh - 60px);
}
</style>
