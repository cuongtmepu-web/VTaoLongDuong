<template>
  <AdminLayout>
    <div class="user-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết người dùng</h2>
        <div>
          <router-link to="/admin/users" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Quay lại
          </router-link>
          <button class="btn btn-primary" @click="editUser" v-if="!isEditing">
            <i class="bi bi-pencil"></i> Chỉnh sửa
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="user" class="row">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body text-center">
              <img
                :src="user.avatarUrl || '/images/default-avatar.jpg'"
                :alt="user.fullName"
                class="rounded-circle mb-3"
                width="150"
                height="150"
              />
              <h4>{{ user.fullName }}</h4>
              <p class="text-muted">{{ user.email }}</p>
              <span :class="user.isActive ? 'bg-success' : 'bg-danger'" class="badge fs-6">
                {{ user.isActive ? 'Hoạt động' : 'Đã khóa' }}
              </span>
              <hr />
              <div class="text-start">
                <p><strong>Username:</strong> {{ user.username }}</p>
                <p><strong>Vai trò:</strong> {{ getRoleText(user.role) }}</p>
                <p><strong>Điện thoại:</strong> {{ user.phone || 'Chưa cập nhật' }}</p>
                <p><strong>Ngày tạo:</strong> {{ formatDate(user.createdAt) }}</p>
                <p v-if="user.lastLogin">
                  <strong>Đăng nhập lần cuối:</strong> {{ formatDateTime(user.lastLogin) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Thông tin chi tiết</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleUpdate" v-if="isEditing">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input type="text" class="form-control" v-model="editForm.fullName" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" v-model="editForm.phone" />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <DatePicker v-model="editForm.dateOfBirth" label="Ngày sinh" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Giới tính</label>
                    <BaseSelect
                      v-model="editForm.gender"
                      :options="[
                        { value: '', label: 'Chọn giới tính' },
                        { value: '1', label: 'Nam' },
                        { value: '2', label: 'Nữ' },
                        { value: '3', label: 'Khác' },
                      ]"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" class="form-control" v-model="editForm.address" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Vai trò</label>
                  <BaseSelect
                    v-model="editForm.role"
                    :options="[
                      { value: 'User', label: 'Người dùng' },
                      { value: 'Doctor', label: 'Bác sĩ' },
                      { value: 'Admin', label: 'Quản trị viên' },
                    ]"
                  />
                </div>

                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="editForm.isActive"
                      id="activeSwitch"
                    />
                    <label class="form-check-label" for="activeSwitch">Kích hoạt tài khoản</label>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    Lưu thay đổi
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Hủy</button>
                </div>
              </form>

              <div v-else>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="text-muted d-block">Họ và tên</label>
                    <p class="fw-bold">{{ user.fullName }}</p>
                  </div>
                  <div class="col-md-6">
                    <label class="text-muted d-block">Số điện thoại</label>
                    <p class="fw-bold">{{ user.phone || 'Chưa cập nhật' }}</p>
                  </div>
                  <div class="col-md-6">
                    <label class="text-muted d-block">Ngày sinh</label>
                    <p class="fw-bold">
                      {{ user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật' }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <label class="text-muted d-block">Giới tính</label>
                    <p class="fw-bold">{{ getGenderText(user.gender) }}</p>
                  </div>
                  <div class="col-12">
                    <label class="text-muted d-block">Địa chỉ</label>
                    <p class="fw-bold">{{ user.address || 'Chưa cập nhật' }}</p>
                  </div>
                </div>

                <hr />

                <div class="d-flex gap-2">
                  <button class="btn btn-outline-danger" @click="toggleUserStatus">
                    <i :class="user.isActive ? 'bi bi-lock' : 'bi bi-unlock'"></i>
                    {{ user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointments History -->
          <div class="card mt-3">
            <div class="card-header">
              <h5 class="mb-0">Lịch sử lịch hẹn</h5>
            </div>
            <div class="card-body">
              <div v-if="appointments.length === 0" class="text-center py-3">
                <p class="text-muted">Người dùng chưa có lịch hẹn nào</p>
              </div>
              <div v-else>
                <div
                  v-for="appt in appointments.slice(0, 5)"
                  :key="appt.id"
                  class="appointment-item border-bottom py-2"
                >
                  <div class="d-flex justify-content-between">
                    <div>
                      <strong>{{ appt.doctorName }}</strong>
                      <small class="text-muted d-block">{{ formatDate(appt.date) }}</small>
                    </div>
                    <span :class="getStatusClass(appt.status)" class="badge">
                      {{ getStatusText(appt.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-person-x display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy người dùng</h4>
        <router-link to="/admin/users" class="btn btn-primary mt-3">Quay lại</router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import { adminUserApi } from '@/api/admin/adminUser'
import type { User } from '@/api/types/auth'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const user = ref<User | null>(null)
const appointments = ref<any[]>([])

const editForm = reactive({
  fullName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  role: 'User',
  isActive: true,
})

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const formatDateInput = (date?: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

const formatDateTime = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const getRoleText = (role: string) => {
  const texts: Record<string, string> = {
    Admin: 'Quản trị viên',
    Doctor: 'Bác sĩ',
    User: 'Người dùng',
  }
  return texts[role] || role
}

const getGenderText = (gender?: number) => {
  if (!gender) return 'Chưa cập nhật'
  const texts: Record<number, string> = {
    1: 'Nam',
    2: 'Nữ',
    3: 'Khác',
  }
  return texts[gender] || 'Chưa cập nhật'
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Confirmed: 'bg-info',
    Completed: 'bg-success',
    Cancelled: 'bg-danger',
    NoShow: 'bg-secondary',
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    NoShow: 'Vắng mặt',
  }
  return texts[status] || status
}

const fetchUser = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await adminUserApi.getById(parseInt(id))
    if (response.data.success) {
      user.value = response.data.data
      // Populate edit form
      Object.assign(editForm, {
        fullName: user.value.fullName,
        phone: user.value.phone || '',
        dateOfBirth: formatDateInput(user.value.dateOfBirth),
        gender: user.value.gender?.toString() || '',
        address: user.value.address || '',
        role: user.value.role,
        isActive: user.value.isActive,
      })
    }
  } catch (error) {
    toast.error('Không thể tải thông tin người dùng')
    router.push('/admin/users')
  } finally {
    loading.value = false
  }
}

const editUser = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Reset form
  if (user.value) {
    Object.assign(editForm, {
      fullName: user.value.fullName,
      phone: user.value.phone || '',
      dateOfBirth: formatDateInput(user.value.dateOfBirth),
      gender: user.value.gender?.toString() || '',
      address: user.value.address || '',
      role: user.value.role,
      isActive: user.value.isActive,
    })
  }
}

const handleUpdate = async () => {
  if (!user.value) return

  submitting.value = true
  try {
    const data = {
      fullName: editForm.fullName,
      phone: editForm.phone,
      dateOfBirth: editForm.dateOfBirth || undefined,
      gender: editForm.gender ? parseInt(editForm.gender) : undefined,
      address: editForm.address,
      isActive: editForm.isActive,
    }

    const response = await adminUserApi.updateUser(user.value.userId, data)
    if (response.data.success) {
      toast.success('Cập nhật thông tin thành công')
      isEditing.value = false
      await fetchUser()
    }
  } catch (error) {
    toast.error('Cập nhật thất bại')
  } finally {
    submitting.value = false
  }
}

const toggleUserStatus = async () => {
  if (!user.value) return
  const action = user.value.isActive ? 'khóa' : 'mở khóa'
  if (!confirm(`Bạn có chắc muốn ${action} tài khoản ${user.value.fullName}?`)) return

  try {
    const response = await adminUserApi.updateUser(user.value.userId, {
      isActive: !user.value.isActive,
    })
    if (response.data.success) {
      toast.success(`Đã ${action} tài khoản`)
      await fetchUser()
    }
  } catch (error) {
    toast.error('Thao tác thất bại')
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.appointment-item:last-child {
  border-bottom: none !important;
}
</style>
