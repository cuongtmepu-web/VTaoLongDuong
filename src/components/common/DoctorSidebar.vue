<template>
  <nav class="doctor-sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
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
          <router-link to="/doctor-dashboard" class="nav-link" active-class="active">
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
              <router-link :to="item.path" class="nav-link" active-class="active">
                <i :class="item.icon"></i>
                <span class="menu-label">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </li>

        <li v-show="matchesMenu('Đăng xuất')" class="nav-item logout-item">
          <a href="#" class="nav-link text-danger" @click.prevent="authStore.logout">
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

type MenuItem = { label: string; path: string; icon: string }
type MenuGroup = { id: string; label: string; icon: string; items: MenuItem[] }

const emit = defineEmits<{ 'update:collapsed': [value: boolean] }>()
const authStore = useAuthStore()
const searchQuery = ref('')
const sidebarCollapsed = ref(false)
const openGroups = ref<Record<string, boolean>>({})

const groups: MenuGroup[] = [
  {
    id: 'appointments',
    label: 'Lịch hẹn',
    icon: 'bi bi-calendar-check-fill',
    items: [
      {
        label: 'Danh sách lịch hẹn',
        path: '/doctor-appointments',
        icon: 'bi bi-calendar-check-fill',
      },
    ],
  },
  {
    id: 'records',
    label: 'Bệnh án',
    icon: 'bi bi-file-medical-fill',
    items: [
      { label: 'Hồ sơ bệnh án', path: '/doctor-medical-records', icon: 'bi bi-file-medical-fill' },
    ],
  },
  {
    id: 'schedule',
    label: 'Lịch làm việc',
    icon: 'bi bi-calendar-week-fill',
    items: [{ label: 'Quản lý lịch làm việc', path: '/doctor-schedule', icon: 'bi bi-clock-fill' }],
  },
  {
    id: 'profile',
    label: 'Tài khoản',
    icon: 'bi bi-person-fill',
    items: [
      { label: 'Thông tin cá nhân', path: '/doctor-profile', icon: 'bi bi-person-fill' },
      { label: 'Đổi mật khẩu', path: '/doctor-change-password', icon: 'bi bi-key-fill' },
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
    .map((group) => ({ ...group, items: group.items.filter((item) => matchesMenu(item.label)) }))
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
</script>

<style scoped>
.doctor-sidebar {
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
.doctor-sidebar.sidebar-collapsed {
  width: 72px;
  padding: 1rem 0.75rem;
}
.doctor-sidebar.sidebar-collapsed .sidebar-search {
  display: none;
}
.doctor-sidebar.sidebar-collapsed .sidebar-toolbar {
  justify-content: center;
}
.doctor-sidebar.sidebar-collapsed .sidebar-menu {
  overflow: visible;
}
.doctor-sidebar .nav-link,
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
.doctor-sidebar .nav-link:hover,
.menu-parent:hover,
.menu-parent:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}
.doctor-sidebar .nav-link.active {
  color: var(--surface);
  background: var(--primary-dark);
  box-shadow: inset 3px 0 0 var(--gold);
  font-weight: 700;
}
.doctor-sidebar .nav-link i,
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
.doctor-sidebar .nav-link.text-danger {
  color: var(--secondary-dark) !important;
}
.doctor-sidebar.sidebar-collapsed .dashboard-item .menu-label,
.doctor-sidebar.sidebar-collapsed .menu-group-label,
.doctor-sidebar.sidebar-collapsed .logout-item .menu-label,
.doctor-sidebar.sidebar-collapsed .menu-chevron {
  display: none;
}
.doctor-sidebar.sidebar-collapsed .dashboard-item .nav-link,
.doctor-sidebar.sidebar-collapsed .menu-parent,
.doctor-sidebar.sidebar-collapsed .logout-item .nav-link {
  justify-content: center;
  padding: 0.72rem 0;
}
.doctor-sidebar.sidebar-collapsed .menu-parent {
  pointer-events: none;
  cursor: default;
}
.doctor-sidebar.sidebar-collapsed .menu-parent > i:first-child,
.doctor-sidebar.sidebar-collapsed .nav-link i {
  flex: 0 0 auto;
  width: auto;
}
.doctor-sidebar.sidebar-collapsed .menu-group {
  position: relative;
}
.doctor-sidebar.sidebar-collapsed .menu-group > .submenu {
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
.doctor-sidebar.sidebar-collapsed .menu-group:hover > .submenu,
.doctor-sidebar.sidebar-collapsed .menu-group:focus-within > .submenu {
  display: block;
}
@media (max-width: 768px) {
  .doctor-sidebar {
    height: auto;
    min-height: auto;
    padding: 0.75rem;
  }
  .sidebar-menu {
    max-height: calc(100vh - 150px);
  }
  .doctor-sidebar .nav-link {
    white-space: normal;
  }
  .doctor-sidebar.sidebar-collapsed {
    width: 72px;
  }
}
</style>
