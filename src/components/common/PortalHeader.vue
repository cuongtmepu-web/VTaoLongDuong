<template>
  <header class="portal-header">
    <nav class="portal-navbar">
      <div class="container-fluid">
        <router-link :to="dashboardPath" class="navbar-brand">
          <i class="bi bi-flower1"></i>
          <span
            >Tảo Long Đường <small>{{ roleLabel }}</small></span
          >
        </router-link>

        <div class="portal-actions">
          <span class="portal-user">
            <i class="bi bi-person-circle"></i>
            {{ authStore.user?.fullName }}
          </span>
          <button class="logout-button" type="button" title="Đăng xuất" @click="authStore.logout">
            <i class="bi bi-box-arrow-right"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/api/stores/auth'

const authStore = useAuthStore()

const isDoctor = computed(() => authStore.user?.role === 'Doctor')
const dashboardPath = computed(() => '/')
const roleLabel = computed(() => (isDoctor.value ? 'Khu vực bác sĩ' : 'Khu vực người dùng'))
</script>

<style scoped>
.portal-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.portal-navbar {
  min-height: 76px;
  padding: 0 2.5rem;
  color: var(--surface);
  background: var(--primary-dark);
  box-shadow: 0 8px 24px rgba(28, 38, 32, 0.12);
}

.container-fluid,
.navbar-brand,
.portal-user {
  display: flex;
  align-items: center;
}

.portal-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  flex-wrap: nowrap;
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

.navbar-brand:hover {
  color: var(--surface);
}

.navbar-brand > i {
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

.portal-user {
  min-width: 0;
  max-width: 20rem;
  gap: 0.5rem;
  margin-right: 1rem;
  color: rgba(255, 253, 248, 0.78);
  font-size: 0.88rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portal-user i {
  color: var(--gold-light);
  font-size: 1.2rem;
}

.logout-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem;
  color: var(--surface);
  background: transparent;
  border: 1px solid rgba(255, 253, 248, 0.55);
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 0.85rem;
  transition:
    background 0.25s var(--ease),
    border-color 0.25s var(--ease);
}

.logout-button:hover,
.logout-button:focus-visible {
  background: rgba(255, 253, 248, 0.14);
  border-color: var(--gold-light);
  outline: none;
}

@media (max-width: 576px) {
  .portal-navbar {
    padding: 0 1rem;
  }

  .navbar-brand {
    font-size: 1.2rem;
  }

  .navbar-brand small,
  .portal-user {
    display: none;
  }

  .logout-button span {
    display: none;
  }
}
</style>
