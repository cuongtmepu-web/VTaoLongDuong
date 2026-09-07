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
                    <input type="date" class="form-control" v-model="form.dateOfBirth" />
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

const loadUserData = () => {
  const user = authStore.user
  if (user) {
    form.fullName = user.fullName || ''
    form.phone = user.phone || ''
    form.email = user.email || ''
    form.dateOfBirth = user.dateOfBirth || ''
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

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-wrapper img {
  border: 4px solid #f8f9fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
