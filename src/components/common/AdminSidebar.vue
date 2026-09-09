<template>
  <nav class="admin-sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <div class="sidebar-toolbar">
      <label class="sidebar-search">
        <i class="bi bi-search" aria-hidden="true"></i>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Tìm menu..."
          aria-label="Tìm menu"
        />
      </label>
      <button
        class="sidebar-toggle"
        type="button"
        :aria-expanded="!sidebarCollapsed"
        :aria-label="sidebarCollapsed ? 'Hiện menu' : 'Ẩn menu'"
        :title="sidebarCollapsed ? 'Hiện menu' : 'Ẩn menu'"
        @click="toggleSidebar"
      >
        <i class="bi bi-list toggle-icon" aria-hidden="true"></i>
      </button>
    </div>

    <div class="sidebar-menu">
      <ul class="nav flex-column">
        <li v-show="matchesMenu('Dashboard')" class="nav-item dashboard-item">
          <router-link
            to="/admin-dashboard"
            class="nav-link"
            active-class="active"
            @click="handleNavigation"
          >
            <i class="bi bi-grid-1x2-fill"></i>
            <span class="menu-label">Dashboard</span>
          </router-link>
        </li>

        <li
          v-for="group in visibleGroups"
          :key="group.id"
          class="nav-item menu-group"
          :class="{ 'submenu-expanded': isGroupOpen(group.id) }"
        >
          <button
            class="menu-parent"
            type="button"
            :aria-expanded="isGroupOpen(group.id)"
            :aria-label="group.label"
            :title="sidebarCollapsed ? group.label : undefined"
            @click="toggleGroup(group.id)"
          >
            <i :class="group.icon" aria-hidden="true"></i>
            <span class="menu-group-label">{{ group.label }}</span>
            <i class="bi bi-chevron-down menu-chevron" aria-hidden="true"></i>
          </button>

          <ul class="submenu">
            <li v-for="item in group.items" :key="item.path" class="nav-item">
              <router-link
                :to="item.path"
                class="nav-link"
                active-class="active"
                @click="handleNavigation"
              >
                <i :class="item.icon"></i>
                <span class="menu-label">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li v-show="matchesMenu('Đăng xuất')" class="nav-item logout-item">
          <a href="#" class="nav-link text-danger" @click.prevent="handleLogout">
            <i class="bi bi-box-arrow-right"></i>
            <span class="menu-label">Đăng xuất</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/api/stores/auth'

type MenuItem = {
  label: string
  path: string
  icon: string
}

type MenuGroup = {
  id: string
  label: string
  icon: string
  items: MenuItem[]
}

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  navigate: []
}>()

const authStore = useAuthStore()
const searchQuery = ref('')
const sidebarCollapsed = ref(false)
const openGroups = ref<Record<string, boolean>>({})

const groups: MenuGroup[] = [
  {
    id: 'management',
    label: 'Quản lý',
    icon: 'bi bi-briefcase-fill',
    items: [
      { label: 'Người dùng', path: '/admin-users', icon: 'bi bi-people-fill' },
      { label: 'Bác sĩ', path: '/admin-doctors', icon: 'bi bi-person-heart' },
      { label: 'Lịch hẹn', path: '/admin-appointments', icon: 'bi bi-calendar-check-fill' },
      { label: 'Hồ sơ bệnh án', path: '/admin-medical-records', icon: 'bi bi-file-medical-fill' },
      { label: 'Đơn hàng', path: '/admin-orders', icon: 'bi bi-box-seam' },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung',
    icon: 'bi bi-files',
    items: [
      { label: 'Blog', path: '/admin-blog/posts', icon: 'bi bi-newspaper' },
      { label: 'Trang chủ', path: '/admin-landing', icon: 'bi bi-layout-text-window' },
    ],
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: 'bi bi-bar-chart-fill',
    items: [{ label: 'Doanh thu', path: '/admin-reports/revenue', icon: 'bi bi-graph-up-arrow' }],
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'bi bi-gear-fill',
    items: [
      { label: 'Cài đặt chung', path: '/admin-settings/general', icon: 'bi bi-sliders' },
      { label: 'Cổng thanh toán', path: '/admin-settings/payment', icon: 'bi bi-credit-card-fill' },
    ],
  },
]

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('vi-VN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const matchesMenu = (label: string) =>
  !searchQuery.value || normalize(label).includes(normalize(searchQuery.value))

const visibleGroups = computed(() =>
  groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesMenu(item.label)),
    }))
    .filter((group) => group.items.length > 0),
)

const isGroupOpen = (groupId: string) =>
  Boolean(openGroups.value[groupId]) || Boolean(searchQuery.value)

const toggleGroup = (groupId: string) => {
  openGroups.value[groupId] = !openGroups.value[groupId]
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  if (sidebarCollapsed.value) {
    searchQuery.value = ''
    openGroups.value = {}
  }
  emit('update:collapsed', sidebarCollapsed.value)
}

const handleNavigation = () => {
  emit('navigate')
}

const handleLogout = () => {
  authStore.logout()
  handleNavigation()
}
</script>

<style scoped>
.admin-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 1rem;
  background: var(--surface);
  border-right: 1px solid var(--surface-border);
}

.sidebar-toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.sidebar-search {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  color: var(--text-muted);
  background: var(--surface-alt);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.sidebar-search input {
  width: 100%;
  min-width: 0;
  color: var(--text);
  background: transparent;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 0.82rem;
}

.sidebar-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--primary-dark);
  background: var(--primary-light);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  transition:
    background 0.25s var(--ease),
    border-color 0.25s var(--ease);
}

