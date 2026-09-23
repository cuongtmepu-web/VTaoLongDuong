<template>
  <AdminLayout>
    <div class="user-form">
      <div class="user-form-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <span class="form-kicker">QUẢN LÝ TÀI KHOẢN</span>
          <h2 class="mb-0">Thêm người dùng mới</h2>
        </div>
        <router-link to="/admin-users" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div class="card user-form-card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="username">Tên đăng nhập *</label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  required
                  autocomplete="username"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="email">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="fullName">Họ và tên *</label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label" for="phone">Số điện thoại</label>
                <input id="phone" v-model="form.phone" type="tel" class="form-control" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label" for="password">Mật khẩu *</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  required
                  minlength="6"
                  autocomplete="new-password"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Vai trò *</label>
                <BaseSelect
                  v-model="form.role"
                  :options="[
                    { value: 'User', label: 'Người dùng' },
                    { value: 'Doctor', label: 'Bác sĩ' },
                    { value: 'Admin', label: 'Quản trị viên' },
                  ]"
                />
              </div>
            </div>

            <div class="form-check form-switch mb-4">
              <input
                id="activeSwitch"
                v-model="form.isActive"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label" for="activeSwitch">Kích hoạt tài khoản</label>
            </div>

            <div class="user-form-actions d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-person-plus"></i>
                Thêm người dùng
              </button>
              <router-link to="/admin-users" class="btn btn-secondary">Hủy</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { adminUserApi, type CreateUserRequest } from '@/api/admin/adminUser'
import { useToast } from '@erag/vue-toastification'

const router = useRouter()
const toast = useToast()
const submitting = ref(false)

const form = reactive<CreateUserRequest>({
  username: '',
  password: '',
  email: '',
  fullName: '',
  phone: '',
  role: 'User',
  isActive: true,
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    const response = await adminUserApi.createUser(form)
    if (response.data.success) {
      toast.success('Thêm người dùng thành công')
      router.push('/admin-users')
    }
  } catch (error) {
    toast.error('Thêm người dùng thất bại')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.user-form {
  width: 100%;
}

.user-form-header {
  gap: 1rem;
}

.form-kicker {
  color: var(--secondary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.user-form h2 {
  margin-top: 0.35rem;
  color: var(--text);
  font-size: clamp(1.8rem, 3vw, 2.35rem);
}

.user-form-card {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.user-form-card .card-body {
  padding: clamp(1.25rem, 3vw, 2.25rem);
}

.user-form .form-label {
  color: var(--text-soft);
  font-weight: 600;
}

@media (max-width: 768px) {
  .user-form-header {
    align-items: flex-start !important;
    flex-direction: column;
  }

  .user-form-header .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .user-form h2 {
    font-size: 1.7rem;
  }

  .user-form-card .card-body {
    padding: 1rem;
  }

  .user-form-actions {
    flex-direction: column;
  }

  .user-form-actions .btn {
    width: 100%;
  }
}
</style>
