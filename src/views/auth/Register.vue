<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">Đăng ký tài khoản</h3>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên *</label>
                    <input type="text" class="form-control" v-model="form.fullName" required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại *</label>
                    <input type="tel" class="form-control" v-model="form.phone" required />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" v-model="form.email" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập *</label>
                  <input type="text" class="form-control" v-model="form.username" required />
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Mật khẩu *</label>
                    <input type="password" class="form-control" v-model="form.password" required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Xác nhận mật khẩu *</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="form.confirmPassword"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <input type="date" class="form-control" v-model="form.dateOfBirth" />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Giới tính</label>
                    <select class="form-select" v-model.number="form.gender">
                      <option :value="null">Chọn giới tính</option>
                      <option :value="1">Nam</option>
                      <option :value="2">Nữ</option>
                      <option :value="3">Khác</option>
                    </select>
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

                <button type="submit" class="btn btn-success w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Đăng ký
                </button>
              </form>

              <div class="mt-3 text-center">
                <p class="text-muted">
                  Đã có tài khoản?
                  <router-link to="/login" class="text-primary">Đăng nhập</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/api/stores/auth'
import { useToast } from '@erag/vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)

const form = reactive<{
  username: string
  password: string
  confirmPassword: string
  email: string
  fullName: string
  phone: string
  dateOfBirth: string
  gender: number | null
  address: string
}>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  fullName: '',
  phone: '',
  dateOfBirth: '',
  gender: null,
  address: '',
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    toast.error('Mật khẩu xác nhận không khớp')
    return
  }

  loading.value = true
  try {
    await authStore.register({
      ...form,
      gender: form.gender ?? 0, // Đảm bảo gender có kiểu number khi gửi tới store
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
