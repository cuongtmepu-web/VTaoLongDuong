<template>
  <UserLayout>
    <div class="profile-info">
      <h2 class="mb-4">Thông tin cá nhân</h2>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input type="text" class="form-control" v-model="form.fullName" required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" v-model="form.phone" required />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="form.email" disabled readonly />
                  <small class="text-muted">Email không thể thay đổi</small>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <div
                      ref="datePickerRoot"
                      class="date-input-wrap"
                      :class="{ 'is-open': isDatePickerOpen }"
                    >
                      <DatePicker v-model="form.dateOfBirth" label="Ngày sinh" />
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Giới tính</label>
                    <BaseSelect
                      v-model="form.gender"
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
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.address"
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>

                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Cập nhật thông tin
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="avatar-wrapper">
                <img
                  :src="authStore.user?.avatarUrl || '/images/default-avatar.jpg'"
                  alt="Avatar"
                  class="rounded-circle mb-3"
                  width="120"
                  height="120"
                />
              </div>
              <h5>{{ authStore.user?.fullName }}</h5>
              <p class="text-muted">{{ authStore.user?.email }}</p>
              <span
                :class="authStore.user?.isActive ? 'text-success' : 'text-danger'"
                class="badge"
              >
                {{ authStore.user?.isActive ? 'Hoạt động' : 'Khóa' }}
              </span>
              <hr />
              <div class="text-start">
                <p><strong>Vai trò:</strong> {{ getRoleText(authStore.user?.role || 'User') }}</p>
                <p><strong>Ngày tạo:</strong> {{ formatDate(authStore.user?.createdAt || '') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import { useAuthStore } from '@/api/stores/auth'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  address: '',
})

const getRoleText = (role: string) => {
  const roles: Record<string, string> = {
    Admin: 'Quản trị viên',
    Doctor: 'Bác sĩ',
    User: 'Người dùng',
  }
  return roles[role] || role
}

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const formatDateInput = (date?: string) => {
  if (!date) return ''
  const parsedDate = dayjs(date)
  return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : ''
}

const loadUserData = () => {
  const user = authStore.user
  if (user) {
    form.fullName = user.fullName || ''
    form.phone = user.phone || ''
    form.email = user.email || ''
    form.dateOfBirth = formatDateInput(user.dateOfBirth)
    form.gender = user.gender?.toString() || ''
    form.address = user.address || ''
  }
}

const handleSubmit = async () => {
  loading.value = true
  const success = await authStore.updateProfile({
    fullName: form.fullName,
    phone: form.phone,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender ? parseInt(form.gender) : undefined,
    address: form.address,
  })
  loading.value = false
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-info {
  padding: 20px;
}

.profile-info .card,
.profile-info .card-body {
  overflow: visible;
}

.profile-info .row > [class*='col-'] {
  position: relative;
}

.profile-info .row > [class*='col-']:has(.date-input-wrap.is-open),
.profile-info .row > [class*='col-']:has(.base-select.is-open) {
  z-index: 40;
}

.date-input-wrap {
  position: relative;
  z-index: 1;
}

.date-input-wrap.is-open {
  z-index: 50;
}

.date-input {
  min-height: 48px;
  padding-left: 2.75rem;
  cursor: pointer;
  border-color: rgba(47, 111, 99, 0.16);
  transition:
    border-color 0.25s var(--ease),
    background 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
}

.date-input:hover {
  background: var(--surface-alt);
  border-color: var(--primary);
}

.date-input:focus {
  background: var(--surface-alt);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.date-input::placeholder {
  color: var(--text-muted);
}

.date-input-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  z-index: 1;
  color: var(--primary);
  font-size: 1.05rem;
  pointer-events: none;
  transform: translateY(-50%);
}

.date-picker-popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 60;
  width: min(300px, 100%);
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.profile-info :deep(.base-select.is-open) {
  z-index: 60;
}

.date-picker-header,
.date-picker-weekdays,
.date-picker-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: center;
}

.date-picker-header {
  grid-template-columns: 2rem 1fr 2rem;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
  color: var(--primary-dark);
  text-align: center;
}

.date-picker-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--primary);
  border-radius: 50%;
}

.date-picker-nav:hover,
.date-picker-nav:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}

.date-picker-weekdays {
  margin-bottom: 0.35rem;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.date-picker-days {
  row-gap: 0.2rem;
}

.date-picker-day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 2rem;
  height: 2rem;
  color: var(--text-soft);
  border-radius: 50%;
  font-size: 0.78rem;
  transition:
    background 0.2s var(--ease),
    color 0.2s var(--ease);
}

.date-picker-day:hover,
.date-picker-day:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}

.date-picker-day.is-outside {
  color: var(--text-muted);
  opacity: 0.48;
}

.date-picker-day.is-today {
  box-shadow: inset 0 0 0 1px var(--gold);
}

.date-picker-day.is-selected {
  color: var(--surface);
  background: var(--primary);
  box-shadow: none;
  font-weight: 700;
}

.date-picker-today {
  width: 100%;
  margin-top: 0.9rem;
  padding-top: 0.7rem;
  color: var(--secondary-dark);
  border-top: 1px solid var(--surface-border);
  font-size: 0.78rem;
  font-weight: 700;
}

.date-picker-today:hover,
.date-picker-today:focus-visible {
  color: var(--primary-dark);
  outline: none;
}

.date-picker-enter-active,
.date-picker-leave-active {
  transition:
    opacity 0.18s var(--ease),
    transform 0.18s var(--ease);
}

.date-picker-enter-from,
.date-picker-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem);
}

@media (max-width: 576px) {
  .profile-info {
    padding: 0;
  }

  .date-input {
    min-height: 46px;
  }

  .date-picker-popover {
    width: min(300px, calc(100vw - 2rem));
  }
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-wrapper img {
  border: 4px solid #f8f9fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
