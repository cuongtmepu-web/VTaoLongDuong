<template>
  <DoctorLayout>
    <section class="feature-page">
      <i class="bi bi-tools feature-icon" aria-hidden="true"></i>
      <p class="eyebrow">Khu vực bác sĩ</p>
      <h1>{{ pageTitle }}</h1>
      <p class="text-muted">
        Chức năng này đang được chuẩn bị để kết nối với dữ liệu nghiệp vụ của bác sĩ.
      </p>
      <router-link to="/doctor-dashboard" class="btn btn-primary">
        <i class="bi bi-arrow-left"></i> Về Dashboard
      </router-link>
    </section>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DoctorLayout from '@/layouts/DoctorLayout.vue'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/doctor/appointments': 'Danh sách lịch hẹn',
    '/doctor/medical-records': 'Hồ sơ bệnh án',
    '/doctor/schedule': 'Lịch làm việc',
    '/doctor/profile': 'Thông tin cá nhân',
    '/doctor/change-password': 'Đổi mật khẩu',
  }
  return titles[route.path] || 'Chức năng bác sĩ'
})
</script>

<style scoped>
.feature-page {
  max-width: 760px;
  margin: 4rem auto;
  padding: 3rem 2rem;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.feature-icon {
  color: var(--gold);
  font-size: 3rem;
}
.eyebrow {
  margin: 1rem 0 0.35rem;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1 {
  color: var(--primary-dark);
}
.feature-page p:not(.eyebrow) {
  margin-bottom: 1.5rem;
}
</style>
