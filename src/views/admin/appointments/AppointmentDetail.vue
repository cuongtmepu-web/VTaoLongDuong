<template>
  <AdminLayout>
    <div class="appointment-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết lịch hẹn</h2>
        <div>
          <router-link to="/admin/appointments" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Quay lại
          </router-link>
          <button
            class="btn btn-primary"
            @click="createMedicalRecord"
            v-if="appointment?.status === 'Confirmed'"
          >
            <i class="bi bi-file-medical"></i> Tạo hồ sơ
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="appointment" class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <h4>Lịch hẹn #{{ appointment.appointmentId }}</h4>
                <span :class="getStatusClass(appointment.status)" class="badge fs-6">
                  {{ getStatusText(appointment.status) }}
                </span>
              </div>

              <div class="appointment-info">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Người dùng</label>
                      <p class="fw-bold">{{ appointment.userName }}</p>
                      <p class="text-muted small">{{ appointment.email }}</p>
                      <p class="text-muted small">{{ appointment.phone }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Bác sĩ</label>
                      <p class="fw-bold">{{ appointment.doctorName }}</p>
                    </div>
                  </div>
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

              <div class="mt-4">
                <h6>Thao tác</h6>
                <div class="d-flex gap-2">
                  <button
                    v-if="appointment.status === 'Pending'"
                    class="btn btn-success"
                    @click="updateStatus('Confirmed')"
                  >
                    <i class="bi bi-check-circle"></i> Xác nhận
                  </button>
                  <button
                    v-if="appointment.status === 'Confirmed'"
                    class="btn btn-success"
                    @click="updateStatus('Completed')"
                  >
                    <i class="bi bi-check-circle"></i> Hoàn thành
                  </button>
                  <button
                    v-if="appointment.status === 'Pending' || appointment.status === 'Confirmed'"
                    class="btn btn-danger"
                    @click="updateStatus('Cancelled')"
                  >
                    <i class="bi bi-x-circle"></i> Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Thông tin thêm</h5>
            </div>
            <div class="card-body">
              <div class="info-item">
                <label class="text-muted">Trạng thái</label>
                <p>
                  <span :class="getStatusClass(appointment.status)" class="badge fs-6">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </p>
              </div>
              <div class="info-item">
                <label class="text-muted">Phí tư vấn</label>
                <p class="fw-bold text-primary">
                  {{ formatCurrency(appointment.consultationFee || 0) }}
                </p>
              </div>
              <div class="info-item">
                <label class="text-muted">Thời gian</label>
                <p>{{ appointment.duration }} phút</p>
              </div>

              <hr />

              <div class="d-grid gap-2">
                <button
                  class="btn btn-outline-primary"
                  @click="sendReminder"
                  v-if="appointment.status === 'Confirmed'"
                >
                  <i class="bi bi-envelope"></i> Gửi email nhắc nhở
                </button>
                <button class="btn btn-outline-secondary" @click="printAppointment">
                  <i class="bi bi-printer"></i> In lịch hẹn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-calendar-x display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy lịch hẹn</h4>
        <router-link to="/admin/appointments" class="btn btn-primary mt-3">Quay lại</router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminAppointmentApi } from '@/api/admin/adminAppointment'
import type { Appointment, AppointmentStatus } from '@/api/types/appointment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const appointment = ref<Appointment | null>(null)

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

const fetchAppointment = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await adminAppointmentApi.getById(parseInt(id))
    if (response.data.success) {
      appointment.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải thông tin lịch hẹn')
    router.push('/admin/appointments')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (status: AppointmentStatus) => {
  if (!appointment.value) return
  if (!confirm(`Bạn có chắc muốn cập nhật trạng thái lịch hẹn thành ${getStatusText(status)}?`))
    return

  try {
    const response = await adminAppointmentApi.updateStatus(appointment.value.appointmentId, {
      status,
    })
    if (response.data.success) {
      toast.success('Cập nhật trạng thái thành công')
      await fetchAppointment()
    }
  } catch (error) {
    toast.error('Cập nhật thất bại')
  }
}

const createMedicalRecord = () => {
  if (!appointment.value) return
  router.push(`/admin/medical-records/create?appointmentId=${appointment.value.appointmentId}`)
}

const sendReminder = () => {
  toast.info('Chức năng đang được phát triển')
}

const printAppointment = () => {
  window.print()
}

onMounted(() => {
  fetchAppointment()
})
</script>

<style scoped>
.appointment-detail {
  padding: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 2px;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}
</style>
