<template>
  <AdminLayout>
    <div class="record-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">{{ isEdit ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới' }}</h2>
        <router-link to="/admin/medical-records" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Người dùng *</label>
                <select class="form-select" v-model="form.userId" required>
                  <option value="">Chọn người dùng</option>
                  <option v-for="user in users" :key="user.userId" :value="user.userId">
                    {{ user.fullName }} ({{ user.email }})
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Bác sĩ *</label>
                <select class="form-select" v-model="form.doctorId" required>
                  <option value="">Chọn bác sĩ</option>
                  <option v-for="doctor in doctors" :key="doctor.doctorId" :value="doctor.doctorId">
                    {{ doctor.fullName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Lịch hẹn (tùy chọn)</label>
                <select class="form-select" v-model="form.appointmentId">
                  <option value="">Chọn lịch hẹn</option>
                  <option
                    v-for="appt in appointments"
                    :key="appt.appointmentId"
                    :value="appt.appointmentId"
                  >
                    {{ appt.userName }} - {{ formatDate(appt.appointmentDate) }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày tái khám</label>
                <input type="date" class="form-control" v-model="form.followUpDate" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Chẩn đoán</label>
              <textarea class="form-control" v-model="form.diagnosis" rows="2"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Triệu chứng</label>
              <textarea class="form-control" v-model="form.symptoms" rows="2"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Chẩn đoán Đông y</label>
              <textarea
                class="form-control"
                v-model="form.traditionalDiagnosis"
                rows="2"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Phác đồ điều trị</label>
              <textarea class="form-control" v-model="form.treatmentPlan" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Ghi chú</label>
              <textarea class="form-control" v-model="form.notes" rows="2"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Đơn thuốc (JSON)</label>
              <textarea
                class="form-control"
                v-model="form.prescriptionJson"
                rows="4"
                placeholder='[{"medicineName":"Thuốc A","dosage":"2 viên","unit":"lần","quantity":10,"instructions":"Uống sau ăn"}]'
              ></textarea>
              <small class="text-muted">Nhập đơn thuốc dạng JSON</small>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
              </button>
              <router-link to="/admin/medical-records" class="btn btn-secondary">Hủy</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminMedicalRecordApi } from '@/api/admin/adminMedicalRecord'
import { adminUserApi } from '@/api/admin/adminUser'
import { adminDoctorApi } from '@/api/admin/adminDoctor'
import { adminAppointmentApi } from '@/api/admin/adminAppointment'
import type { User } from '@/api/types/auth'
import type { Doctor } from '@/api/types/doctor'
import type { Appointment } from '@/api/types/appointment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const submitting = ref(false)
const users = ref<User[]>([])
const doctors = ref<Doctor[]>([])
const appointments = ref<Appointment[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  userId: null as number | null,
  doctorId: null as number | null,
  appointmentId: null as number | null,
  diagnosis: '',
  symptoms: '',
  traditionalDiagnosis: '',
  treatmentPlan: '',
  prescriptionJson: '',
  followUpDate: '',
  notes: '',
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const fetchUsers = async () => {
  try {
    const response = await adminUserApi.getUsers({ role: 'User' })
    if (response.data.success) {
      users.value = response.data.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách người dùng')
  }
}

const fetchDoctors = async () => {
  try {
    const response = await adminDoctorApi.getAll()
    if (response.data.success) {
      doctors.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bác sĩ')
  }
}

const fetchAppointments = async () => {
  try {
    const response = await adminAppointmentApi.getAll()
    if (response.data.success) {
      appointments.value = response.data.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách lịch hẹn')
  }
}

const fetchRecord = async () => {
  const id = route.params.id as string
  if (!id) return

  try {
    const response = await adminMedicalRecordApi.getById(parseInt(id))
    if (response.data.success) {
      const data = response.data.data
      Object.assign(form, {
        userId: data.userId,
        doctorId: data.doctorId,
        appointmentId: data.appointmentId || null,
        diagnosis: data.diagnosis || '',
        symptoms: data.symptoms || '',
        traditionalDiagnosis: data.traditionalDiagnosis || '',
        treatmentPlan: data.treatmentPlan || '',
        prescriptionJson: data.prescriptionJson || '',
        followUpDate: data.followUpDate || '',
        notes: data.notes || '',
      })
    }
  } catch (error) {
    toast.error('Không thể tải thông tin hồ sơ')
    router.push('/admin/medical-records')
  }
}

const handleSubmit = async () => {
  if (!form.userId || !form.doctorId) {
    toast.warning('Vui lòng chọn người dùng và bác sĩ')
    return
  }

  submitting.value = true
  try {
    const data = {
      userId: form.userId,
      doctorId: form.doctorId,
      appointmentId: form.appointmentId || undefined,
      diagnosis: form.diagnosis,
      symptoms: form.symptoms,
      traditionalDiagnosis: form.traditionalDiagnosis,
      treatmentPlan: form.treatmentPlan,
      prescriptionJson: form.prescriptionJson,
      followUpDate: form.followUpDate || undefined,
      notes: form.notes,
    }

    let response
    if (isEdit.value) {
      response = await adminMedicalRecordApi.update(parseInt(route.params.id as string), data)
    } else {
      response = await adminMedicalRecordApi.create(data)
    }

    if (response.data.success) {
      toast.success(isEdit.value ? 'Cập nhật hồ sơ thành công' : 'Tạo hồ sơ thành công')
      router.push('/admin/medical-records')
    }
  } catch (error) {
    toast.error('Lưu thông tin thất bại')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
  fetchDoctors()
  fetchAppointments()
  if (isEdit.value) {
    fetchRecord()
  }
})
</script>

<style scoped>
.record-form {
  padding: 20px;
}
</style>
