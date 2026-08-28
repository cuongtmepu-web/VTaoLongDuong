<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">Đăng nhập</h3>

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
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="form.password"
                      required
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      class="btn btn-outline-secondary"
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
                  <router-link to="/dang-ky" class="text-primary">Đăng ký ngay</router-link>
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
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  loading.value = true
  const success = await authStore.login(form.username, form.password)
  loading.value = false

  if (success) {
    // Redirect based on role will be handled in the store
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
