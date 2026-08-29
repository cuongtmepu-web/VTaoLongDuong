<template>
  <AdminLayout>
    <div class="doctor-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý bác sĩ</h2>
        <router-link to="/admin/doctors/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Thêm bác sĩ
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Chuyên khoa</th>
                    <th>Kinh nghiệm</th>
                    <th>Phí tư vấn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doctor in doctors" :key="doctor.doctorId">
                    <td>{{ doctor.doctorId }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          :src="doctor.avatarUrl || '/images/doctor-default.jpg'"
                          class="rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                        {{ doctor.fullName }}
                      </div>
                    </td>
                    <td>{{ doctor.specialization || 'Chưa cập nhật' }}</td>
                    <td>{{ doctor.yearsOfExperience }} năm</td>
                    <td>{{ formatCurrency(doctor.consultationFee) }}</td>
                    <td>
                      <span
                        :class="doctor.isAvailable ? 'bg-success' : 'bg-secondary'"
                        class="badge"
                      >
                        {{ doctor.isAvailable ? 'Hoạt động' : 'Đang bận' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/doctors/${doctor.doctorId}/edit`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <router-link
                          :to="`/admin/doctors/${doctor.doctorId}/schedule`"
                          class="btn btn-sm btn-outline-info"
                        >
                          <i class="bi bi-calendar"></i>
                        </router-link>
                        <button
                          class="btn btn-sm btn-outline-secondary"
                          @click="toggleDoctorStatus(doctor)"
                        >
                          <i :class="doctor.isAvailable ? 'bi bi-pause' : 'bi bi-play'"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteDoctor(doctor)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminDoctorApi } from '@/api/admin/adminDoctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()
const loading = ref(false)
const doctors = ref<Doctor[]>([])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchDoctors = async () => {
  loading.value = true
  try {
    const response = await adminDoctorApi.getAll()
    if (response.data.success) {
      doctors.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bác sĩ')
  } finally {
    loading.value = false
  }
}

const toggleDoctorStatus = async (doctor: Doctor) => {
  const action = doctor.isAvailable ? 'tạm dừng' : 'kích hoạt'
  if (!confirm(`Bạn có chắc muốn ${action} bác sĩ ${doctor.fullName}?`)) return

  try {
    const response = await adminDoctorApi.updateAvailability(doctor.doctorId, {
      isAvailable: !doctor.isAvailable,
    })
    if (response.data.success) {
      toast.success(`Đã ${action} bác sĩ`)
      await fetchDoctors()
    }
  } catch (error) {
    toast.error('Thao tác thất bại')
  }
}

const deleteDoctor = async (doctor: Doctor) => {
  if (!confirm(`Bạn có chắc muốn xóa bác sĩ ${doctor.fullName}?`)) return

  try {
    const response = await adminDoctorApi.delete(doctor.doctorId)
    if (response.data.success) {
      toast.success('Xóa bác sĩ thành công')
      await fetchDoctors()
    }
  } catch (error) {
    toast.error('Xóa thất bại')
  }
}

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>
.doctor-list {
  padding: 20px;
}
</style>
