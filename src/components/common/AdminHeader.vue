<template>
  <header class="admin-header">
    <nav class="admin-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="/admin-dashboard">
          <i class="bi bi-flower1"></i>
          <span>Tảo Long Đường <small>Quản trị hệ thống</small></span>
        </a>
        <div class="d-flex align-items-center">
          <span class="admin-user">
            <i class="bi bi-person-circle"></i>
            {{ authStore.user?.fullName }}
          </span>
          <button
            class="btn btn-outline-light btn-sm logout-button"
            @click="authStore.logout"
            title="Đăng xuất"
          >
            <i class="bi bi-box-arrow-right"></i><span>Đăng xuất</span>
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

.admin-navbar {
  min-height: 76px;
  padding: 0 2.5rem;
  background: var(--primary-dark);
  color: var(--surface);
  box-shadow: 0 8px 24px rgba(28, 38, 32, 0.12);
}

.container-fluid,
.navbar-brand,
.admin-user {
  display: flex;
  align-items: center;
}

.container-fluid {
  justify-content: space-between;
  max-width: 1600px;
  min-height: 76px;
  margin: 0 auto;
}

.navbar-brand {
  gap: 0.75rem;
  color: var(--surface);
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 600;
}

.navbar-brand i {
  color: var(--gold-light);
  font-size: 1.7rem;
}

.navbar-brand small {
  display: block;
  color: rgba(255, 253, 248, 0.62);
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-user {
  gap: 0.5rem;
  margin-right: 1rem;
  color: rgba(255, 253, 248, 0.78);
  font-size: 0.88rem;
}

.admin-user i {
  color: var(--gold-light);
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .admin-navbar {
    padding: 0 1rem;
  }
  .navbar-brand {
    font-size: 1.2rem;
  }
  .navbar-brand small,
  .admin-user {
    display: none;
  }
  .logout-button span {
    display: none;
  }
}
</style>
