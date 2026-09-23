<template>
  <AdminLayout>
    <div class="doctor-schedule">
      <div class="doctor-schedule-header d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý lịch làm việc</h2>
        <div class="doctor-schedule-actions">
          <router-link to="/admin-doctors" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Quay lại
          </router-link>
          <button class="btn btn-primary" @click="saveSchedule" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-save"></i> Lưu lịch
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="card schedule-card">
        <div class="card-body">
          <div class="schedule-intro">
            <span class="schedule-kicker">LỊCH LÀM VIỆC</span>
            <h5 class="mb-1">{{ doctorName }}</h5>
            <p>Chọn các khung giờ bác sĩ làm việc trong tuần.</p>
          </div>

          <div class="schedule-grid">
            <div v-for="(day, index) in days" :key="index" class="schedule-row">
              <div class="day-label">{{ day.label }}</div>
              <div class="time-slots">
                <div
                  v-for="slot in timeSlots"
                  :key="slot"
                  class="time-slot"
                  :class="{ active: isSlotSelected(day.key, slot) }"
                  @click="toggleSlot(day.key, slot)"
                >
                  {{ slot }}
                </div>
              </div>
            </div>
          </div>

          <div class="schedule-guide mt-4">
            <h6 class="mb-2"><i class="bi bi-info-circle me-2"></i>Hướng dẫn</h6>
            <ul class="text-muted small mb-0">
              <li>Click vào khung giờ để chọn/ bỏ chọn</li>
              <li>Khung giờ được chọn (màu xanh) sẽ hiển thị trên trang đặt lịch</li>
              <li>Khung giờ không được chọn sẽ không hiển thị</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminDoctorApi } from '@/api/admin/adminDoctor'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const doctorName = ref('')

const days = [
  { key: 'Monday', label: 'Thứ 2' },
  { key: 'Tuesday', label: 'Thứ 3' },
  { key: 'Wednesday', label: 'Thứ 4' },
  { key: 'Thursday', label: 'Thứ 5' },
  { key: 'Friday', label: 'Thứ 6' },
  { key: 'Saturday', label: 'Thứ 7' },
  { key: 'Sunday', label: 'Chủ nhật' },
]

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const schedule = ref<Record<string, string[]>>({})

const isSlotSelected = (day: string, slot: string) => {
  return schedule.value[day]?.includes(slot) || false
}

const toggleSlot = (day: string, slot: string) => {
  if (!schedule.value[day]) {
    schedule.value[day] = []
  }
  const index = schedule.value[day].indexOf(slot)
  if (index > -1) {
    schedule.value[day].splice(index, 1)
    if (schedule.value[day].length === 0) {
      delete schedule.value[day]
    }
  } else {
    schedule.value[day].push(slot)
    schedule.value[day].sort()
  }
}

const fetchSchedule = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await adminDoctorApi.getById(parseInt(id))
    if (response.data.success) {
      const data = response.data.data
      doctorName.value = data.fullName
      if (data.scheduleJson) {
        try {
          schedule.value = JSON.parse(data.scheduleJson)
        } catch {
          schedule.value = {}
        }
      }
    }
  } catch (error) {
    toast.error('Không thể tải lịch làm việc')
    router.push('/admin-doctors')
  } finally {
    loading.value = false
  }
}

const saveSchedule = async () => {
  const id = route.params.id as string
  if (!id) return

  saving.value = true
  try {
    const response = await adminDoctorApi.updateSchedule(parseInt(id), {
      scheduleJson: JSON.stringify(schedule.value),
    })
    if (response.data.success) {
      toast.success('Lưu lịch làm việc thành công')
    }
  } catch (error) {
    toast.error('Lưu lịch thất bại')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSchedule()
})
</script>

<style scoped>
.doctor-schedule {
  max-width: 1120px;
}

.doctor-schedule h2 {
  color: var(--text);
  font-size: clamp(1.8rem, 3vw, 2.35rem);
}

.schedule-card {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.schedule-card .card-body {
  padding: clamp(1.25rem, 3vw, 2.25rem);
}

.schedule-intro {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.schedule-kicker {
  color: var(--secondary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.schedule-intro h5 {
  margin-top: 0.35rem;
  font-size: 1.35rem;
}

.schedule-intro p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.schedule-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem;
  background: var(--surface-alt);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.day-label {
  min-width: 110px;
  font-weight: 600;
}

.time-slots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-slot {
  min-width: 76px;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  background: var(--surface);
  color: var(--text-soft);
  text-align: center;
}

.time-slot:hover {
  border-color: #2c3e50;
  transform: scale(1.05);
}

.time-slot.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.time-slot.active:hover {
  background: #218838;
  border-color: #218838;
}

.schedule-guide {
  padding: 1rem 1.1rem;
  background: var(--soft-peach);
  border: 1px solid var(--secondary-light);
  border-radius: var(--radius-sm);
}

.schedule-guide h6 {
  color: var(--secondary-dark);
}

@media (max-width: 768px) {
  .doctor-schedule-header {
    align-items: flex-start !important;
    flex-direction: column;
    gap: 1rem;
  }

  .doctor-schedule-header h2 {
    margin-bottom: 0;
  }

  .doctor-schedule-actions {
    display: flex;
    width: 100%;
    gap: 0.6rem;
  }

  .doctor-schedule-actions .btn {
    flex: 1;
  }

  .schedule-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .day-label {
    min-width: 0;
  }

  .time-slots {
    width: 100%;
  }

  .time-slot {
    flex: 1 1 76px;
  }
}

@media (max-width: 480px) {
  .doctor-schedule h2 {
    font-size: 1.7rem;
  }

  .doctor-schedule-actions {
    flex-direction: column;
  }

  .doctor-schedule-actions .btn {
    width: 100%;
  }

  .schedule-card .card-body {
    padding: 1rem;
  }

  .schedule-row {
    padding: 0.75rem;
  }

  .time-slot {
    flex-basis: calc(50% - 0.4rem);
  }
}
</style>
