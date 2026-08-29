<template>
  <AdminLayout>
    <div class="doctor-schedule">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý lịch làm việc</h2>
        <div>
          <router-link to="/admin/doctors" class="btn btn-secondary me-2">
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

      <div v-else class="card">
        <div class="card-body">
          <h5 class="mb-3">Lịch làm việc của {{ doctorName }}</h5>
          <p class="text-muted small">Chọn các khung giờ bác sĩ làm việc trong tuần</p>

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

          <div class="mt-4">
            <h6 class="mb-2">Hướng dẫn</h6>
            <ul class="text-muted small">
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
    router.push('/admin/doctors')
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
  padding: 20px;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.day-label {
  min-width: 100px;
  font-weight: 600;
}

.time-slots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-slot {
  padding: 6px 14px;
  border: 2px solid #dee2e6;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  background: white;
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
</style>
