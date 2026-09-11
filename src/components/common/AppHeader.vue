<template>
  <header class="app-header">
    <div class="container header-inner">
      <router-link to="/" class="brand" aria-label="Trang chủ Tảo Long Đường">
        <span class="brand-mark">
          <svg viewBox="0 0 100 100" class="brand-taiji" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
            <path
              d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
              fill="currentColor"
            />
            <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
            <circle cx="50" cy="73.5" r="7" fill="currentColor" />
          </svg>
        </span>
        <span class="brand-text">Tảo Long Đường</span>
      </router-link>

      <nav class="main-nav" aria-label="Main navigation">
        <router-link to="/" class="nav-link" exact-active-class="active">Trang chủ</router-link>
        <router-link to="/bai-thuoc" class="nav-link" active-class="active">Bài thuốc</router-link>
        <router-link to="/bac-si" class="nav-link" active-class="active">Bác sĩ</router-link>
        <router-link to="/lien-he" class="nav-link" active-class="active">Liên hệ</router-link>
      </nav>

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated">
          <router-link
            :to="
              authStore.isAdmin
                ? '/admin-dashboard'
                : authStore.isDoctor
                  ? '/doctor-dashboard'
                  : '/user-dashboard'
            "
            class="nav-user"
          >
            <i class="bi bi-person-circle"></i>
            <span>{{ authStore.user?.fullName }}</span>
          </router-link>
          <a href="#" class="nav-logout" @click.prevent="authStore.logout">
            <i class="bi bi-box-arrow-right"></i>
          </a>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link subtle">Đăng nhập</router-link>
          <router-link to="/dang-ky" class="nav-cta">Đăng ký</router-link>
        </template>
      </div>
    </div>
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
  left: 0;
  right: 0;
  z-index: 1050;
  padding: 0.8rem 0;
  background: rgba(250, 246, 236, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gold-light);
  transition: all 0.3s var(--ease);
}
.app-header.scrolled {
  background: rgba(250, 246, 236, 0.95);
  box-shadow: 0 4px 20px rgba(28, 38, 32, 0.07);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  min-height: 68px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
  letter-spacing: -0.02em;
}
.brand-mark {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--surface);
  color: var(--primary-dark);
  box-shadow:
    0 0 0 1px var(--gold-light),
    0 8px 16px var(--primary-glow);
}
.brand-taiji {
  width: 24px;
  height: 24px;
  animation: taijiSpin 22s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .brand-taiji {
    animation: none;
  }
}
.brand-text {
  font-weight: 700;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--text-soft);
  transition: all 0.25s var(--ease);
}
.nav-link:hover {
  color: var(--primary);
  background: var(--primary-light);
}
.nav-link.active {
  color: var(--primary);
  background: var(--primary-light);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.nav-cta {
  padding: 0.5rem 1.4rem;
  border-radius: 999px;
  background: var(--secondary);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px var(--secondary-glow);
  transition: all 0.3s var(--ease);
}
.nav-cta:hover {
  background: var(--secondary-dark);
  box-shadow: 0 8px 20px var(--secondary-glow);
  transform: translateY(-2px);
  color: #fff;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-weight: 500;
  color: var(--text);
}
.nav-user:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.nav-logout {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--text-soft);
  transition: all 0.25s var(--ease);
}
.nav-logout:hover {
  background: var(--secondary-light);
  color: var(--secondary);
}

/* Mobile hamburger */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
}
.menu-toggle span {
  display: block;
  width: 26px;
  height: 3px;
  background: var(--text);
  border-radius: 999px;
  transition: all 0.3s var(--ease);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 1rem;
  }
  .main-nav {
    display: none;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 0.3rem;
    border-top: 1px solid var(--surface-border);
    margin-top: 0.8rem;
  }
  .main-nav.open {
    display: flex;
  }
  .menu-toggle {
    display: flex;
  }
  .nav-actions {
    margin-left: auto;
  }
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 0.7rem;
  }
}
</style>
