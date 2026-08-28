<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <div class="row align-items-center min-vh-75">
        <div class="col-lg-8 mx-auto text-center text-white">
          <h1 class="display-3 fw-bold mb-4 animate__animated animate__fadeInUp">
            {{ sectionData.title || 'Tảo Long Đường - Đông y gia truyền' }}
          </h1>
          <p class="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">
            {{ sectionData.subtitle || 'Hơn 10 năm kinh nghiệm chăm sóc sức khỏe cộng đồng' }}
          </p>
          <div class="animate__animated animate__fadeInUp animate__delay-2s">
            <router-link
              v-if="authStore.isAuthenticated"
              to="/user/appointments/book"
              class="btn btn-warning btn-lg me-3"
            >
              {{ sectionData.buttonText || 'Đặt lịch ngay' }}
            </router-link>
            <router-link v-else to="/login" class="btn btn-warning btn-lg me-3">
              {{ sectionData.buttonText || 'Đặt lịch ngay' }}
            </router-link>
            <router-link to="/bai-thuoc" class="btn btn-outline-light btn-lg">
              Xem bài thuốc
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import { useAuthStore } from '@/api/stores/auth'

const landingStore = useLandingStore()
const authStore = useAuthStore()

const sectionData = computed(() => landingStore.getSection('hero'))
</script>

<style scoped>
.hero-section {
  background: url('/images/hero-bg.jpg') center/cover no-repeat;
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.min-vh-75 {
  min-height: 75vh;
}
</style>
