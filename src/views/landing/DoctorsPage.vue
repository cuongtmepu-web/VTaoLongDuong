<template>
  <DefaultLayout>
    <div class="doctors-page py-5">
      <div class="container">
        <h2 class="text-center mb-4">Đội ngũ bác sĩ</h2>
        <p class="text-center text-muted mb-5">Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với nghề</p>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="doctors.length === 0" class="text-center py-5">
          <p class="text-muted">Chưa có thông tin bác sĩ</p>
        </div>

        <div v-else class="row g-4">
          <div class="col-md-4" v-for="doctor in doctors" :key="doctor.doctorId">
            <div class="doctor-card">
              <div class="doctor-image">
                <img
                  :src="doctor.avatarUrl || '/images/doctor-default.jpg'"
                  :alt="doctor.fullName"
                  class="img-fluid rounded-circle"
                />
                <span v-if="doctor.isAvailable" class="status-badge available">Online</span>
                <span v-else class="status-badge offline">Offline</span>
              </div>
              <div class="doctor-info text-center">
                <h4>{{ doctor.fullName }}</h4>
                <p class="text-muted">{{ doctor.specialization }}</p>
                <p class="text-primary">{{ doctor.yearsOfExperience }} năm kinh nghiệm</p>
                <p class="text-success fw-bold">{{ formatCurrency(doctor.consultationFee) }}</p>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    class="btn btn-primary"
                    @click="bookAppointment(doctor.doctorId)"
                    :disabled="!doctor.isAvailable"
                  >
                    Đặt lịch
                  </button>
                  <button class="btn btn-outline-secondary" @click="viewDoctor(doctor.doctorId)">
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/api/stores/auth'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)
const doctors = ref<Doctor[]>([])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchDoctors = async () => {
  loading.value = true
  try {
    const response = await doctorApi.getAll()
    if (response.data.success) {
      doctors.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bác sĩ')
  } finally {
    loading.value = false
  }
}

const bookAppointment = (doctorId: number) => {
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để đặt lịch')
    router.push('/login')
    return
  }
  router.push(`/user/appointments/book?doctorId=${doctorId}`)
}

const viewDoctor = (doctorId: number) => {
  router.push(`/bac-si/${doctorId}`)
}

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>
.doctors-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.doctor-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.doctor-card:hover {
  transform: translateY(-5px);
}

.doctor-image {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 15px;
}

.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
}

.status-badge.available {
  background: #28a745;
}

.status-badge.offline {
  background: #dc3545;
}
</style>
