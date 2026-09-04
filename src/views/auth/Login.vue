<template>
  <div class="login-page">
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
        <div class="col-md-6 col-lg-5">
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
              <h3 class="text-center mb-1">Đăng nhập</h3>
              <p class="text-center auth-sub mb-4">Chào mừng trở lại Tảo Long Đường</p>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập hoặc Email</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.username"
                    required
                    placeholder="Nhập tên đăng nhập hoặc email"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
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

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Đăng nhập
                </button>
              </form>

              <div class="mt-3 text-center">
                <p class="text-muted">
                  Chưa có tài khoản?
                  <router-link to="/dang-ky" class="text-secondary">Đăng ký ngay</router-link>
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

const authStore = useAuthStore()
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  loading.value = true
  await authStore.login(form.username, form.password)
  loading.value = false
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(120% 100% at 50% 0%, #23392f 0%, #16241f 55%, #0f1a16 100%);
}

.login-page :deep(.mist-layer)::before {
  background: radial-gradient(circle, rgba(185, 122, 69, 0.22), transparent 70%);
  mix-blend-mode: screen;
}
.login-page :deep(.mist-layer)::after {
  background: radial-gradient(circle, rgba(47, 111, 99, 0.28), transparent 70%);
  mix-blend-mode: screen;
}
.taiji-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(70vw, 900px);
  height: min(70vw, 900px);
  transform: translate(-50%, -50%);
  color: rgba(233, 216, 179, 0.06);
  animation: taijiSpin 100s linear infinite;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .taiji-watermark {
    animation: none;
  }
}

.login-page .container {
  position: relative;
  z-index: 1;
  text-align: center;
  margin: 0 auto;
}

.login-page h3 {
  font-size: 40px;
}
.login-page .mb-3 {
  margin-bottom: 6px;
}
.login-page .card {
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
.login-page h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text);
}
.auth-sub {
  color: var(--text-muted);
  font-size: 0.92rem;
  font-style: italic;
}
.login-page .btn-primary {
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
}

/* Password wrapper styles - đưa icon vào bên trong input */
.password-wrapper {
  position: relative;
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
}

.password-toggle-btn:hover {
  color: var(--primary-dark);
}

.password-toggle-btn:focus {
  outline: none;
}

/* Đảm bảo input không bị che khuất khi hover */
.password-input:focus {
  padding-right: 45px;
}

/* Tùy chỉnh cho dark theme nếu có */
.password-toggle-btn i {
  font-size: 1.2rem;
  line-height: 1;
}

@media (max-width: 576px), (max-width: 786px), (max-width: 1024px) {
  .login-page .container {
    width: calc(100% - 30px);
  }
}
</style>
