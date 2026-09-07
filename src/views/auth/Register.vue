<template>
  <div class="register-page">
    <div class="mist-layer"></div>
    <svg class="taiji-watermark" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1" />
      <path
        d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
        fill="currentColor"
      />
      <circle cx="50" cy="26.5" r="7" fill="transparent" stroke="currentColor" stroke-width="1" />
      <circle cx="50" cy="73.5" r="7" fill="currentColor" />
    </svg>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <div class="auth-brand">
                <router-link to="/" aria-label="Trang chủ Tảo Long Đường">
                  <svg viewBox="0 0 100 100" class="brand-taiji" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    />
                    <path
                      d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
                      fill="currentColor"
                    />
                    <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
                    <circle cx="50" cy="73.5" r="7" fill="currentColor" />
                  </svg>
                </router-link>
              </div>
              <h3 class="text-center mb-1">Đăng ký tài khoản</h3>
              <p class="text-center auth-sub mb-4">
                Bắt đầu hành trình chăm sóc sức khỏe cùng chúng tôi
              </p>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên <span style="color: red">*</span></label>
                    <input type="text" class="form-control" v-model="form.fullName" required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label"
                      >Số điện thoại <span style="color: red">*</span></label
                    >
                    <input type="tel" class="form-control" v-model="form.phone" required />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email <span style="color: red">*</span></label>
                  <input type="email" class="form-control" v-model="form.email" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập <span style="color: red">*</span></label>
                  <input type="text" class="form-control" v-model="form.username" required />
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Mật khẩu <span style="color: red">*</span></label>
                    <div class="password-wrapper">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control password-input"
                        v-model="form.password"
                        required
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        class="password-toggle-btn"
                        type="button"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label"
                      >Xác nhận mật khẩu <span style="color: red">*</span></label
                    >
                    <div class="password-wrapper">
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control password-input"
                        v-model="form.confirmPassword"
                        required
                        placeholder="Xác nhận mật khẩu"
                      />
                      <button
                        class="password-toggle-btn"
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
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
                        { value: null, label: 'Chọn giới tính' },
                        { value: 1, label: 'Nam' },
                        { value: 2, label: 'Nữ' },
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

                <button type="submit" class="btn btn-gold w-100" :disabled="loading">
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
import BaseSelect from '@/components/common/BaseSelect.vue'

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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
  position: relative;
  min-height: 100vh;
  padding: 8rem 0 3rem;
  overflow: hidden;
  background: radial-gradient(120% 100% at 50% 0%, #23392f 0%, #16241f 55%, #0f1a16 100%);
}
.register-page :deep(.mist-layer)::before {
  background: radial-gradient(circle, rgba(185, 122, 69, 0.22), transparent 70%);
  mix-blend-mode: screen;
}
.register-page :deep(.mist-layer)::after {
  background: radial-gradient(circle, rgba(47, 111, 99, 0.28), transparent 70%);
  mix-blend-mode: screen;
}
.taiji-watermark {
  position: absolute;
  top: 10%;
  left: 50%;
  width: min(70vw, 900px);
  height: min(70vw, 900px);
  transform: translateX(-50%);
  color: rgba(233, 216, 179, 0.06);
  animation: taijiSpin 100s linear infinite;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .taiji-watermark {
    animation: none;
  }
}

.register-page .container {
  position: relative;
  z-index: 1;
  width: 40%;
  text-align: center;
  margin: 0 auto;
}
.register-page h3 {
  font-size: 40px;
}
.register-page .mb-3 {
  margin-bottom: 5px;
}
.register-page .card {
  border-radius: 24px;
  border: 1px solid var(--gold-light) !important;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35) !important;
  background: var(--surface);
}
.auth-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.brand-taiji {
  width: 48px;
  height: 48px;
  color: var(--primary-dark);
}
.register-page h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text);
}
.auth-sub {
  color: var(--text-muted);
  font-size: 0.92rem;
  font-style: italic;
}

/* Password wrapper styles - đưa icon vào bên trong input */
.password-wrapper {
  position: relative;
  width: 100%;
}

.password-input {
  padding-right: 45px; /* Tạo khoảng trống cho icon */
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle-btn:hover {
  color: var(--primary-dark, #b8860b);
}

.password-toggle-btn:focus {
  outline: none;
}

/* Đảm bảo input không bị che khuất khi focus */
.password-input:focus {
  padding-right: 45px;
}

/* Tùy chỉnh cho dark theme nếu có */
.password-toggle-btn i {
  font-size: 1.2rem;
  line-height: 1;
}

@media (max-width: 576px), (max-width: 786px), (max-width: 1024px) {
  .register-page .container {
    width: calc(100% - 30px);
  }
}
</style>
