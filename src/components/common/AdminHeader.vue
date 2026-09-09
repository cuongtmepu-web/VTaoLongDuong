<template>
  <header class="admin-header">
    <nav class="admin-navbar">
      <div class="container-fluid">
        <button
          class="mobile-menu-button"
          :class="{ 'is-open': mobileSidebarOpen }"
          type="button"
          :aria-expanded="mobileSidebarOpen"
          :aria-label="mobileSidebarOpen ? 'Đóng menu quản trị' : 'Mở menu quản trị'"
          title="Mở menu quản trị"
          @click="$emit('toggle-sidebar')"
        >
          <i class="bi bi-list" aria-hidden="true"></i>
        </button>
        <a class="navbar-brand" href="/">
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

defineProps<{
  mobileSidebarOpen: boolean
}>()

defineEmits<{
  'toggle-sidebar': []
}>()

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

.mobile-menu-button {
  display: none;
  color: var(--surface);
  font-size: 1.5rem;
}

.mobile-menu-button i {
  display: block;
  transition: transform 0.3s var(--ease);
}

.mobile-menu-button.is-open i {
  transform: rotate(90deg);
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

@media (max-width: 768px) {
  .admin-navbar {
    min-height: 68px;
    padding: 0 0.75rem;
  }

  .container-fluid {
    min-height: 68px;
    gap: 0.6rem;
  }

  .mobile-menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 2.25rem;
    width: 2.25rem;
    height: 2.25rem;
  }

  .navbar-brand {
    flex: 1;
    min-width: 0;
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
