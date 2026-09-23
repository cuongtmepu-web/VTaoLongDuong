<template>
  <AdminLayout>
    <div class="user-detail">
      <div class="user-detail-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <span class="detail-kicker">HỒ SƠ TÀI KHOẢN</span>
          <h2 class="mb-0">Chi tiết người dùng</h2>
        </div>
        <div class="detail-header-actions">
          <router-link to="/admin-users" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Quay lại
          </router-link>
          <button v-if="!isEditing" class="btn btn-primary" @click="editUser">
            <i class="bi bi-pencil"></i> Chỉnh sửa
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="user" class="user-detail-grid">
        <section class="card profile-card">
          <div class="card-body">
            <div class="profile-heading">
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                :alt="user.fullName"
                class="profile-avatar"
              />
              <div v-else class="profile-avatar profile-avatar-fallback">
                {{ getInitials(user.fullName) }}
              </div>
              <h3>{{ user.fullName }}</h3>
              <p>{{ user.email }}</p>
              <span :class="user.isActive ? 'bg-success' : 'bg-danger'" class="badge status-badge">
                {{ user.isActive ? 'Hoạt động' : 'Đã khóa' }}
              </span>
            </div>

            <div class="profile-meta">
              <div>
                <span>Username</span><strong>{{ user.username }}</strong>
              </div>
              <div>
                <span>Vai trò</span><strong>{{ getRoleText(user.role) }}</strong>
              </div>
              <div>
                <span>Điện thoại</span><strong>{{ user.phone || 'Chưa cập nhật' }}</strong>
              </div>
              <div>
                <span>Ngày tạo</span><strong>{{ formatDate(user.createdAt) }}</strong>
              </div>
              <div v-if="user.lastLogin">
                <span>Đăng nhập lần cuối</span><strong>{{ formatDateTime(user.lastLogin) }}</strong>
              </div>
            </div>
          </div>
        </section>

        <div class="user-content-column">
          <section class="card detail-card">
            <div class="card-header">
              <h5 class="mb-0">Thông tin chi tiết</h5>
            </div>
            <div class="card-body">
              <form v-if="isEditing" @submit.prevent="handleUpdate">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="editForm.fullName" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="editForm.phone" type="tel" class="form-control" />
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
                  <input v-model="editForm.address" type="text" class="form-control" />
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
                <div class="form-check form-switch mb-4">
                  <input
                    id="activeSwitch"
                    v-model="editForm.isActive"
                    class="form-check-input"
                    type="checkbox"
                  />
                  <label class="form-check-label" for="activeSwitch">Kích hoạt tài khoản</label>
                </div>
                <div class="detail-actions d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    Lưu thay đổi
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Hủy</button>
                </div>
              </form>

              <div v-else class="detail-information">
                <div class="detail-item">
                  <span>Họ và tên</span><strong>{{ user.fullName }}</strong>
                </div>
                <div class="detail-item">
                  <span>Số điện thoại</span><strong>{{ user.phone || 'Chưa cập nhật' }}</strong>
                </div>
                <div class="detail-item">
                  <span>Ngày sinh</span
                  ><strong>{{
                    user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'
                  }}</strong>
                </div>
                <div class="detail-item">
                  <span>Giới tính</span><strong>{{ getGenderText(user.gender) }}</strong>
                </div>
                <div class="detail-item detail-item-wide">
                  <span>Địa chỉ</span><strong>{{ user.address || 'Chưa cập nhật' }}</strong>
                </div>
                <div class="detail-actions">
                  <button class="btn btn-outline-danger" @click="toggleUserStatus">
                    <i :class="user.isActive ? 'bi bi-lock' : 'bi bi-unlock'"></i>
                    {{ user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="card appointment-card">
            <div class="card-header">
              <h5 class="mb-0">Lịch sử lịch hẹn</h5>
            </div>
            <div class="card-body">
              <div v-if="appointments.length === 0" class="empty-state">
                <i class="bi bi-calendar2-check"></i>
                <p>Người dùng chưa có lịch hẹn nào</p>
              </div>
              <div v-else>
                <div
                  v-for="appt in appointments.slice(0, 5)"
                  :key="appt.id"
                  class="appointment-item"
                >
                  <div>
                    <strong>{{ appt.doctorName }}</strong>
                    <small>{{ formatDate(appt.date) }}</small>
                  </div>
                  <span :class="getStatusClass(appt.status)" class="badge">{{
                    getStatusText(appt.status)
                  }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-person-x display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy người dùng</h4>
        <router-link to="/admin-users" class="btn btn-primary mt-3">Quay lại</router-link>
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

const formatDate = (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '')
const formatDateInput = (date?: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '')
const formatDateTime = (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '')
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const getRoleText = (role: string | number) => {
  const texts: Record<string, string> = {
    Admin: 'Quản trị viên',
    Doctor: 'Bác sĩ',
    User: 'Người dùng',
    '1': 'Quản trị viên',
    '2': 'Bác sĩ',
    '3': 'Người dùng',
  }
  return texts[String(role)] || String(role)
}

const getGenderText = (gender?: number) =>
  ({ 1: 'Nam', 2: 'Nữ', 3: 'Khác' })[gender || 0] || 'Chưa cập nhật'
const getStatusClass = (status: string) =>
  ({
    Pending: 'bg-warning',
    Confirmed: 'bg-info',
    Completed: 'bg-success',
    Cancelled: 'bg-danger',
    NoShow: 'bg-secondary',
  })[status] || 'bg-secondary'
const getStatusText = (status: string) =>
  ({
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    NoShow: 'Vắng mặt',
  })[status] || status

const populateEditForm = () => {
  if (!user.value) return
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

const fetchUser = async () => {
  const id = route.params.id as string
  if (!id) return
  loading.value = true
  try {
    const response = await adminUserApi.getById(parseInt(id))
    if (response.data.success) {
      user.value = response.data.data
      populateEditForm()
    }
  } catch (error) {
    toast.error('Không thể tải thông tin người dùng')
    router.push('/admin-users')
  } finally {
    loading.value = false
  }
}

const editUser = () => {
  isEditing.value = true
}
const cancelEdit = () => {
  isEditing.value = false
  populateEditForm()
}

const handleUpdate = async () => {
  if (!user.value) return
  submitting.value = true
  try {
    const response = await adminUserApi.updateUser(user.value.userId, {
      fullName: editForm.fullName,
      phone: editForm.phone,
      dateOfBirth: editForm.dateOfBirth || undefined,
      gender: editForm.gender ? parseInt(editForm.gender) : undefined,
      address: editForm.address,
      isActive: editForm.isActive,
    })
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

onMounted(fetchUser)
</script>

<style scoped>
.user-detail {
  width: 100%;
}

.user-detail-header {
  gap: 1rem;
}

.user-detail-header h2 {
  margin-top: 0.35rem;
  color: var(--text);
  font-size: clamp(1.8rem, 3vw, 2.35rem);
}

.detail-kicker {
  color: var(--secondary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.detail-header-actions {
  display: flex;
  gap: 0.6rem;
}

.user-detail-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 2fr);
  gap: 1.25rem;
  align-items: start;
}

.profile-card,
.detail-card,
.appointment-card {
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.profile-card .card-body,
.detail-card .card-body,
.appointment-card .card-body {
  padding: clamp(1.25rem, 2.5vw, 2rem);
}

.profile-heading {
  text-align: center;
}

.profile-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 116px;
  object-fit: cover;
  border: 5px solid var(--primary-light);
  border-radius: 50%;
}

.profile-avatar-fallback {
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  font-size: 2rem;
  font-weight: 700;
}

.profile-name {
  margin: 0.5rem 0 0.25rem;
  color: var(--text);
  font-size: 1.35rem;
}

.profile-email {
  margin-bottom: 0.75rem;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.status-badge {
  color: #fff !important;
}

.profile-meta {
  display: grid;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--surface-border);
}

.profile-meta div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.profile-meta span,
.detail-item span {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.profile-meta strong {
  max-width: 60%;
  color: var(--text);
  text-align: right;
  overflow-wrap: anywhere;
}

.detail-card .card-header,
.appointment-card .card-header {
  padding: 1rem 1.5rem;
  color: var(--primary-dark);
  background: var(--surface-alt);
  border-bottom: 1px solid var(--surface-border);
}

.detail-information {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 2rem;
}

.detail-item {
  min-width: 0;
}

.detail-item strong {
  display: block;
  margin-top: 0.3rem;
  color: var(--text);
  overflow-wrap: anywhere;
}

.detail-item-wide {
  grid-column: 1 / -1;
}

.detail-actions {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.appointment-card {
  margin-top: 1.25rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.appointment-item:last-child {
  border-bottom: 0;
}

.appointment-item small {
  display: block;
  margin-top: 0.2rem;
  color: var(--text-muted);
}

.empty-state {
  padding: 1.5rem 0;
  color: var(--text-muted);
  text-align: center;
}

.empty-state i {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary-light);
  font-size: 2rem;
}

.empty-state p {
  margin: 0;
}

@media (max-width: 900px) {
  .user-detail-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    max-width: none;
  }
}

@media (max-width: 576px) {
  .user-detail-header {
    align-items: flex-start !important;
    flex-direction: column;
  }

  .detail-header-actions,
  .detail-header-actions .btn {
    width: 100%;
  }

  .detail-header-actions .btn {
    flex: 1;
  }

  .detail-information {
    grid-template-columns: 1fr;
  }

  .detail-item-wide {
    grid-column: auto;
  }

  .detail-actions,
  .detail-actions .btn {
    width: 100%;
  }

  .detail-actions .btn {
    flex: 1;
  }

  .profile-meta div {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }

  .profile-meta strong {
    max-width: 100%;
    text-align: left;
  }
}
</style>
