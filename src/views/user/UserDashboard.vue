<template>
  <UserLayout>
    <div class="user-dashboard">
      <h2 class="mb-4">Dashboard</h2>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.totalAppointments }}</h3>
              <p>Tổng lịch hẹn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.pendingAppointments }}</h3>
              <p>Đang chờ xác nhận</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.completedAppointments }}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="bi bi-file-medical"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.medicalRecords }}</h3>
              <p>Hồ sơ bệnh án</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Appointments -->
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Lịch hẹn gần đây</h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </div>
              <div v-else-if="recentAppointments.length === 0" class="text-center py-4">
                <p class="text-muted">Chưa có lịch hẹn nào</p>
                <router-link to="/user/appointments/book" class="btn btn-primary">
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
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Thao tác nhanh</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-3">
                <router-link to="/user/appointments/book" class="btn btn-primary">
                  <i class="bi bi-calendar-plus"></i> Đặt lịch hẹn
                </router-link>
                <router-link to="/user/appointments" class="btn btn-outline-primary">
                  <i class="bi bi-calendar-check"></i> Xem lịch hẹn
                </router-link>
                <router-link to="/user/medical-records" class="btn btn-outline-success">
                  <i class="bi bi-file-medical"></i> Hồ sơ bệnh án
                </router-link>
                <router-link to="/user/profile" class="btn btn-outline-secondary">
                  <i class="bi bi-person-gear"></i> Cập nhật thông tin
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
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
  padding: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-info p {
  margin: 0;
  opacity: 0.8;
}

.appointment-item:last-child {
  border-bottom: none !important;
}
</style>
