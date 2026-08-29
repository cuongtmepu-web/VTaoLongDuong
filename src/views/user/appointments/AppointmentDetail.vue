<template>
  <UserLayout>
    <div class="appointment-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết lịch hẹn</h2>
        <router-link to="/user/appointments" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="appointment" class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <h4>{{ appointment.doctorName }}</h4>
                <span :class="getStatusClass(appointment.status)" class="badge fs-6">
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>

              <div class="appointment-info">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Ngày hẹn</label>
                      <p class="fw-bold">{{ formatDate(appointment.appointmentDate) }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Giờ hẹn</label>
                      <p class="fw-bold">{{ formatTime(appointment.appointmentTime) }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Thời gian dự kiến</label>
                      <p class="fw-bold">{{ appointment.duration }} phút</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Phí tư vấn</label>
                      <p class="fw-bold text-primary">
                        {{ formatCurrency(appointment.consultationFee || 0) }}
                      </p>
                    </div>
                  </div>
                </div>

                <hr />

                <div class="info-item">
                  <label class="text-muted">Triệu chứng</label>
                  <p>{{ appointment.symptoms || 'Không có' }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Ghi chú</label>
                  <p>{{ appointment.notes || 'Không có' }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Ngày đặt</label>
                  <p>{{ formatDateTime(appointment.createdAt) }}</p>
                </div>
              </div>

              <div class="mt-4" v-if="canCancel">
                <button class="btn btn-danger" @click="cancelAppointment">Hủy lịch hẹn</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Thông tin bác sĩ</h5>
            </div>
            <div class="card-body text-center">
              <img
                :src="doctorInfo?.avatarUrl || '/images/doctor-default.jpg'"
                :alt="doctorInfo?.fullName"
                class="rounded-circle mb-3"
                width="100"
                height="100"
              />
              <h5>{{ doctorInfo?.fullName }}</h5>
              <p class="text-muted">{{ doctorInfo?.specialization }}</p>
              <p class="text-muted small">{{ doctorInfo?.yearsOfExperience }} năm kinh nghiệm</p>
              <hr />
              <div class="text-start text-muted small">
                <p>
                  <i class="bi bi-star-fill text-warning"></i> Chuyên môn:
                  {{ doctorInfo?.specialization }}
                </p>
                <p><i class="bi bi-clock"></i> Lịch làm việc: Theo lịch hẹn</p>
              </div>
            </div>
          </div>

          <div class="card mt-3" v-if="appointment.status === 'Completed'">
            <div class="card-header">
              <h5 class="mb-0">Hồ sơ bệnh án</h5>
            </div>
            <div class="card-body">
              <p class="text-muted text-center">Hồ sơ bệnh án đã được tạo</p>
              <button class="btn btn-outline-primary w-100">
                <i class="bi bi-file-medical"></i> Xem hồ sơ bệnh án
              </button>
            </div>
          </div>

          <div class="card mt-3" v-if="appointment.status === 'Pending'">
            <div class="card-body bg-light">
              <div class="d-flex align-items-center">
                <i class="bi bi-clock-history text-warning fs-3 me-3"></i>
                <div>
                  <p class="mb-0 fw-bold">Đang chờ xác nhận</p>
                  <small class="text-muted">Vui lòng đợi bác sĩ xác nhận lịch hẹn</small>
                </div>
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
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import { useAppointmentStore } from '@/api/stores/appointment'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const appointmentStore = useAppointmentStore()

const loading = ref(false)
const doctorInfo = ref<Doctor | null>(null)

const appointment = computed(() => appointmentStore.currentAppointment)

const canCancel = computed(() => {
  if (!appointment.value) return false
  return appointment.value.status === 'Pending' || appointment.value.status === 'Confirmed'
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    await appointmentStore.fetchAppointmentById(parseInt(id))

    if (appointment.value) {
      const response = await doctorApi.getById(appointment.value.doctorId)
      if (response.data.success) {
        doctorInfo.value = response.data.data
      }
    }
  } catch (error) {
    toast.error('Không thể tải thông tin lịch hẹn')
    router.push('/user/appointments')
  } finally {
    loading.value = false
  }
}

const cancelAppointment = async () => {
  if (!appointment.value) return
  if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return

  const success = await appointmentStore.cancelAppointment(
    appointment.value.appointmentId,
    'Hủy bởi người dùng',
  )
  if (success) {
    await fetchData()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.appointment-detail {
  padding: 1.5rem;
}

.info-item {
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.8), rgba(240, 253, 250, 0.7));
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
}

.info-item label {
  display: block;
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
  color: #64748b;
  letter-spacing: 0.02em;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
}
</style>
