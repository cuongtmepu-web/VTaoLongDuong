<template>
  <div class="user-layout">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <aside class="col-md-3 col-lg-2 sidebar">
          <UserSidebar />
        </aside>
        <main class="col-md-9 col-lg-10 main-content">
          <slot />
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import UserSidebar from '@/components/common/UserSidebar.vue'
</script>

<style scoped>
.sidebar {
  background: #f8f9fa;
  min-height: calc(100vh - 120px);
  padding: 20px 0;
  border-right: 1px solid #dee2e6;
}

.main-content {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 120px);
}
</style>
