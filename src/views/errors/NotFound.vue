<template>
  <div class="not-found-page">
    <div class="container">
      <div class="row justify-content-center align-items-center" style="min-height: 100vh">
        <div class="col-md-6 text-center">
          <div class="error-code display-1 fw-bold text-primary">404</div>
          <h1 class="mb-3">Không tìm thấy trang</h1>
          <p class="text-muted mb-4">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
          <div class="d-flex justify-content-center gap-3">
            <router-link to="/" class="btn btn-primary">
              <i class="bi bi-house"></i> Về trang chủ
            </router-link>
            <button class="btn btn-outline-secondary" @click="goBack">
              <i class="bi bi-arrow-left"></i> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at top, rgba(20, 184, 166, 0.16), transparent 30%),
    linear-gradient(135deg, #0f172a 0%, #0f766e 100%);
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.22);
  text-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);
}

.not-found-page h1 {
  color: white;
  font-weight: 800;
}

.not-found-page .text-muted {
  color: rgba(255, 255, 255, 0.76) !important;
}
</style>
