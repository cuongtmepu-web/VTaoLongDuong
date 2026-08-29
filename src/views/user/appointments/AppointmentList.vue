<template>
  <UserLayout>
    <div class="appointment-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Lịch hẹn của tôi</h2>
        <router-link to="/user/appointments/book" class="btn btn-primary">
          <i class="bi bi-calendar-plus"></i> Đặt lịch mới
        </router-link>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
            href="#"
          >
            Tất cả ({{ appointments.length }})
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'pending' }"
            @click="activeTab = 'pending'"
            href="#"
          >
            Chờ xác nhận ({{ pendingCount }})
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'confirmed' }"
            @click="activeTab = 'confirmed'"
            href="#"
          >
            Đã xác nhận ({{ confirmedCount }})
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'completed' }"
            @click="activeTab = 'completed'"
            href="#"
          >
            Hoàn thành ({{ completedCount }})
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'cancelled' }"
            @click="activeTab = 'cancelled'"
            href="#"
          >
            Đã hủy ({{ cancelledCount }})
          </a>
        </li>
      </ul>

      <!-- List -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
      <div v-else-if="filteredAppointments.length === 0" class="text-center py-5">
        <i class="bi bi-calendar-x display-1 text-muted"></i>
        <h4 class="mt-3">Không có lịch hẹn nào</h4>
        <p class="text-muted">Bạn chưa có lịch hẹn nào trong danh sách này</p>
        <router-link to="/user/appointments/book" class="btn btn-primary">
          Đặt lịch ngay
        </router-link>
      </div>
      <div v-else>
        <div
          v-for="appointment in filteredAppointments"
          :key="appointment.appointmentId"
          class="appointment-card card mb-3"
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-7">
                <div class="d-flex align-items-center mb-2">
                  <h5 class="mb-0 me-3">{{ appointment.doctorName }}</h5>
                  <span :class="getStatusClass(appointment.status)" class="badge">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </div>
                <div class="appointment-details">
                  <p class="mb-1">
                    <i class="bi bi-calendar3 text-primary"></i>
                    {{ formatDate(appointment.appointmentDate) }}
                  </p>
                  <p class="mb-1">
                    <i class="bi bi-clock text-primary"></i>
                    {{ formatTime(appointment.appointmentTime) }}
                  </p>
                  <p class="mb-0" v-if="appointment.symptoms">
                    <i class="bi bi-clipboard text-primary"></i>
                    {{ appointment.symptoms }}
                  </p>
                </div>
              </div>
              <div class="col-md-5 text-end">
                <div class="btn-group">
                  <router-link
                    :to="`/user/appointments/${appointment.appointmentId}`"
                    class="btn btn-outline-primary btn-sm"
                  >
                    Chi tiết
                  </router-link>
                  <button
                    v-if="appointment.status === 'Pending' || appointment.status === 'Confirmed'"
                    class="btn btn-outline-danger btn-sm"
                    @click="cancelAppointment(appointment.appointmentId)"
                  >
                    Hủy lịch
                  </button>
                </div>
                <p class="mt-2 text-muted small">
                  <i class="bi bi-clock-history"></i>
                  Đặt lúc: {{ formatDateTime(appointment.createdAt) }}
                </p>
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
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const appointmentStore = useAppointmentStore()
const activeTab = ref('all')

const appointments = computed(() => appointmentStore.appointments)
const loading = computed(() => appointmentStore.loading)

const pendingCount = computed(() => appointments.value.filter((a) => a.status === 'Pending').length)
const confirmedCount = computed(
  () => appointments.value.filter((a) => a.status === 'Confirmed').length,
)
const completedCount = computed(
  () => appointments.value.filter((a) => a.status === 'Completed').length,
)
const cancelledCount = computed(
  () => appointments.value.filter((a) => a.status === 'Cancelled').length,
)

const filteredAppointments = computed(() => {
  if (activeTab.value === 'all') return appointments.value
  return appointments.value.filter((a) => a.status.toLowerCase() === activeTab.value)
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(`2000-01-01 ${time}`).format('HH:mm')
}

const formatDateTime = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
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

const cancelAppointment = async (id: number) => {
  if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return

  const success = await appointmentStore.cancelAppointment(id, 'Hủy bởi người dùng')
  if (success) {
    await appointmentStore.fetchAppointments()
  }
}

onMounted(() => {
  appointmentStore.fetchAppointments()
})
</script>

<style scoped>
.appointment-list {
  padding: 20px;
}

.appointment-card {
  transition: all 0.2s;
}

.appointment-card:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.appointment-details p {
  color: #6c757d;
  font-size: 0.9rem;
}

.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
