<template>
  <AdminLayout>
    <div class="calendar-view">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Lịch làm việc</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary" @click="prevMonth">
            <i class="bi bi-chevron-left"></i>
          </button>
          <h5 class="mb-0 align-self-center">{{ currentMonth }} {{ currentYear }}</h5>
          <button class="btn btn-secondary" @click="nextMonth">
            <i class="bi bi-chevron-right"></i>
          </button>
          <button class="btn btn-primary" @click="today">
            <i class="bi bi-calendar3"></i> Hôm nay
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>

          <div v-else>
            <div class="calendar-grid">
              <div class="calendar-header">
                <div v-for="day in weekDays" :key="day" class="header-cell">
                  {{ day }}
                </div>
              </div>

              <div class="calendar-body">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="day-cell"
                  :class="{
                    empty: !day,
                    today: isToday(day),
                    'has-appointments': day && getAppointments(day).length > 0,
                  }"
                  @click="day && selectDay(day)"
                >
                  <div class="day-number">{{ day }}</div>
                  <div class="day-appointments" v-if="day">
                    <div
                      v-for="appt in getAppointments(day).slice(0, 3)"
                      :key="appt.id"
                      class="appointment-badge"
                      :class="getStatusClass(appt.status)"
                    >
                      {{ appt.time }} - {{ appt.patient }}
                    </div>
                    <div v-if="getAppointments(day).length > 3" class="more-badge">
                      +{{ getAppointments(day).length - 3 }} more
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointment Modal -->
      <div class="modal fade" id="dayModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Lịch hẹn ngày {{ selectedDate }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div v-if="dayAppointments.length === 0" class="text-center py-4">
                <p class="text-muted">Không có lịch hẹn trong ngày này</p>
              </div>
              <div v-else>
                <div v-for="appt in dayAppointments" :key="appt.id" class="appointment-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{{ appt.time }} - {{ appt.patient }}</h6>
                      <small class="text-muted">Bác sĩ: {{ appt.doctor }}</small>
                    </div>
                    <span :class="getStatusClass(appt.status)" class="badge">
                      {{ getStatusText(appt.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminAppointmentApi } from '@/api/admin/adminAppointment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'
import { Modal } from 'bootstrap'

const toast = useToast()
const loading = ref(false)
const currentYear = ref(dayjs().year())
const currentMonth = ref(dayjs().month())
const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const appointments = ref<any[]>([])
const selectedDate = ref('')
const dayAppointments = ref<any[]>([])
const modalRef = ref<HTMLElement | null>(null)
let modal: Modal | null = null

const calendarDays = computed(() => {
  const days: (number | null)[] = []
  const firstDay = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`)
  const lastDay = firstDay.endOf('month')
  const startPadding = firstDay.day()

  // Add empty cells for padding
  for (let i = 0; i < startPadding; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= lastDay.date(); i++) {
    days.push(i)
  }

  return days
})

const getAppointments = (day: number) => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${day}`).format('YYYY-MM-DD')
  return appointments.value.filter((a) => a.date === date)
}

const isToday = (day: number | null) => {
  if (!day) return false
  return dayjs(`${currentYear.value}-${currentMonth.value + 1}-${day}`).isSame(dayjs(), 'day')
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

const fetchAppointments = async () => {
  loading.value = true
  try {
    const response = await adminAppointmentApi.getCalendar({
      month: currentMonth.value + 1,
      year: currentYear.value,
    })
    if (response.data.success) {
      appointments.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải lịch')
  } finally {
    loading.value = false
  }
}

const selectDay = (day: number) => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${day}`).format('YYYY-MM-DD')
  selectedDate.value = dayjs(date).format('DD/MM/YYYY')
  dayAppointments.value = getAppointments(day)
  if (modal) {
    modal.show()
  }
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  fetchAppointments()
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  fetchAppointments()
}

const today = () => {
  const now = dayjs()
  currentYear.value = now.year()
  currentMonth.value = now.month()
  fetchAppointments()
}

watch([currentYear, currentMonth], () => {
  fetchAppointments()
})

onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
  }
  fetchAppointments()
})
</script>

<style scoped>
.calendar-view {
  padding: 20px;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.header-cell {
  padding: 15px;
  text-align: center;
  background: #f8f9fa;
  font-weight: 600;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.day-cell {
  min-height: 100px;
  padding: 8px;
  background: white;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.day-cell:hover {
  background: #f8f9fa;
  transform: scale(1.02);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.day-cell.empty {
  background: #fafafa;
  cursor: default;
}

.day-cell.today {
  background: #e3f2fd;
  border-color: #2196f3;
}

.day-cell.has-appointments {
  background: #f0f7ff;
}

.day-number {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.day-appointments {
  flex: 1;
  overflow: hidden;
}

.appointment-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.appointment-badge.bg-warning {
  background: #ffc107 !important;
  color: #333;
}

.more-badge {
  font-size: 0.65rem;
  color: #6c757d;
}

.appointment-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.appointment-item:last-child {
  border-bottom: none;
}
</style>
