<template>
  <DoctorLayout>
    <div class="doctor-dashboard">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Khu vực bác sĩ</p>
          <h1>Dashboard</h1>
          <p class="text-muted">Theo dõi công việc và lịch khám của bạn.</p>
        </div>
        <i class="bi bi-heart-pulse page-icon" aria-hidden="true"></i>
      </div>

      <div class="row g-4">
        <div v-for="stat in stats" :key="stat.label" class="col-md-4">
          <div class="stat-card">
            <i :class="stat.icon" aria-hidden="true"></i>
            <div>
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Truy cập nhanh</h2>
        <div class="row g-3">
          <div v-for="action in actions" :key="action.to" class="col-md-4">
            <router-link :to="action.to" class="action-link">
              <i :class="action.icon" aria-hidden="true"></i>
              <span>{{ action.label }}</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import DoctorLayout from '@/layouts/DoctorLayout.vue'

const stats = [
  { label: 'Lịch hẹn hôm nay', value: '--', icon: 'bi bi-calendar-check' },
  { label: 'Hồ sơ cần xử lý', value: '--', icon: 'bi bi-file-medical' },
  { label: 'Trạng thái làm việc', value: 'Đang hoạt động', icon: 'bi bi-heart-pulse' },
]

const actions = [
  { label: 'Xem lịch hẹn', to: '/doctor/appointments', icon: 'bi bi-calendar-check' },
  { label: 'Hồ sơ bệnh án', to: '/doctor/medical-records', icon: 'bi bi-file-medical' },
  { label: 'Lịch làm việc', to: '/doctor/schedule', icon: 'bi bi-calendar-week' },
]
</script>

<style scoped>
.doctor-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}
.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.eyebrow {
  margin-bottom: 0.35rem;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  color: var(--primary-dark);
}
.page-icon {
  color: var(--gold);
  font-size: 3rem;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 120px;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.stat-card > i {
  color: var(--primary);
  font-size: 2rem;
}
.stat-card strong,
.stat-card span {
  display: block;
}
.stat-card strong {
  color: var(--primary-dark);
  font-size: 1.4rem;
}
.stat-card span {
  color: var(--text-muted);
  font-size: 0.85rem;
}
.quick-actions {
  margin-top: 2rem;
}
h2 {
  margin-bottom: 1rem;
  color: var(--primary-dark);
  font-size: 1.4rem;
}
.action-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--text-soft);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  transition:
    transform 0.25s var(--ease),
    border-color 0.25s var(--ease);
}
.action-link:hover {
  color: var(--primary-dark);
  border-color: var(--primary);
  transform: translateY(-2px);
}
.action-link > i:first-child {
  color: var(--primary);
  font-size: 1.25rem;
}
.action-link > i:last-child {
  margin-left: auto;
}
</style>
