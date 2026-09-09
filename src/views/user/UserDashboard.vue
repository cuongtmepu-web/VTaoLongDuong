<template>
  <UserLayout>
    <div class="user-dashboard">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow mb-1">Không gian sức khỏe của bạn</p>
          <h1>Xin chào, {{ authStore.user?.fullName || 'bạn' }}</h1>
          <p class="text-muted mb-0">Theo dõi lịch khám và hồ sơ điều trị của bạn.</p>
        </div>
        <i class="bi bi-heart-pulse heading-icon" aria-hidden="true"></i>
      </div>

      <div class="row g-3">
        <div v-for="stat in statCards" :key="stat.label" class="col-sm-6 col-xl-3">
          <div class="stat-card" :class="stat.className">
            <i :class="stat.icon" aria-hidden="true"></i>
            <div class="stat-info">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <AppointmentAnalytics :appointments="appointmentStore.appointments" />

      <div class="row g-4">
        <div class="col-lg-8 dashboard-lower">
          <section class="dashboard-panel">
            <div class="panel-heading">
              <h2>Lịch hẹn gần đây</h2>
              <router-link to="/user-appointments" class="btn btn-sm btn-primary"
                >Xem tất cả</router-link
              >
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </div>
              <div v-else-if="recentAppointments.length === 0" class="text-center py-4">
                <p class="text-muted">Chưa có lịch hẹn nào</p>
                <router-link to="/user-appointments/book" class="btn btn-primary">
                  Đặt lịch ngay
                </router-link>
              </div>
              <div v-else>
                <div
                  v-for="appointment in recentAppointments"
                  :key="appointment.appointmentId"
                  class="appointment-item d-flex justify-content-between align-items-center border-bottom py-3"
                >
                  <div>
                    <h6 class="mb-1">{{ appointment.doctorName }}</h6>
                    <small class="text-muted">
                      <i class="bi bi-calendar3"></i> {{ formatDate(appointment.appointmentDate) }}
                      <i class="bi bi-clock ms-2"></i> {{ appointment.appointmentTime }}
                    </small>
                  </div>
                  <span :class="getStatusClass(appointment.status)" class="badge">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col-lg-4 dashboard-lower">
          <section class="dashboard-panel quick-panel">
            <div class="panel-heading"><h2>Thao tác nhanh</h2></div>
            <div class="quick-actions">
              <div class="d-grid gap-3">
                <router-link to="/user-appointments/book" class="btn btn-primary">
                  <i class="bi bi-calendar-plus"></i> Đặt lịch hẹn
                </router-link>
                <router-link to="/user-appointments" class="btn btn-outline-primary">
                  <i class="bi bi-calendar-check"></i> Xem lịch hẹn
                </router-link>
                <router-link to="/user-medical-records" class="btn btn-outline-primary">
                  <i class="bi bi-file-medical"></i> Hồ sơ bệnh án
                </router-link>
                <router-link to="/user-profile" class="btn btn-outline-secondary">
                  <i class="bi bi-person-gear"></i> Cập nhật thông tin
                </router-link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AppointmentAnalytics from '@/components/charts/AppointmentAnalytics.vue'
import { useAppointmentStore } from '@/api/stores/appointment'
import { useAuthStore } from '@/api/stores/auth'
import { medicalRecordApi } from '@/api/medicalRecord'
import type { MedicalRecord } from '@/api/types/medicalRecord'
import dayjs from 'dayjs'

const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()
const loading = ref(false)
const medicalRecords = ref<MedicalRecord[]>([])

const stats = computed(() => ({
  totalAppointments: appointmentStore.appointments.length,
  pendingAppointments: appointmentStore.pendingAppointments.length,
  completedAppointments: appointmentStore.completedAppointments.length,
  medicalRecords: medicalRecords.value.length,
}))

const statCards = computed(() => [
  {
    label: 'Tổng lịch hẹn',
    value: stats.value.totalAppointments,
    icon: 'bi bi-calendar-check',
    className: 'stat-green',
  },
  {
    label: 'Chờ xác nhận',
    value: stats.value.pendingAppointments,
    icon: 'bi bi-hourglass-split',
    className: 'stat-gold',
  },
  {
    label: 'Đã hoàn thành',
    value: stats.value.completedAppointments,
    icon: 'bi bi-check-circle',
    className: 'stat-teal',
  },
  {
    label: 'Hồ sơ bệnh án',
    value: stats.value.medicalRecords,
    icon: 'bi bi-file-medical',
    className: 'stat-brown',
  },
])

const recentAppointments = computed(() => appointmentStore.appointments.slice(0, 5))

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Confirmed: 'bg-info',
    Completed: 'bg-success',
    Cancelled: 'bg-danger',
    NoShow: 'bg-secondary',
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    NoShow: 'Vắng mặt',
  }
  return texts[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    await appointmentStore.fetchAppointments()
    const response = await medicalRecordApi.getAll()
    if (response.data.success) {
      medicalRecords.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.eyebrow {
  color: var(--secondary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dashboard-heading h1 {
  margin: 0;
  color: var(--primary-dark);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.7rem);
}

.heading-icon {
  color: var(--gold);
  font-size: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 112px;
  padding: 1.15rem;
  color: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.stat-green {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
}
.stat-gold {
  background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
}
.stat-teal {
  background: linear-gradient(135deg, #477f76, #6d9d94);
}
.stat-brown {
  background: linear-gradient(135deg, #987544, var(--gold));
}

.stat-card > i {
  font-size: 2rem;
  opacity: 0.86;
}

.stat-info strong,
.stat-info span {
  display: block;
}

.stat-info strong {
  font-size: 1.55rem;
}

.stat-info span {
  font-size: 0.8rem;
  opacity: 0.86;
}

.dashboard-panel {
  height: 100%;
  padding: 1.25rem;
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.dashboard-lower {
  margin-top: 1.5rem;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-heading h2 {
  margin: 0;
  color: var(--primary-dark);
  font-family: var(--font-heading);
  font-size: 1.4rem;
}

.dashboard-panel .card-body {
  padding: 0;
}

.quick-panel .quick-actions {
  padding-top: 0.25rem;
}

.appointment-item:last-child {
  border-bottom: none !important;
}

@media (max-width: 768px) {
  .dashboard-heading {
    align-items: flex-start;
  }

  .heading-icon {
    font-size: 2.25rem;
  }
}
</style>
