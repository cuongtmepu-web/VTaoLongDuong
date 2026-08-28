<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img src="/favicon.ico" alt="Tảo Long Đường" height="40" class="me-2" />
          <span class="brand-text">Tảo Long Đường</span>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact-active-class="active"
                >Trang chủ</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/bai-thuoc" class="nav-link" active-class="active"
                >Bài thuốc</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/bac-si" class="nav-link" active-class="active">Bác sĩ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lien-he" class="nav-link" active-class="active"
                >Liên hệ</router-link
              >
            </li>
          </ul>

          <ul class="navbar-nav">
            <template v-if="authStore.isAuthenticated">
              <li class="nav-item">
                <router-link
                  :to="authStore.isAdmin ? '/admin/dashboard' : '/user/dashboard'"
                  class="nav-link"
                >
                  <i class="bi bi-person-circle"></i>
                  {{ authStore.user?.fullName }}
                </router-link>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" @click.prevent="authStore.logout">
                  <i class="bi bi-box-arrow-right"></i> Đăng xuất
                </a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">Đăng nhập</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dang-ky" class="nav-link btn btn-outline-light btn-sm ms-2">
                  Đăng ký
                </router-link>
              </li>
            </template>
          </ul>
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
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-link {
  font-weight: 500;
}

.nav-link.active {
  color: #ffc107 !important;
}

.nav-link.btn-outline-light {
  padding: 0.25rem 1rem;
}
</style>
