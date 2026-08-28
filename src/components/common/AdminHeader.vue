<template>
  <header class="admin-header bg-dark text-white">
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand">
          <i class="bi bi-hospital-fill me-2"></i>
          Tảo Long Đường - Admin
        </a>
        <div class="d-flex align-items-center">
          <span class="text-light me-3">
            <i class="bi bi-person-circle"></i>
            {{ authStore.user?.fullName }}
          </span>
          <button class="btn btn-outline-light btn-sm" @click="authStore.logout">
            <i class="bi bi-box-arrow-right"></i> Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
