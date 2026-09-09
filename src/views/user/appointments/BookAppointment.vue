<template>
  <UserLayout>
    <div class="book-appointment">
      <h2 class="mb-4">Đặt lịch tư vấn</h2>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <!-- Step 1: Chọn bác sĩ -->
                <div class="mb-4" v-if="step === 1">
                  <h5 class="mb-3">Chọn bác sĩ</h5>
                  <div class="row g-3">
                    <div class="col-md-6" v-for="doctor in doctors" :key="doctor.doctorId">
                      <div
                        class="doctor-card p-3 border rounded cursor-pointer"
                        :class="{
                          'border-primary bg-primary-10': selectedDoctor === doctor.doctorId,
                        }"
                        @click="selectedDoctor = doctor.doctorId"
                      >
                        <div class="d-flex align-items-center">
                          <div class="doctor-avatar me-3">
                            <img
                              :src="doctor.avatarUrl || '/images/doctor-default.jpg'"
                              :alt="doctor.fullName"
                              class="rounded-circle"
                              width="60"
                              height="60"
                            />
                          </div>
                          <div>
                            <h6 class="mb-1">{{ doctor.fullName }}</h6>
                            <small class="text-muted">{{ doctor.specialization }}</small>
                            <div>
                              <span class="badge bg-success" v-if="doctor.isAvailable"
                                >Đang hoạt động</span
                              >
                              <span class="badge bg-secondary" v-else>Đang bận</span>
                            </div>
                            <small class="text-primary"
                              >Phí tư vấn: {{ formatCurrency(doctor.consultationFee) }}</small
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <button
                      type="button"
                      class="btn btn-primary"
                      :disabled="!selectedDoctor"
                      @click="step = 2"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>

                <!-- Step 2: Chọn ngày giờ -->
                <div class="mb-4" v-if="step === 2">
                  <h5 class="mb-3">Chọn ngày và giờ</h5>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Ngày hẹn</label>
                      <DatePicker
                        v-model="appointment.date"
                        label="Ngày hẹn"
                        :min="minDate"
                        @update:model-value="fetchAvailableSlots"
                      />
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Giờ hẹn</label>
                      <BaseSelect
                        v-model="appointment.time"
                        :options="[
                          { value: '', label: 'Chọn giờ' },
                          ...availableSlots.map((slot) => ({
                            value: slot,
                            label: formatTime(slot),
                          })),
                        ]"
                        :disabled="!appointment.date || loadingSlots"
                      />
                      <small v-if="loadingSlots" class="text-muted">Đang tải...</small>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Triệu chứng / Lý do khám</label>
                    <textarea
                      class="form-control"
                      v-model="appointment.symptoms"
                      rows="3"
                      placeholder="Mô tả triệu chứng hoặc lý do bạn muốn khám..."
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Ghi chú thêm</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="appointment.notes"
                      placeholder="Ghi chú thêm cho bác sĩ (nếu có)"
                    />
                  </div>

                  <div>
                    <button type="button" class="btn btn-secondary me-2" @click="step = 1">
                      Quay lại
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      :disabled="!appointment.date || !appointment.time"
                      @click="step = 3"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>

                <!-- Step 3: Xác nhận -->
                <div class="mb-4" v-if="step === 3">
                  <h5 class="mb-3">Xác nhận lịch hẹn</h5>

                  <div class="confirmation-box bg-light p-4 rounded">
                    <div class="row">
                      <div class="col-sm-6">
                        <p><strong>Bác sĩ:</strong> {{ selectedDoctorInfo?.fullName }}</p>
                        <p><strong>Ngày:</strong> {{ formatDate(appointment.date) }}</p>
                        <p><strong>Giờ:</strong> {{ formatTime(appointment.time) }}</p>
                      </div>
                      <div class="col-sm-6">
                        <p>
                          <strong>Triệu chứng:</strong> {{ appointment.symptoms || 'Không có' }}
                        </p>
                        <p>
                          <strong>Phí tư vấn:</strong>
                          {{ formatCurrency(selectedDoctorInfo?.consultationFee || 0) }}
                        </p>
                        <p><strong>Ghi chú:</strong> {{ appointment.notes || 'Không có' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <button type="button" class="btn btn-secondary me-2" @click="step = 2">
                      Quay lại
                    </button>
                    <button type="submit" class="btn btn-success" :disabled="submitting">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      Xác nhận đặt lịch
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Thông tin lưu ý</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li class="mb-3">
                  <i class="bi bi-clock text-warning"></i>
                  <strong>Thời gian tư vấn:</strong> 60 phút
                </li>
                <li class="mb-3">
                  <i class="bi bi-credit-card text-primary"></i>
                  <strong>Phí tư vấn:</strong> Thanh toán tại quầy
                </li>
                <li class="mb-3">
                  <i class="bi bi-calendar-check text-success"></i>
                  <strong>Xác nhận:</strong> Qua email và SMS
                </li>
                <li>
                  <i class="bi bi-info-circle text-info"></i>
                  <strong>Lưu ý:</strong> Đến đúng giờ, mang theo các giấy tờ cần thiết
                </li>
              </ul>
              <hr />
              <div class="text-muted small">
                <p>📞 Hotline hỗ trợ: 0987 654 321</p>
                <p>📧 Email: contact@taolongduong.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import { useAppointmentStore } from '@/api/stores/appointment'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const appointmentStore = useAppointmentStore()

const step = ref(1)
const loading = ref(false)
const loadingSlots = ref(false)
const submitting = ref(false)
const doctors = ref<Doctor[]>([])
const availableSlots = ref<string[]>([])
const selectedDoctor = ref<number | null>(null)

const appointment = ref({
  doctorId: null as number | null,
  date: '',
  time: '',
  symptoms: '',
  notes: '',
})

const minDate = computed(() => {
  return dayjs().add(1, 'day').format('YYYY-MM-DD')
})

const selectedDoctorInfo = computed(() => {
  return doctors.value.find((d) => d.doctorId === selectedDoctor.value)
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(`2000-01-01 ${time}`).format('HH:mm')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchDoctors = async () => {
  loading.value = true
  try {
    const response = await doctorApi.getAll()
    if (response.data.success) {
      doctors.value = response.data.data

      // Check if doctorId is passed in query
      const doctorId = route.query.doctorId
      if (doctorId) {
        const doctor = doctors.value.find((d) => d.doctorId === parseInt(doctorId as string))
        if (doctor && doctor.isAvailable) {
          selectedDoctor.value = doctor.doctorId
        }
      }
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bác sĩ')
  } finally {
    loading.value = false
  }
}

const fetchAvailableSlots = async () => {
  if (!selectedDoctor.value || !appointment.value.date) return

  loadingSlots.value = true
  try {
    const response = await doctorApi.getAvailableSlots(selectedDoctor.value, appointment.value.date)
    if (response.data.success) {
      availableSlots.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải khung giờ trống')
  } finally {
    loadingSlots.value = false
  }
}

const handleSubmit = async () => {
  if (!selectedDoctor.value || !appointment.value.date || !appointment.value.time) {
    toast.warning('Vui lòng chọn đầy đủ thông tin')
    return
  }

  submitting.value = true
  try {
    const data = {
      doctorId: selectedDoctor.value,
      appointmentDate: appointment.value.date,
      appointmentTime: appointment.value.time,
      symptoms: appointment.value.symptoms,
      notes: appointment.value.notes,
    }

    const success = await appointmentStore.bookAppointment(data)
    if (success) {
      router.push('/user/appointments')
    }
  } catch (error) {
    toast.error('Đặt lịch thất bại')
  } finally {
    submitting.value = false
  }
}

// Watch for doctor selection change to reset slots
watch(selectedDoctor, () => {
  availableSlots.value = []
  appointment.value.time = ''
})

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>
.book-appointment {
  padding: 20px;
}

.doctor-card {
  cursor: pointer;
  transition: all 0.3s;
}

.doctor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-primary-10 {
  background-color: rgba(13, 110, 253, 0.1);
}

.confirmation-box {
  border-left: 4px solid #28a745;
}
</style>
