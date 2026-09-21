<template>
  <AdminLayout>
    <div class="user-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý người dùng</h2>
        <div class="d-flex gap-2">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Tìm kiếm..."
            style="width: 250px"
            @input="onSearch"
          />
          <BaseSelect
            v-model="roleFilter"
            :options="[
              { value: '', label: 'Tất cả vai trò' },
              { value: 'Admin', label: 'Quản trị' },
              { value: 'Doctor', label: 'Bác sĩ' },
              { value: 'User', label: 'Người dùng' },
            ]"
            style="width: 150px"
            @update:model-value="onSearch"
          />
          <button class="btn btn-primary" @click="fetchUsers">
            <i class="bi bi-search"></i> Tìm
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
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
                      <span :class="getRoleClass(user.role)" class="badge">
                        {{ getRoleText(user.role) }}
                      </span>
                    </td>
                    <td>
                      <span :class="user.isActive ? 'bg-success' : 'bg-danger'" class="badge">
                        {{ user.isActive ? 'Hoạt động' : 'Khóa' }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/users/${user.userId}`"
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

const getRoleClass = (role: string) => {
  const classes: Record<string, string> = {
    Admin: 'bg-danger',
    Doctor: 'bg-info',
    User: 'bg-primary',
  }
  return classes[role] || 'bg-secondary'
}

const getRoleText = (role: string) => {
  const texts: Record<string, string> = {
    Admin: 'Quản trị',
    Doctor: 'Bác sĩ',
    User: 'Người dùng',
  }
  return texts[role] || role
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
  padding: 20px;
}
</style>
