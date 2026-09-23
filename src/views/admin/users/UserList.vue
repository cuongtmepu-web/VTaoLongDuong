<template>
  <AdminLayout>
    <div class="user-list">
      <div class="user-list-header d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý người dùng</h2>
        <div class="user-list-filters d-flex gap-2">
          <label class="user-search">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên, email..."
              aria-label="Tìm theo tên hoặc email"
              @input="onSearch"
            />
          </label>
          <BaseSelect
            class="role-filter"
            v-model="roleFilter"
            :options="[
              { value: '', label: 'Tất cả' },
              { value: 'Admin', label: 'Quản trị' },
              { value: 'Doctor', label: 'Bác sĩ' },
              { value: 'User', label: 'Người dùng' },
            ]"
            @update:model-value="onSearch"
          />
          <button class="btn btn-primary search-button" @click="fetchUsers">
            <i class="bi bi-search"></i><span>Tìm</span>
          </button>
        </div>
        <router-link to="/admin-users/create" class="btn btn-primary user-create-button">
          <i class="bi bi-person-plus"></i><span>Thêm người dùng</span>
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.userId">
                    <td>{{ user.userId }}</td>
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>
                      <span :class="getRoleClass(user.role)" class="badge role-badge">
                        {{ getRoleText(user.role) }}
                      </span>
                    </td>
                    <td>
                      <span
                        :class="user.isActive ? 'bg-success' : 'bg-danger'"
                        class="badge status-badge"
                      >
                        {{ user.isActive ? 'Hoạt động' : 'Khóa' }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin-users/${user.userId}`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-eye"></i>
                        </router-link>
                        <button
                          class="btn btn-sm btn-outline-secondary"
                          @click="toggleUserStatus(user)"
                          :title="user.isActive ? 'Khóa' : 'Mở khóa'"
                        >
                          <i :class="user.isActive ? 'bi bi-lock' : 'bi bi-unlock'"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteUser(user)"
                          title="Xóa người dùng"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-muted">
                Hiển thị {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} -
                {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount) }}
                / {{ pagination.totalCount }} người dùng
              </span>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage - 1)"
                      >Trước</a
                    >
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.currentPage }"
                  >
                    <a class="page-link" href="/" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: pagination.currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage + 1)"
                      >Sau</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { adminUserApi } from '@/api/admin/adminUser'
import type { User } from '@/api/types/auth'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

const toast = useToast()
const loading = ref(false)
const users = ref<User[]>([])
const search = ref('')
const roleFilter = ref('')
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
})

const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalCount / pagination.value.pageSize)
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getRoleClass = (role: string | number) => {
  const classes: Record<string, string> = {
    Admin: 'bg-danger',
    Doctor: 'bg-info',
    User: 'bg-primary',
    '1': 'bg-danger',
    '2': 'bg-info',
    '3': 'bg-primary',
  }
  return classes[String(role)] || 'bg-secondary'
}

const getRoleText = (role: string | number) => {
  const texts: Record<string, string> = {
    Admin: 'Quản trị',
    Doctor: 'Bác sĩ',
    User: 'Người dùng',
    '1': 'Quản trị',
    '2': 'Bác sĩ',
    '3': 'Người dùng',
  }
  return texts[String(role)] || String(role)
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    }

    if (search.value) params.search = search.value
    if (roleFilter.value) params.role = roleFilter.value

    const response = await adminUserApi.getUsers(params)
    if (response.data.success) {
      users.value = response.data.data.data
      pagination.value.totalCount = response.data.data.pagination.totalCount
    }
  } catch (error) {
    toast.error('Không thể tải danh sách người dùng')
  } finally {
    loading.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  if (
    !confirm(`Bạn có chắc muốn ${user.isActive ? 'khóa' : 'mở khóa'} tài khoản ${user.fullName}?`)
  )
    return

  try {
    const response = await adminUserApi.updateUser(user.userId, { isActive: !user.isActive })
    if (response.data.success) {
      toast.success(`Đã ${user.isActive ? 'khóa' : 'mở khóa'} tài khoản`)
      await fetchUsers()
    }
  } catch (error) {
    toast.error('Thao tác thất bại')
  }
}

const deleteUser = async (user: User) => {
  if (!confirm(`Bạn có chắc muốn xóa tài khoản ${user.fullName}?`)) return

  try {
    const response = await adminUserApi.deleteUser(user.userId)
    if (response.data.success) {
      toast.success('Xóa người dùng thành công')
      await fetchUsers()
    }
  } catch (error) {
    toast.error('Xóa người dùng thất bại')
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.currentPage = page
  fetchUsers()
}

const onSearch = debounce(() => {
  pagination.value.currentPage = 1
  fetchUsers()
}, 500)

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list {
  width: 100%;
}

.user-list-header {
  align-items: flex-end !important;
  flex-wrap: wrap;
  gap: 1rem;
}

.user-list-header h2 {
  margin-right: auto;
}

.user-list-filters {
  flex: 1 1 520px;
  justify-content: flex-end;
  align-items: center;
}

.user-search {
  display: flex;
  align-items: center;
  width: min(260px, 100%);
  height: 48px;
  gap: 0.65rem;
  padding: 0 1rem;
  color: var(--primary);
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid rgba(47, 111, 99, 0.14);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  transition:
    border-color 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
}

.user-search:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.user-search input {
  width: 100%;
  min-width: 0;
  padding: 0;
  color: var(--text);
  background: transparent;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 0.9rem;
}

.user-search input::placeholder {
  color: var(--text-muted);
}

.user-list-filters :deep(.base-select) {
  width: 150px;
}

.user-list-filters :deep(.role-filter__trigger),
.user-list-filters :deep(.base-select__trigger) {
  height: 48px;
  min-height: 48px;
  padding: 0 1rem;
  border-color: rgba(47, 111, 99, 0.14);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.9);
  box-shadow: var(--shadow-sm);
  font-size: 0.9rem;
}

.user-list-filters :deep(.base-select__trigger:hover),
.user-list-filters :deep(.base-select.is-open .base-select__trigger) {
  background: var(--surface);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.search-button {
  height: 48px;
  min-width: 76px;
  padding: 0 1.15rem;
}

.user-list .status-badge {
  color: #fff !important;
}

.user-list .role-badge {
  color: #fff !important;
}

.users-table thead th,
.users-table tbody td {
  text-align: center;
  vertical-align: middle;
}

.users-table thead th {
  white-space: nowrap;
}

.user-create-button {
  flex: 0 0 auto;
}

@media (max-width: 992px) {
  .user-list-header {
    align-items: stretch !important;
    flex-direction: column;
  }

  .user-list-header h2 {
    margin-right: 0;
  }

  .user-list-filters {
    flex: none;
    justify-content: stretch;
  }

  .user-search,
  .user-list-filters :deep(.base-select),
  .search-button,
  .user-create-button {
    flex: 1;
    width: auto;
  }
}

@media (max-width: 576px) {
  .user-list-filters {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
  }

  .user-search,
  .user-list-filters :deep(.base-select),
  .search-button {
    width: 100%;
  }

  .user-search {
    grid-column: 1 / -1;
  }

  .user-create-button {
    width: 100%;
  }
}
</style>
