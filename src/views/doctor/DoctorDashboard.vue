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

      <div class="row g-3">
        <div v-for="stat in stats" :key="stat.label" class="col-sm-6 col-xl-3">
          <div class="stat-card" :class="stat.className">
            <i :class="stat.icon" aria-hidden="true"></i>
            <div>
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <AppointmentAnalytics :appointments="appointmentStore.appointments" />

      <div class="row g-4 dashboard-lower">
        <div class="col-lg-8">
          <section class="dashboard-panel">
            <div class="panel-heading">
              <h2>Lịch hẹn sắp tới</h2>
              <router-link to="/doctor-appointments" class="btn btn-sm btn-primary"
                >Xem tất cả</router-link
              >
            </div>
            <div v-if="loading" class="empty-state">
              <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else-if="upcomingAppointments.length === 0" class="empty-state">
              <i class="bi bi-calendar2-check"></i>
              <span>Chưa có lịch hẹn sắp tới</span>
            </div>
            <div v-else class="appointment-list">
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment.appointmentId"
                class="appointment-row"
              >
                <div>
                  <strong>{{ appointment.userName }}</strong>
                  <small
                    >{{ formatDate(appointment.appointmentDate) }} ·
                    {{ appointment.appointmentTime }}</small
                  >
                </div>
                <span :class="getStatusClass(appointment.status)" class="badge">{{
                  appointment.statusName
                }}</span>
              </div>
            </div>
          </section>
        </div>
        <div class="col-lg-4">
          <section class="dashboard-panel quick-panel">
            <div class="panel-heading"><h2>Truy cập nhanh</h2></div>
            <div class="quick-actions">
              <router-link
                v-for="action in actions"
                :key="action.to"
                :to="action.to"
                class="action-link"
              >
                <i :class="action.icon" aria-hidden="true"></i>
                <span>{{ action.label }}</span>
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </router-link>
            </div>
          </section>
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DoctorLayout from '@/layouts/DoctorLayout.vue'
import AppointmentAnalytics from '@/components/charts/AppointmentAnalytics.vue'
import { useAppointmentStore } from '@/api/stores/appointment'
import { medicalRecordApi } from '@/api/medicalRecord'
import dayjs from 'dayjs'

const appointmentStore = useAppointmentStore()
const loading = ref(false)
const medicalRecordCount = ref(0)

const stats = computed(() => [
  {
    label: 'Lịch hẹn hôm nay',
    value: appointmentStore.appointments.filter((item) =>
      dayjs(item.appointmentDate).isSame(dayjs(), 'day'),
    ).length,
    icon: 'bi bi-calendar-check',
    className: 'stat-green',
  },
  {
    label: 'Hồ sơ cần xử lý',
    value: medicalRecordCount.value,
    icon: 'bi bi-file-medical',
    className: 'stat-gold',
  },
  {
    label: 'Lịch hẹn chờ xác nhận',
    value: appointmentStore.pendingAppointments.length,
    icon: 'bi bi-hourglass-split',
    className: 'stat-teal',
  },
  {
    label: 'Trạng thái làm việc',
    value: 'Đang hoạt động',
    icon: 'bi bi-heart-pulse',
    className: 'stat-brown',
  },
])

const upcomingAppointments = computed(() =>
  appointmentStore.appointments
    .filter((item) => ['Pending', 'Confirmed'].includes(item.status))
    .slice(0, 5),
)

const actions = [
  { label: 'Xem lịch hẹn', to: '/doctor-appointments', icon: 'bi bi-calendar-check' },
  { label: 'Hồ sơ bệnh án', to: '/doctor-medical-records', icon: 'bi bi-file-medical' },
  { label: 'Lịch làm việc', to: '/doctor-schedule', icon: 'bi bi-calendar-week' },
]

const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY')
const getStatusClass = (status: string) =>
  ({
    Pending: 'bg-warning',
    Confirmed: 'bg-info',
    Completed: 'bg-success',
    Cancelled: 'bg-danger',
  })[status] || 'bg-secondary'

onMounted(async () => {
  loading.value = true
  try {
    await appointmentStore.fetchAppointments()
    const response = await medicalRecordApi.getAll()
    if (response.data.success) medicalRecordCount.value = response.data.data.length
  } catch (error) {
    console.error('Failed to load doctor dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.doctor-dashboard {
  max-width: 1400px;
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
  color: var(--surface);
  font-size: 2rem;
}
.stat-card strong,
.stat-card span {
  display: block;
}
.stat-card strong {
  color: var(--surface);
  font-size: 1.4rem;
}
.stat-card span {
  color: var(--surface);
  opacity: 0.86;
  font-size: 0.85rem;
}
.dashboard-lower {
  margin-top: 1.5rem;
}
.dashboard-panel {
  height: 100%;
  padding: 1.25rem;
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
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
  font-size: 1.35rem;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  gap: 0.5rem;
  color: var(--text-muted);
}
.empty-state i {
  color: var(--gold);
  font-size: 1.5rem;
}
.appointment-list {
  display: grid;
  gap: 0.7rem;
}
.appointment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.appointment-row:last-child {
  border-bottom: 0;
}
.appointment-row strong,
.appointment-row small {
  display: block;
}
.appointment-row small {
  margin-top: 0.25rem;
  color: var(--text-muted);
}
.quick-actions {
  display: grid;
  gap: 0.7rem;
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

.doctor-dashboard .row {
  display: flex;
  flex-wrap: wrap;
}

.doctor-dashboard .row.g-3 {
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.doctor-dashboard .row.g-4 {
  margin-right: -0.6rem;
  margin-left: -0.6rem;
}

.doctor-dashboard .row > * {
  padding-right: 0.75rem;
  padding-left: 0.75rem;
  min-width: 0;
}

@media (min-width: 992px) {
  .doctor-dashboard .col-lg-8 {
    flex: 0 0 66.667%;
    max-width: 66.667%;
  }

  .doctor-dashboard .col-lg-4 {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }
}

@media (min-width: 1025px) {
  .doctor-dashboard .col-xl-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

@media (max-width: 1024px) {
  .doctor-dashboard .col-lg-8,
  .doctor-dashboard .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .doctor-dashboard .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }

  .page-icon {
    font-size: 2.25rem;
  }

  .page-heading h1 {
    font-size: 2rem;
  }

  .page-heading .text-muted {
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .stat-card {
    min-height: 108px;
    padding: 0.85rem;
    gap: 0.65rem;
  }

  .stat-card > i {
    flex: 0 0 auto;
    font-size: 1.9rem;
  }

  .stat-card strong {
    font-size: 1.3rem;
  }

  .stat-card span {
    font-size: 0.78rem;
    line-height: 1.25;
  }

  .dashboard-panel {
    padding: 1rem;
  }

  .doctor-dashboard .row.g-3 {
    margin-right: -0.5rem;
    margin-left: -0.5rem;
  }

  .doctor-dashboard .row.g-4 {
    margin-right: -0.6rem;
    margin-left: -0.6rem;
  }

  .doctor-dashboard .row > * {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }

  .panel-heading {
    gap: 0.5rem;
  }

  .panel-heading h2 {
    font-size: 1.15rem;
    line-height: 1.25;
  }

  .dashboard-panel .panel-heading .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
  }

  .appointment-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .appointment-row .badge {
    align-self: flex-start;
  }

  .action-link {
    padding: 0.85rem;
  }
}
</style>