.sidebar-toggle:hover,
.sidebar-toggle:focus-visible {
  background: var(--gold-light);
  border-color: var(--gold);
  outline: none;
}

.toggle-bars {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1rem;
}

.sidebar-collapsed .toggle-bars {
  flex-direction: row;
  gap: 3px;
}

.sidebar-collapsed .toggle-bars span {
  width: 3px;
  height: 1rem;
}
.toggle-icon {
  display: block;
  font-size: 1.35rem;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 0.6s var(--ease);
}

.sidebar-collapsed .toggle-icon {
  transform: rotate(90deg);
}

.sidebar-menu {
  flex: 1 1 auto;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-light) transparent;
}

.sidebar-collapsed .sidebar-search {
  display: none;
}

.admin-sidebar.sidebar-collapsed {
  width: 72px;
  padding: 1rem 0.75rem;
}

.admin-sidebar.sidebar-collapsed .sidebar-toolbar {
  justify-content: center;
}

.admin-sidebar.sidebar-collapsed .sidebar-menu {
  overflow: visible;
}

.admin-sidebar .nav-link,
.menu-parent {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 0.72rem 1rem;
  color: var(--text-soft);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.3s;
}

.admin-sidebar .nav-link:hover,
.menu-parent:hover,
.menu-parent:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}

.admin-sidebar .nav-link.active {
  color: var(--primary-dark);
  background: var(--primary-light);
  box-shadow: inset 3px 0 0 var(--primary);
  font-weight: 700;
}

.admin-sidebar .nav-link i,
.menu-parent > i:first-child {
  flex: 0 0 24px;
  width: 24px;
  color: inherit;
  font-size: 1.2rem;
  text-align: center;
}

.menu-parent {
  color: var(--text-muted);
  background: transparent;
  border: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.7rem;
  font-weight: bold;
}

.menu-chevron {
  margin-left: auto;
  font-size: 0.75rem !important;
  transition: transform 0.25s var(--ease);
}

.submenu-expanded > .menu-parent .menu-chevron {
  transform: rotate(180deg);
}

.submenu {
  display: none;
  padding: 0;
  list-style: none;
}

.submenu-expanded > .submenu {
  display: block;
}

.submenu .nav-link {
  padding-left: 1.5rem;
}

.logout-item {
  margin-top: 1rem;
}

.admin-sidebar .nav-link.text-danger {
  color: var(--secondary-dark) !important;
}

.admin-sidebar.sidebar-collapsed .dashboard-item .menu-label,
.admin-sidebar.sidebar-collapsed .menu-group-label,
.admin-sidebar.sidebar-collapsed .logout-item .menu-label,
.admin-sidebar.sidebar-collapsed .menu-chevron {
  display: none;
}

.admin-sidebar.sidebar-collapsed .dashboard-item .nav-link,
.admin-sidebar.sidebar-collapsed .menu-parent,
.admin-sidebar.sidebar-collapsed .logout-item .nav-link {
  justify-content: center;
  padding: 0.72rem 0;
}

.admin-sidebar.sidebar-collapsed .menu-parent {
  pointer-events: none;
  cursor: default;
}

.admin-sidebar.sidebar-collapsed .menu-parent > i:first-child,
.admin-sidebar.sidebar-collapsed .nav-link i {
  flex: 0 0 auto;
  width: auto;
}

.admin-sidebar.sidebar-collapsed .menu-group {
  position: relative;
}

.admin-sidebar.sidebar-collapsed .menu-group > .submenu {
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 20;
  width: 230px;
  padding: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}

.admin-sidebar.sidebar-collapsed .menu-group:hover > .submenu,
.admin-sidebar.sidebar-collapsed .menu-group:focus-within > .submenu {
  display: block;
}

@media (max-width: 768px) {
  .admin-sidebar {
    height: 100%;
    min-height: 100%;
    padding: 0.75rem;
  }

  .sidebar-toggle {
    display: none;
  }

  .sidebar-menu {
    max-height: calc(100vh - 150px);
  }

  .admin-sidebar .nav-link {
    white-space: normal;
  }

  .admin-sidebar.sidebar-collapsed {
    width: 100%;
    padding: 0.75rem;
  }

  .admin-sidebar.sidebar-collapsed .sidebar-search,
  .admin-sidebar.sidebar-collapsed .menu-label,
  .admin-sidebar.sidebar-collapsed .menu-group-label,
  .admin-sidebar.sidebar-collapsed .menu-chevron {
    display: inline-flex;
  }

  .admin-sidebar.sidebar-collapsed .sidebar-toolbar,
  .admin-sidebar.sidebar-collapsed .dashboard-item .nav-link,
  .admin-sidebar.sidebar-collapsed .menu-parent,
  .admin-sidebar.sidebar-collapsed .logout-item .nav-link {
    justify-content: initial;
    padding: 0.72rem 1rem;
  }

  .admin-sidebar.sidebar-collapsed .menu-parent {
    pointer-events: auto;
    cursor: pointer;
  }

  .admin-sidebar.sidebar-collapsed .menu-group {
    position: static;
  }

  .admin-sidebar.sidebar-collapsed .menu-group > .submenu {
    position: static;
    width: auto;
    padding: 0;
    border: 0;
    box-shadow: none;
  }
}

@media (max-width: 576px) {
  .admin-sidebar {
    padding: 0.65rem;
  }

  .sidebar-toolbar {
    margin-bottom: 0.5rem;
  }

  .admin-sidebar .nav-link,
  .menu-parent {
    padding: 0.65rem 0.8rem;
  }
}
</style>
