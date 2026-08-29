<template>
  <UserLayout>
    <div class="change-password">
      <h2 class="mb-4">Đổi mật khẩu</h2>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">Mật khẩu hiện tại</label>
                  <div class="input-group">
                    <input
                      :type="showCurrentPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="form.currentPassword"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu mới</label>
                  <div class="input-group">
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="form.newPassword"
                      required
                      minlength="6"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small class="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>

                <div class="mb-3">
                  <label class="form-label">Xác nhận mật khẩu mới</label>
                  <div class="input-group">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="form.confirmPassword"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div
                  v-if="
                    form.newPassword &&
                    form.confirmPassword &&
                    form.newPassword !== form.confirmPassword
                  "
                  class="alert alert-danger"
                >
                  Mật khẩu xác nhận không khớp
                </div>

                <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5>Lưu ý</h5>
              <ul class="text-muted small">
                <li class="mb-2">Mật khẩu phải có ít nhất 6 ký tự</li>
                <li class="mb-2">Nên sử dụng cả chữ hoa, chữ thường và số</li>
                <li>Không nên sử dụng mật khẩu dễ đoán</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
import { useAuthStore } from '@/api/stores/auth'
import { useToast } from '@erag/vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isFormValid = computed(() => {
  return (
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    form.newPassword === form.confirmPassword &&
    form.newPassword.length >= 6
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  const success = await authStore.changePassword({
    currentPassword: form.currentPassword,
    newPassword: form.newPassword,
  })
  loading.value = false

  if (success) {
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }
}
</script>

<style scoped>
.change-password {
  padding: 20px;
}
</style>
